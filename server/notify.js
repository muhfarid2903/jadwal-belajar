/* Pengirim notifikasi harian, dijalankan systemd timer di VPS:
     docker exec jadwal-belajar-api node notify.js auto
   atau dengan slot eksplisit untuk uji manual:
     docker exec jadwal-belajar-api node notify.js 3

   Pengganti send-notification.js + .github/workflows/notify.yml.

   `auto` memilih slot dari jam WIB saat ini, dihitung eksplisit lewat Intl dan
   bukan mengandalkan env TZ container — jadi slot tetap benar meskipun zona
   waktu container berubah. */
const { MESSAGES } = require('./messages');
const { sendToAll } = require('./push');

const SLOT_HOURS = [6, 9, 12, 15, 18];

function hourInJakarta() {
  const s = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  return Number.parseInt(s, 10);
}

/* Slot terdekat, bukan yang sama persis: kalau timer tertunda beberapa menit
   dan melewati pergantian jam, pesan yang dikirim tetap pesan yang dimaksud. */
function autoSlot() {
  const h = hourInJakarta();
  let best = 0;
  let dist = 24;
  SLOT_HOURS.forEach((sh, i) => {
    const d = Math.min(Math.abs(h - sh), 24 - Math.abs(h - sh));
    if (d < dist) { dist = d; best = i; }
  });
  return best;
}

async function main() {
  const arg = process.argv[2] ?? process.env.SLOT ?? 'auto';
  const slot = arg === 'auto' ? autoSlot() : Number.parseInt(arg, 10);
  const msg = MESSAGES[slot] || MESSAGES[0];
  if (arg === 'auto') {
    console.log(`jam ${hourInJakarta()} WIB -> slot ${slot}`);
  }

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
