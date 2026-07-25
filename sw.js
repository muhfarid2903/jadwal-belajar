/* Service worker: cache offline + Web Push.

   Dulu berkas ini memuat SDK Firebase Messaging lewat importScripts dan
   menangani onBackgroundMessage. Sekarang push-nya standar Web Push, jadi tidak
   ada SDK yang perlu diunduh dan tampilan notifikasinya sepenuhnya ditentukan
   di sini — tidak ada lagi kemungkinan notifikasi muncul dobel karena browser
   ikut menampilkan payload-nya sendiri. */

/* ── WEB PUSH ── */
self.addEventListener('push', (e) => {
  let d = {};
  if (e.data) {
    try {
      d = e.data.json();
    } catch (err) {
      d = { body: e.data.text() };
    }
  }
  const title = d.title || 'Jadwal Belajar';
  e.waitUntil(
    self.registration.showNotification(title, {
      body: d.body || '',
      icon: './icon.svg',
      badge: './icon.svg',
      tag: 'jadwal-push',
      renotify: true,          // tetap berbunyi tiap slot walau tag-nya sama
      requireInteraction: true, // bertahan sampai disentuh, lebih sulit terlewat
      vibrate: [500, 200, 500, 200, 500, 200, 500],
      data: { url: './' },
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

/* ── CACHE OFFLINE ── */
// Dinaikkan ke v6: firebase-sync.js diganti sync.js, dan versi baru memaksa
// install lama membuang cache-nya supaya index.html baru tidak pernah
// berpasangan dengan berkas JS lama.
const CACHE = 'jadwal-v6';
const ASSETS = ['./', './index.html', './style.css', './curriculum.js', './terms.js', './app.js', './sync.js', './manifest.json', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Permintaan ke API tidak boleh disentuh cache: harus selalu ke jaringan,
  // dan saat offline biarkan gagal supaya client tahu ia sedang tak tersambung.
  if (new URL(req.url).pathname.startsWith('/api/')) return;

  // Network-first untuk navigasi supaya pembaruan app langsung terpakai;
  // jatuh ke cache saat offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Cache-first untuk sisanya (aset statis).
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
