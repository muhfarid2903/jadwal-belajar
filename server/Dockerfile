# Node 24 dipilih karena `node:sqlite` sudah tersedia sebagai modul bawaan,
# jadi tidak ada modul native yang perlu dikompilasi dan image tetap kecil.
FROM node:24-alpine

WORKDIR /app

# Tanpa tzdata, Alpine mengabaikan env TZ dan waktu tetap UTC — cap waktu di log
# jadi tidak cocok dengan jadwal WIB yang dipakai cron. Penjadwalannya sendiri
# ditentukan CRON_TZ di host, jadi ini murni soal keterbacaan log.
RUN apk add --no-cache tzdata

# Dependensi dipasang lebih dulu agar layer-nya bisa dipakai ulang selama
# package.json tidak berubah. Satu dependensi saja: web-push.
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

ENV NODE_ENV=production \
    PORT=8080 \
    DB_PATH=/data/jadwal.db

# Berkas SQLite hidup di volume, bukan di dalam image.
VOLUME ["/data"]
EXPOSE 8080

CMD ["node", "server.js"]
