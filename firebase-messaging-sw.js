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
    vibrate: [200, 100, 200],
    requireInteraction: false
  });
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
