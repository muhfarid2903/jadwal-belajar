/* Pengirim notifikasi harian, dijalankan cron di VPS:
     docker exec jadwal-belajar-api node notify.js <slot 0-4>

   Pengganti send-notification.js + .github/workflows/notify.yml. Karena cron-nya
   ada di server dengan CRON_TZ=Asia/Jakarta, jadwalnya ditulis langsung dalam
   WIB tanpa konversi UTC seperti dulu. */
const { MESSAGES } = require('./messages');
const { sendToAll } = require('./push');

async function main() {
  const slot = Number.parseInt(process.argv[2] ?? process.env.SLOT ?? '0', 10);
  const msg = MESSAGES[slot] || MESSAGES[0];

  const r = await sendToAll({ title: msg.title, body: msg.body });
  if (!r.total) {
    console.log('Belum ada perangkat terdaftar, tidak ada yang dikirim. slot:', slot);
    return;
  }
  console.log(
    `Terkirim ${r.sent}/${r.total} (gagal ${r.failed}, dibuang ${r.removed}), slot ${slot}: ${msg.body}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
