const admin = require('firebase-admin');

const MESSAGES = [
  { title: 'Jadwal Belajar', body: 'Selamat pagi! Waktunya siap-siap.' },
  { title: 'Jadwal Belajar', body: 'Jam kerja dimulai. Semangat!' },
  { title: 'Jadwal Belajar', body: 'Istirahat siang, waktunya tidur.' },
  { title: 'Jadwal Belajar', body: 'Waktunya belajar 45 menit wajib!' },
  { title: 'Jadwal Belajar', body: 'Sudah selesai belajar hari ini?' },
];

async function main() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const token = process.env.FCM_TOKEN;
  const slot = parseInt(process.env.SLOT || '0', 10);

  if (!token) throw new Error('FCM_TOKEN secret missing');
  if (!serviceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT secret missing');

  const msg = MESSAGES[slot] || MESSAGES[0];

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const response = await admin.messaging().send({
    token,
    notification: { title: msg.title, body: msg.body },
    webpush: {
      notification: {
        title: msg.title,
        body: msg.body,
        icon: './icon.svg',
        badge: './icon.svg',
      },
    },
  });

  console.log('Sent:', response, 'slot:', slot, 'msg:', msg.body);
}

main().catch((e) => { console.error(e); process.exit(1); });
