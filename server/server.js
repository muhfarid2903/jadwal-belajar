/* API untuk app Jadwal Belajar: login, sync progres, dan langganan Web Push.
   Menggantikan Firebase Auth, Firestore, dan Cloud Messaging sekaligus.

   Dilayani di belakang Traefik pada prefiks /api, satu origin dengan situs
   statisnya — jadi tidak ada CORS dan cookie sesi cukup SameSite=Strict.

   Tanpa framework: rutenya sedikit dan `node:http` sudah memadai, sehingga
   satu-satunya dependensi tetap web-push. */
const http = require('node:http');
const crypto = require('node:crypto');
const {
  getState,
  putState,
  createSession,
  validSession,
  deleteSession,
  saveSub,
  deleteSub,
  vapid,
  DB_PATH,
} = require('./db');
const { sendToAll } = require('./push');

const PORT = Number(process.env.PORT || 8080);
const COOKIE = 'jb_session';
const YEAR = 60 * 60 * 24 * 365;
const MAX_BODY = 2 * 1024 * 1024; // progres bertahun-tahun pun jauh di bawah ini

/* ── PASSPHRASE ──
   Disimpan sebagai hash scrypt bergaram di env, format `salt:hash` (hex),
   dihasilkan oleh hash-passphrase.js. Server tetap boleh start tanpa env ini
   supaya hash-passphrase.js bisa dijalankan di dalam container yang sudah
   hidup; /api/login yang menolak dengan 503 sampai env-nya dipasang. */
const SCRYPT = process.env.PASSPHRASE_SCRYPT || '';

function passphraseOk(input) {
  if (!SCRYPT.includes(':')) return false;
  const [saltHex, hashHex] = SCRYPT.split(':');
  let expected;
  let actual;
  try {
    expected = Buffer.from(hashHex, 'hex');
    actual = crypto.scryptSync(input, Buffer.from(saltHex, 'hex'), expected.length);
  } catch {
    return false;
  }
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

/* ── PEMBATASAN PERCOBAAN LOGIN ──
   Di memori saja: satu pengguna, satu proses, dan kalau container restart
   pembatasnya ikut kosong — cukup untuk menutup percobaan menebak passphrase
   secara brute force tanpa menambah tabel. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map();

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function throttled(ip) {
  const rec = fails.get(ip);
  if (!rec) return false;
  if (Date.now() > rec.resetAt) {
    fails.delete(ip);
    return false;
  }
  return rec.count >= MAX_FAILS;
}

function noteFail(ip) {
  const rec = fails.get(ip);
  if (!rec || Date.now() > rec.resetAt) {
    fails.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  rec.count++;
}

/* ── UTILITAS HTTP ── */
function send(res, status, obj, headers = {}) {
  const body = obj === null ? '' : JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('body terlalu besar'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(Object.assign(new Error('JSON tidak valid'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function cookieToken(req) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  return null;
}

const sessionCookie = (token) =>
  `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${YEAR}`;
const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

/* ── SSE ──
   Pengganti onSnapshot Firestore: tiap perubahan state disiarkan ke semua
   perangkat yang terhubung. Otentikasinya lewat cookie, karena EventSource
   tidak bisa mengirim header dan token tidak boleh ditaruh di query string. */
const clients = new Set();

function broadcast(state) {
  const line = `data: ${JSON.stringify(state)}\n\n`;
  for (const res of clients) {
    try {
      res.write(line);
    } catch {
      clients.delete(res);
    }
  }
}

function openStream(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 5000\n\n');
  res.write(`data: ${JSON.stringify(getState())}\n\n`);
  clients.add(res);

  // Komentar berkala menjaga koneksi tetap hidup melewati proxy dan NAT.
  const beat = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      /* ditangani oleh close */
    }
  }, 25000);

  const done = () => {
    clearInterval(beat);
    clients.delete(res);
  };
  req.on('close', done);
  req.on('error', done);
}

/* ── ROUTING ── */
// Didaftarkan lengkap dengan metode yang diizinkan supaya rute salah membalas
// 404 dan metode salah membalas 405 — bukan 401 dari penjaga sesi di bawah,
// yang membuat salah ketik URL sulit dikenali.
const ROUTES = {
  '/api/health': ['GET'],
  '/api/config': ['GET'],
  '/api/login': ['POST'],
  '/api/logout': ['POST'],
  '/api/state': ['GET', 'PUT'],
  '/api/events': ['GET'],
  '/api/push/subscribe': ['POST', 'DELETE'],
  '/api/push/test': ['POST'],
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = req.method;

  try {
    const allowed = ROUTES[path];
    if (!allowed) {
      return send(res, 404, { error: 'rute tidak ada' });
    }
    if (!allowed.includes(method)) {
      return send(res, 405, { error: 'metode tidak didukung' }, { Allow: allowed.join(', ') });
    }

    if (path === '/api/health') {
      return send(res, 200, { ok: true, db: DB_PATH });
    }

    /* Kunci publik VAPID disajikan dari sini supaya client tidak perlu
       menanamnya di repo, dan kunci bisa diganti tanpa mengubah kode. */
    if (path === '/api/config' && method === 'GET') {
      return send(res, 200, {
        vapidPublicKey: vapid().publicKey,
        loginReady: SCRYPT.includes(':'),
      });
    }

    if (path === '/api/login' && method === 'POST') {
      const ip = clientIp(req);
      if (throttled(ip)) {
        return send(res, 429, { error: 'terlalu banyak percobaan, coba lagi nanti' });
      }
      if (!SCRYPT.includes(':')) {
        return send(res, 503, { error: 'passphrase belum dipasang di server' });
      }
      const body = await readBody(req);
      if (!passphraseOk(String(body.passphrase || ''))) {
        noteFail(ip);
        return send(res, 401, { error: 'passphrase salah' });
      }
      fails.delete(ip);
      const token = createSession(req.headers['user-agent']);
      return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(token) });
    }

    if (path === '/api/logout' && method === 'POST') {
      deleteSession(cookieToken(req));
      return send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() });
    }

    /* Sisanya butuh sesi. */
    const token = cookieToken(req);
    if (!validSession(token)) {
      return send(res, 401, { error: 'belum masuk' });
    }

    if (path === '/api/state' && method === 'GET') {
      return send(res, 200, getState());
    }

    if (path === '/api/state' && method === 'PUT') {
      const body = await readBody(req);
      const saved = putState(body);
      broadcast(saved);
      return send(res, 200, saved);
    }

    if (path === '/api/events' && method === 'GET') {
      return openStream(req, res);
    }

    if (path === '/api/push/subscribe' && method === 'POST') {
      const sub = await readBody(req);
      if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
        return send(res, 400, { error: 'langganan tidak lengkap' });
      }
      saveSub(sub, req.headers['user-agent']);
      return send(res, 200, { ok: true });
    }

    if (path === '/api/push/subscribe' && method === 'DELETE') {
      const body = await readBody(req);
      if (!body.endpoint) return send(res, 400, { error: 'endpoint wajib' });
      deleteSub(body.endpoint);
      return send(res, 200, { ok: true });
    }

    if (path === '/api/push/test' && method === 'POST') {
      const result = await sendToAll({
        title: 'Jadwal Belajar',
        body: 'Notifikasi uji — jalurnya berfungsi ✓',
      });
      return send(res, 200, result);
    }

    // Tidak terjangkau: ROUTES di atas sudah menyaring path dan metode.
    return send(res, 500, { error: 'rute terdaftar tanpa penanganan' });
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error('kesalahan server:', err);
    if (res.headersSent) return res.end();
    return send(res, status, { error: err.message || 'kesalahan server' });
  }
});

server.listen(PORT, () => {
  console.log(`API jadwal-belajar mendengarkan di :${PORT} (db ${DB_PATH})`);
  if (!SCRYPT.includes(':')) {
    console.warn('PASSPHRASE_SCRYPT belum dipasang — /api/login akan menolak dengan 503.');
    console.warn('Jalankan: docker exec -it jadwal-belajar-api node hash-passphrase.js');
  }
});

const shutdown = () => {
  for (const res of clients) {
    try {
      res.end();
    } catch {
      /* memang sudah tertutup */
    }
  }
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
