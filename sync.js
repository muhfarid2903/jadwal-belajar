/* Sync progres + notifikasi lewat API sendiri di /api — pengganti
   firebase-sync.js (Auth + Firestore + Cloud Messaging).

   Dimuat setelah app.js dan berbagi lingkup teratas dengannya (keduanya tag
   <script> klasik), jadi STATE, L, render, saveLocal, dan T dari app.js bisa
   dipakai langsung di sini. Nama fungsi yang dipanggil app.js dan index.html
   dipertahankan apa adanya — doAuth, renderAuth, cloudSave, doNotif — sehingga
   app.js tidak perlu diubah sama sekali. */

const API = '/api';
let signedIn = false;      // ada sesi yang masih berlaku di server
let firstSync = true;      // snapshot pertama sesudah masuk (lihat applyRemote)
let lastPushed = null;     // isi kiriman terakhir, untuk mengenali gema sendiri
let stream = null;         // EventSource yang aktif
let serverVersion = 0;
let vapidKey = null;

/* ── PEMBANTU ── */
async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    method: opts.method || 'GET',
    headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'same-origin',
    cache: 'no-store',
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* respons tanpa isi */ }
  return { ok: res.ok, status: res.status, data };
}

/* Kunci VAPID datang dari server supaya tidak perlu ditanam di repo dan bisa
   diganti tanpa menyentuh kode client. */
async function loadConfig() {
  try {
    const r = await api('/config');
    if (r.ok && r.data) vapidKey = r.data.vapidPublicKey || null;
  } catch (e) { console.warn('config:', e); }
}

function b64ToU8(b64) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/* ── MASUK / KELUAR ── */
function doAuth() {
  if (signedIn) {
    if (confirm(L === 'id' ? 'Keluar dari akun?' : 'Sign out?')) doLogout();
    return;
  }
  const pass = prompt(L === 'id' ? 'Masukkan passphrase:' : 'Enter passphrase:');
  if (!pass) return;
  api('/login', { method: 'POST', body: { passphrase: pass } })
    .then((r) => {
      if (r.ok) {
        signedIn = true;
        firstSync = true;
        renderAuth();
        startSync();
        return;
      }
      if (r.status === 401) {
        alert(L === 'id' ? 'Passphrase salah.' : 'Wrong passphrase.');
      } else if (r.status === 429) {
        alert(L === 'id'
          ? 'Terlalu banyak percobaan. Coba lagi sekitar 15 menit lagi.'
          : 'Too many attempts. Try again in about 15 minutes.');
      } else if (r.status === 503) {
        alert(L === 'id'
          ? 'Passphrase belum dipasang di server.'
          : 'No passphrase configured on the server yet.');
      } else {
        // 404 dan galat server tidak boleh dilaporkan sebagai passphrase salah:
        // salinan app yang disajikan dari origin tanpa /api (mis. GitHub Pages)
        // akan selalu mendarat di sini, dan pesan "passphrase salah" membuat
        // orang mengira dirinya salah ketik.
        alert((L === 'id'
          ? 'Server sync tidak dapat dihubungi dari alamat ini (kode '
          : 'Cannot reach the sync server from this address (code ') + r.status + ').');
      }
    })
    .catch(() => alert(L === 'id'
      ? 'Tidak bisa menghubungi server. Periksa koneksi internet.'
      : 'Could not reach the server. Check your internet connection.'));
}

function doLogout() {
  api('/logout', { method: 'POST' }).catch(() => {});
  signedIn = false;
  stopStream();
  renderAuth();
  render();
}

/* Tanpa akun Google tidak ada nama atau foto; tombolnya cukup menunjukkan
   apakah perangkat ini tersambung ke server. */
function renderAuth() {
  const btn = document.getElementById('authbtn');
  const av = document.getElementById('auth-av');
  const tx = document.getElementById('auth-tx');
  if (!btn) return;
  av.style.backgroundImage = '';
  if (signedIn) {
    btn.classList.add('signed');
    tx.textContent = L === 'id' ? 'TERSAMBUNG' : 'SYNCED';
    av.textContent = '✓';
  } else {
    btn.classList.remove('signed');
    tx.textContent = L === 'id' ? 'MASUK' : 'SIGN IN';
    av.textContent = '?';
  }
}

/* ── SIMPAN KE SERVER ── */
function cloudSave() {
  if (!signedIn) return;
  const payload = {
    data: STATE.data || {},
    topics: STATE.topics || {},
    terms: STATE.terms || {},
    lang: STATE.lang || 'id',
  };
  // Diingat supaya siaran SSE yang memantulkan tulisan ini kembali bisa
  // dikenali dari isinya, bukan dari penanda sekali pakai yang bisa termakan
  // oleh peristiwa lain.
  lastPushed = JSON.stringify(payload);
  api('/state', { method: 'PUT', body: payload })
    .then((r) => {
      if (r.status === 401) { sessionLost(); return; }
      if (r.ok && r.data) serverVersion = r.data.version;
    })
    .catch((e) => console.warn('cloudSave:', e));
}

function sessionLost() {
  signedIn = false;
  stopStream();
  renderAuth();
}

/* ── TERIMA DARI SERVER ── */
function applyRemote(d) {
  if (!d) return;
  const sData = d.data || {};
  const sTopics = d.topics || {};
  const sTerms = d.terms || {};
  const sLang = d.lang || 'id';
  if (typeof d.version === 'number') serverVersion = d.version;

  if (JSON.stringify({ data: sData, topics: sTopics, terms: sTerms, lang: sLang }) === lastPushed) return;

  if (firstSync) {
    firstSync = false;

    // Server belum pernah ditulis sama sekali: dorong saja isi perangkat ini,
    // termasuk pilihan bahasanya, jangan sampai tertimpa nilai bawaan server.
    if (!d.version) { cloudSave(); return; }

    const lData = STATE.data || {};
    const lTopics = STATE.topics || {};
    const lTerms = STATE.terms || {};
    const newDays = Object.keys(lData).some((k) => !(k in sData));
    const newTopics = Object.keys(lTopics).some((k) => !(k in sTopics));
    const newTerms = Object.keys(lTerms).some((k) => !(k in sTerms));
    // Apa pun yang sudah dicentang di perangkat ini selagi belum masuk akan
    // hilang kalau salinan server diambil mentah-mentah, jadi pada snapshot
    // pertama keduanya digabung lalu hasilnya didorong balik ke server.
    if (newDays || newTopics || newTerms) {
      STATE.data = { ...sData, ...lData };
      STATE.topics = { ...sTopics, ...lTopics };
      STATE.terms = { ...sTerms, ...lTerms };
      STATE.lang = sLang; L = sLang;
      saveLocal(); render(); renderAuth();
      cloudSave();
      return;
    }
  }

  STATE.data = sData;
  STATE.topics = sTopics;
  STATE.terms = sTerms;
  STATE.lang = sLang; L = sLang;
  saveLocal(); render(); renderAuth();
}

function startSync() {
  api('/state')
    .then((r) => {
      if (r.status === 401) { sessionLost(); return; }
      if (!r.ok) return;
      signedIn = true;
      renderAuth();
      applyRemote(r.data);
      openStream();
    })
    .catch((e) => console.warn('startSync:', e));
}

/* ── SSE: pengganti onSnapshot ── */
function openStream() {
  if (!signedIn || typeof EventSource === 'undefined') return;
  if (stream) return;
  stream = new EventSource(API + '/events');
  stream.onmessage = (ev) => {
    try { applyRemote(JSON.parse(ev.data)); } catch (e) { /* baris bukan JSON */ }
  };
  // Sengaja ditutup saat error, bukan dibiarkan menyambung ulang sendiri:
  // kalau sesinya kedaluwarsa, EventSource akan mencoba terus tanpa pernah
  // tahu ia ditolak. Pengecekan berkala di bawah yang menyambung kembali dan
  // sekaligus mengenali 401.
  stream.onerror = () => stopStream();
}

function stopStream() {
  if (stream) { try { stream.close(); } catch (e) {} stream = null; }
}

/* Jaring pengaman kalau SSE terputus: ikut interval render 60 detik yang sudah
   ada, bandingkan version, lalu coba sambungkan lagi. */
function pollState() {
  api('/state')
    .then((r) => {
      if (r.status === 401) { sessionLost(); render(); return; }
      if (!r.ok || !r.data) return;
      if (r.data.version !== serverVersion) applyRemote(r.data);
      openStream();
    })
    .catch(() => {});
}

/* ── NOTIFIKASI ── */
async function subscribePush(reg) {
  const opts = { userVisibleOnly: true, applicationServerKey: b64ToU8(vapidKey) };
  try {
    return await reg.pushManager.subscribe(opts);
  } catch (e) {
    // Perangkat masih memegang langganan dengan kunci lain (mis. sisa kunci
    // FCM); cabut dulu, baru berlangganan ulang dengan kunci VAPID kita.
    const old = await reg.pushManager.getSubscription();
    if (!old) throw e;
    const endpointLama = old.endpoint;
    await old.unsubscribe();
    // Barisnya ikut dihapus di server. Tanpa ini ia menetap sampai pengiriman
    // berikutnya gagal dengan 410 — tidak berbahaya, tapi menyisakan langganan
    // mati yang membingungkan saat memeriksa daftar perangkat.
    api('/push/subscribe', { method: 'DELETE', body: { endpoint: endpointLama } }).catch(() => {});
    return reg.pushManager.subscribe(opts);
  }
}

function doNotif() {
  if (!('Notification' in window)) {
    alert(L === 'id' ? 'Browser tidak mendukung notifikasi.' : 'Your browser does not support notifications.');
    return;
  }
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert(L === 'id' ? 'Buka lewat https://' : 'Open via https://');
    return;
  }
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert(L === 'id'
      ? 'Browser ini tidak mendukung push. Di iPhone, pasang dulu app ke Home Screen.'
      : 'This browser does not support push. On iPhone, add the app to your Home Screen first.');
    return;
  }
  if (!signedIn) {
    alert(L === 'id'
      ? 'Masuk dulu agar pengingat bisa dikirim ke perangkat ini.'
      : 'Sign in first so reminders can reach this device.');
    return;
  }
  Notification.requestPermission().then(async (p) => {
    if (p !== 'granted') {
      if (p === 'denied') {
        alert(L === 'id'
          ? 'Izin notifikasi ditolak. Aktifkan lewat pengaturan browser/situs untuk memakai pengingat.'
          : 'Notification permission denied. Enable it in your browser/site settings to use reminders.');
      }
      return;
    }
    render();
    try {
      if (!vapidKey) await loadConfig();
      if (!vapidKey) throw new Error(L === 'id' ? 'kunci VAPID belum tersedia dari server' : 'no VAPID key from server');
      const reg = await navigator.serviceWorker.register('sw.js');
      await navigator.serviceWorker.ready;
      const sub = await subscribePush(reg);
      const r = await api('/push/subscribe', { method: 'POST', body: sub.toJSON() });
      if (!r.ok) throw new Error((L === 'id' ? 'server menolak langganan: ' : 'server refused subscription: ') + r.status);
      STATE.pushEndpoint = sub.endpoint;
      saveLocal();
      render();
      alert(L === 'id' ? 'Pengingat aktif ✓ Perangkat ini terdaftar.' : 'Reminders active ✓ This device is registered.');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}

/* ── AWAL JALAN ── */
// Sisa penanda dari era Firebase tidak dipakai lagi; dibersihkan supaya isi
// localStorage tidak menyesatkan saat dibaca nanti.
if (STATE.uid || STATE.fcmToken) {
  delete STATE.uid;
  delete STATE.fcmToken;
  saveLocal();
}

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

loadConfig();
startSync();   // sekaligus mendeteksi sesi yang masih hidup dari kunjungan lalu
render();
renderAuth();
setInterval(() => {
  render();
  if (signedIn && !stream) pollState();
}, 60000);
