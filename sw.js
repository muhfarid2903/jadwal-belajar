/* Unified service worker: offline caching + Firebase Cloud Messaging.
   Both used to live in separate SWs registered at the same root scope,
   so they kept overwriting each other. Merging them means caching AND
   background notifications work at the same time. */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB3Gu4o9BiL3i9Gi9dLGvGF0yxcCmXXp80",
  authDomain: "jadwal-belajar-11785.firebaseapp.com",
  projectId: "jadwal-belajar-11785",
  storageBucket: "jadwal-belajar-11785.firebasestorage.app",
  messagingSenderId: "899989543339",
  appId: "1:899989543339:web:c81bc363fb3d8501e01aee"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'Jadwal Belajar';
  const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || '';
  self.registration.showNotification(title, {
    body,
    icon: './icon.svg',
    badge: './icon.svg',
    tag: 'jadwal-fcm',
    vibrate: [500, 200, 500, 200, 500, 200, 500],
    requireInteraction: true, // stays until tapped, harder to miss
    renotify: true            // re-alert each slot even though tag is reused
  });
});

/* ── OFFLINE CACHE ── */
const CACHE = 'jadwal-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Network-first for page navigations so app updates are picked up
  // immediately; fall back to cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Cache-first for everything else (static assets).
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
