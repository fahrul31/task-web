# Express.js Background Processing
Aplikasi Express.js dengan fitur background processing menggunakan Bull dan Redis untuk mengirim email selamat datang secara asinkron.

## Fitur

- Background processing menggunakan Bull dan Redis
- Pengiriman email asinkron dengan Nodemailer
- Logging untuk semua operasi

## Prasyarat

Sebelum menjalankan aplikasi, pastikan telah menginstal: 
- Node.js
- Redis (untuk Bull queue)

## Instalasi

1. Clone repo:
    git clone

2. install dependensi:
    \`\`\`
    npm install
    \`\`\`

3. Pastikan Redis berjalan di localhost:6379 atau sesuaikan konfigurasi di `queues/email-queue.js`

## Menjalankan Aplikasi

1. Jalankan aplikasi:
    \`\`\`
    npm start
    \`\`\`

## Penggunaan API

### Mendapatkan Semua Pengguna
\`\`\`
GET /users
\`\`\`

### Menambahkan Pengguna Baru
\`\`\`
POST /users
content-Type : application/json

{
    "name": "Budi",
    "email": "budi@example.com"
}
\`\`\`
Saat pengguna baru ditambahkan, email selamat datang akan dikirim secara asinkron menggunakan Bull queue.