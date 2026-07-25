/* Pesan notifikasi per slot waktu, dipindahkan dari send-notification.js yang
   dulu dijalankan GitHub Actions. Urutannya mengikuti blok waktu di app:
   06.00, 09.00, 12.00, 15.00, 18.00 WIB. */
const MESSAGES = [
  { title: 'Jadwal Belajar', body: 'Selamat pagi! Waktunya siap-siap.' },
  { title: 'Jadwal Belajar', body: 'Jam kerja dimulai. Semangat!' },
  { title: 'Jadwal Belajar', body: 'Istirahat siang, waktunya tidur.' },
  { title: 'Jadwal Belajar', body: 'Waktunya belajar 45 menit wajib!' },
  { title: 'Jadwal Belajar', body: 'Sudah selesai belajar hari ini?' },
];

module.exports = { MESSAGES };
