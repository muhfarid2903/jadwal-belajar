/* Akses SQLite bersama untuk server.js dan notify.js.
   Memakai `node:sqlite` bawaan Node, jadi tidak ada modul native dan image
   tidak perlu toolchain build. Satu berkas basis data saja, ditaruh di /data
   supaya ikut volume container dan mudah di-backup. */
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');

const DB_PATH = process.env.DB_PATH || '/data/jadwal.db';
const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- Progres belajar disimpan sebagai satu baris JSON: app ini dipakai satu
  -- orang, dan client memang selalu mengirim/menerima state utuh (sama seperti
  -- dokumen tunggal di Firestore sebelumnya).
  CREATE TABLE IF NOT EXISTS state (
    id         INTEGER PRIMARY KEY CHECK (id = 1),
    json       TEXT    NOT NULL,
    version    INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT    NOT NULL
  );

  -- Langganan Web Push per perangkat, pengganti koleksi fcmTokens.
  CREATE TABLE IF NOT EXISTS push_subs (
    endpoint   TEXT PRIMARY KEY,
    p256dh     TEXT NOT NULL,
    auth       TEXT NOT NULL,
    ua         TEXT,
    created_at TEXT NOT NULL
  );

  -- Token sesi disimpan ter-hash, supaya berkas basis data yang bocor tidak
  -- langsung memberi akses.
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    ua         TEXT,
    created_at TEXT NOT NULL,
    last_seen  TEXT
  );

  -- Setelan internal, saat ini hanya kunci VAPID yang dibuat sendiri saat
  -- start pertama (lihat vapid()).
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

const EMPTY_STATE = { data: {}, topics: {}, terms: {}, lang: 'id' };
const now = () => new Date().toISOString();
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

/* ── STATE ── */
function getState() {
  const row = db.prepare('SELECT json, version, updated_at FROM state WHERE id = 1').get();
  if (!row) return { ...EMPTY_STATE, version: 0, updatedAt: null };
  let parsed;
  try {
    parsed = JSON.parse(row.json);
  } catch {
    parsed = { ...EMPTY_STATE };
  }
  return { ...EMPTY_STATE, ...parsed, version: row.version, updatedAt: row.updated_at };
}

/* Version dinaikkan tiap tulis supaya client bisa mendeteksi perubahan tanpa
   membandingkan seluruh isi, dan dipakai sebagai fallback saat SSE terputus. */
function putState(state) {
  const json = JSON.stringify({
    data: state.data || {},
    topics: state.topics || {},
    terms: state.terms || {},
    lang: state.lang || 'id',
  });
  const row = db.prepare('SELECT version FROM state WHERE id = 1').get();
  const version = (row ? row.version : 0) + 1;
  db.prepare(
    `INSERT INTO state (id, json, version, updated_at) VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET json = excluded.json,
                                   version = excluded.version,
                                   updated_at = excluded.updated_at`
  ).run(json, version, now());
  return getState();
}

/* ── SESI ── */
function createSession(ua) {
  const token = crypto.randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessions (token_hash, ua, created_at, last_seen) VALUES (?, ?, ?, ?)')
    .run(sha256(token), ua || null, now(), now());
  return token;
}

function validSession(token) {
  if (!token) return false;
  const hash = sha256(token);
  const row = db.prepare('SELECT token_hash FROM sessions WHERE token_hash = ?').get(hash);
  if (!row) return false;
  db.prepare('UPDATE sessions SET last_seen = ? WHERE token_hash = ?').run(now(), hash);
  return true;
}

function deleteSession(token) {
  if (!token) return;
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
}

/* ── LANGGANAN PUSH ── */
function saveSub(sub, ua) {
  db.prepare(
    `INSERT INTO push_subs (endpoint, p256dh, auth, ua, created_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh,
                                        auth = excluded.auth,
                                        ua = excluded.ua`
  ).run(sub.endpoint, sub.keys.p256dh, sub.keys.auth, ua || null, now());
}

function allSubs() {
  return db
    .prepare('SELECT endpoint, p256dh, auth FROM push_subs')
    .all()
    .map((r) => ({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }));
}

function deleteSub(endpoint) {
  db.prepare('DELETE FROM push_subs WHERE endpoint = ?').run(endpoint);
}

/* ── KUNCI VAPID ──
   Dibuat sendiri saat start pertama dan disimpan di basis data, jadi tidak ada
   kunci yang perlu ditaruh di repo maupun di .env. Env tetap didahulukan kalau
   suatu saat kuncinya ingin dipasok dari luar. */
function vapid() {
  if (process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE) {
    return { publicKey: process.env.VAPID_PUBLIC, privateKey: process.env.VAPID_PRIVATE };
  }
  const get = (k) => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(k);
    return row ? row.value : null;
  };
  let pub = get('vapid_public');
  let priv = get('vapid_private');
  if (!pub || !priv) {
    const keys = require('web-push').generateVAPIDKeys();
    pub = keys.publicKey;
    priv = keys.privateKey;
    const set = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    set.run('vapid_public', pub);
    set.run('vapid_private', priv);
  }
  return { publicKey: pub, privateKey: priv };
}

module.exports = {
  db,
  DB_PATH,
  EMPTY_STATE,
  getState,
  putState,
  createSession,
  validSession,
  deleteSession,
  saveSub,
  allSubs,
  deleteSub,
  vapid,
};
