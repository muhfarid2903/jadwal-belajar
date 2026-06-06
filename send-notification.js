const admin = require('firebase-admin');

const MESSAGES = [
  { title: 'Jadwal Belajar', body: 'Selamat pagi! Waktunya siap-siap.' },
  { title: 'Jadwal Belajar', body: 'Jam kerja dimulai. Semangat!' },
  { title: 'Jadwal Belajar', body: 'Istirahat siang, waktunya tidur.' },
  { title: 'Jadwal Belajar', body: 'Waktunya belajar 45 menit wajib!' },
  { title: 'Jadwal Belajar', body: 'Sudah selesai belajar hari ini?' },
];

const STALE_CODES = [
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
];

async function main() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const slot = parseInt(process.env.SLOT || '0', 10);

  if (!serviceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT secret missing');

  const msg = MESSAGES[slot] || MESSAGES[0];

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  const snap = await db.collection('fcmTokens').get();
  const docs = snap.docs;
  if (!docs.length) {
    console.log('No registered tokens, nothing to send. slot:', slot);
    return;
  }

  const tokens = docs.map((d) => d.get('token') || d.id);

  // Data-only payload: the service worker (onBackgroundMessage) renders the
  // notification itself, so options like requireInteraction/vibrate actually
  // apply and the browser does not auto-display a second, plain notification.
  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    data: { title: msg.title, body: msg.body },
    webpush: {
      headers: { Urgency: 'high' },
    },
  });

  console.log(
    `Sent ${response.successCount}/${tokens.length} (failures: ${response.failureCount}), slot ${slot}: ${msg.body}`
  );

  // Remove tokens that are no longer valid so the list stays clean.
  const stale = [];
  response.responses.forEach((r, i) => {
    if (!r.success) {
      const code = r.error && r.error.code;
      console.warn('Token error:', code, '-', tokens[i].slice(0, 16) + '…');
      if (STALE_CODES.includes(code)) stale.push(docs[i].ref);
    }
  });
  if (stale.length) {
    await Promise.all(stale.map((ref) => ref.delete().catch(() => {})));
    console.log('Removed', stale.length, 'stale token(s).');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
