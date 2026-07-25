/* Membuat baris PASSPHRASE_SCRYPT untuk deploy/.env.

     docker exec -it jadwal-belajar-api node hash-passphrase.js

   Passphrase diminta dengan input tersembunyi dan tidak pernah ditulis ke
   mana pun — yang dicetak hanya garam dan hash scrypt-nya. Jadi passphrase
   aslinya tidak melewati riwayat shell, log container, maupun berkas apa pun. */
const crypto = require('node:crypto');

const MIN_LEN = 8;

function askHidden(prompt) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    process.stdout.write(prompt);

    // Tanpa TTY (mis. dipipa) tidak ada yang bisa disembunyikan; baca apa
    // adanya saja, sambil mengingatkan bahwa cara itu bocor ke riwayat shell.
    if (!stdin.isTTY) {
      let piped = '';
      stdin.setEncoding('utf8');
      stdin.on('data', (d) => (piped += d));
      stdin.on('end', () => {
        process.stdout.write('\n');
        resolve(piped.replace(/\r?\n$/, ''));
      });
      return;
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let buf = '';

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
    };

    function onData(chunk) {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n' || ch === '\u0004') {
          cleanup();
          process.stdout.write('\n');
          return resolve(buf);
        }
        if (ch === '\u0003') {
          cleanup();
          process.stdout.write('\n');
          return reject(new Error('dibatalkan'));
        }
        if (ch === '\u007f' || ch === '\b') {
          buf = buf.slice(0, -1);
        } else if (ch >= ' ') {
          buf += ch;
        }
      }
    }

    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error('Catatan: stdin bukan terminal, ketikan tidak bisa disembunyikan.');
    console.error('Sebaiknya jalankan dengan: docker exec -it jadwal-belajar-api node hash-passphrase.js\n');
  }

  const pass = await askHidden('Passphrase baru: ');
  if (pass.length < MIN_LEN) {
    console.error(`\nTerlalu pendek — minimal ${MIN_LEN} karakter.`);
    process.exit(1);
  }
  const again = await askHidden('Ulangi passphrase: ');
  if (pass !== again) {
    console.error('\nKedua masukan tidak sama.');
    process.exit(1);
  }

  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pass, salt, 32);

  console.log('\nTempel baris berikut ke /opt/jadwal-belajar/deploy/.env:\n');
  console.log(`PASSPHRASE_SCRYPT=${salt.toString('hex')}:${hash.toString('hex')}`);
  console.log('\nLalu jalankan: cd /opt/jadwal-belajar/deploy && docker compose up -d');
}

main().catch((e) => {
  console.error('\n' + e.message);
  process.exit(1);
});
