# jadwal-belajar

Jadwal belajar harian: satu tugas 45 menit wajib, satu topik kurikulum SpJP, dan
satu istilah medis per hari. Berjalan sebagai PWA di
[belajar.balanglompo.com](https://belajar.balanglompo.com), bisa dipasang ke
Home Screen, dan tetap jalan offline dari localStorage.

## Isi

**Client** — HTML/CSS/JS biasa, tanpa build step dan tanpa framework. Semuanya
tag `<script>` klasik yang berbagi satu lingkup teratas, dimuat berurutan:

| Berkas | Isi |
|---|---|
| `index.html`, `style.css` | tampilan |
| `curriculum.js` | 131 topik kurikulum SpJP (Tabel 2.3 PERKI 2018) |
| `terms.js` | 170 istilah medis dalam 17 kelompok sistem |
| `app.js` | state, render, dan semua interaksi |
| `sync.js` | login, sync ke server, langganan notifikasi |
| `sw.js` | cache offline + penerima Web Push |

**Server** (`server/`) — Node tanpa framework, satu dependensi (`web-push`).
Basis datanya SQLite lewat `node:sqlite` bawaan Node, jadi tidak ada modul
native. Menyediakan login passphrase, sync progres, dan pengiriman Web Push di
prefiks `/api`.

## Menjalankan

Situsnya berkas statis biasa, jadi untuk mengembangkan cukup:

```sh
python3 -m http.server 8000     # lalu buka http://localhost:8000
```

Tanpa server API, app tetap jalan penuh — hanya sync dan notifikasi yang mati.
Untuk menjalankan API-nya secara lokal:

```sh
cd server && npm install
DB_PATH=./dev.db PASSPHRASE_SCRYPT=$(node -e "
  const c=require('crypto'),s=c.randomBytes(16);
  console.log(s.toString('hex')+':'+c.scryptSync('rahasia-dev',s,32).toString('hex'))
") node server.js
```

## Deploy

Di VPS ber-Coolify: Traefik memegang port 80/443 dan sertifikatnya, dua
container (nginx statis + API Node) bicara HTTP di jaringan `coolify`.

```sh
git clone https://github.com/muhfarid2903/jadwal-belajar.git /opt/jadwal-belajar
cd /opt/jadwal-belajar/deploy
printf 'PASSPHRASE_SCRYPT=\nVAPID_SUBJECT=mailto:admin@balanglompo.com\n' > .env
chmod 600 .env
docker compose up -d --build

# Passphrase (ketikan tersembunyi, hanya hash-nya yang tercetak):
docker exec -it jadwal-belajar-api node hash-passphrase.js
# tempel hasilnya ke .env, lalu:
docker compose up -d

# Notifikasi harian 06/09/12/15/18 WIB:
install -m 0644 systemd/jadwal-notify.{service,timer} /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now jadwal-notify.timer
```

Memperbarui situs: `git -C /opt/jadwal-belajar pull`. Akar webnya adalah hasil
clone yang dipasang read-only, jadi tidak perlu rebuild. Kalau `server/` ikut
berubah: `docker compose up -d --build`.

Penjadwalannya memakai systemd timer, bukan cron, karena cron Debian/Ubuntu
tidak mendukung zona waktu per-crontab — `OnCalendar` systemd menerima
`Asia/Jakarta`, sehingga jamnya benar sepanjang tahun tanpa mengubah zona waktu
host.

## Catatan

- **Kunci VAPID** dibuat sendiri oleh server saat start pertama dan disimpan di
  basis datanya, jadi tidak ada kunci di repo. Ia bertahan melewati rebuild
  karena `deploy/data/` adalah volume — kalau kuncinya hilang, semua langganan
  push harus dibuat ulang.
- **Sesi** dipegang cookie `HttpOnly; Secure; SameSite=Strict` berumur setahun,
  bukan token di localStorage. Cookie ini juga yang mengotentikasi SSE, karena
  `EventSource` tidak bisa mengirim header.
- **Web Push di iPhone** mensyaratkan app dipasang ke Home Screen (iOS 16.4+).
- Progres tersimpan di localStorage lebih dulu, lalu didorong ke server. Saat
  login pertama di sebuah perangkat, isi lokal digabung dengan isi server, jadi
  centangan yang dibuat selagi offline tidak hilang.
