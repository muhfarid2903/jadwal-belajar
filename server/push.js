/* Pengiriman Web Push, dipakai notify.js (cron) dan endpoint uji di server.js.

   Pengganti FCM: browser sendiri yang jadi tujuan, ditandatangani dengan kunci
   VAPID. Isi notifikasi (getaran, requireInteraction, dsb.) tidak ditentukan di
   sini melainkan di listener `push` pada sw.js — beda dari FCM dulu, yang bisa
   menampilkan notifikasi sendiri dari payload dan karena itu perlu penjagaan
   supaya tidak muncul dobel. */
const webpush = require('web-push');
const { allSubs, deleteSub, vapid } = require('./db');

const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@balanglompo.com';

let configured = false;
function configure() {
  if (configured) return;
  const { publicKey, privateKey } = vapid();
  webpush.setVapidDetails(SUBJECT, publicKey, privateKey);
  configured = true;
}

/* Langganan yang ditolak permanen oleh push service dibuang, sepadan dengan
   pembersihan token basi di send-notification.js versi FCM. */
const GONE = [404, 410];

async function sendToAll(payload) {
  configure();
  const subs = allSubs();
  if (!subs.length) return { sent: 0, failed: 0, removed: 0, total: 0 };

  const body = JSON.stringify(payload);
  const results = await Promise.allSettled(
    subs.map((sub) => webpush.sendNotification(sub, body, { TTL: 600, urgency: 'high' }))
  );

  let sent = 0;
  let failed = 0;
  let removed = 0;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      sent++;
      return;
    }
    failed++;
    const code = r.reason && r.reason.statusCode;
    console.warn('push gagal:', code || r.reason?.message, '-', subs[i].endpoint.slice(0, 48) + '…');
    if (GONE.includes(code)) {
      deleteSub(subs[i].endpoint);
      removed++;
    }
  });

  return { sent, failed, removed, total: subs.length };
}

module.exports = { sendToAll, configure, SUBJECT };
