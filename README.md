# Trasa Moment Booking System

Sistem Informasi Rekomendasi dan Pemesanan Layanan Fotografi & Videografi Berbasis **Fuzzy Logic (Metode Mamdani)**.

---

## 📌 Ringkasan Proyek

**Trasa Moment Booking System** adalah platform web dengan arsitektur headless yang dirancang untuk mendigitalkan manajemen operasional agensi fotografi Trasa Moment. Platform ini memadukan algoritma Fuzzy Logic Mamdani untuk memberikan rekomendasi paket layanan yang paling sesuai dengan kebutuhan pengguna secara real-time.

Pembaruan utama pada versi ini adalah penerapan alur pemesanan tanpa kewajiban login (**Guest Checkout**) guna meminimalisir hambatan pengguna (friction). Sistem ini juga mengedepankan transparansi melalui **Fitur Kalender Publik**, di mana klien dapat melihat ketersediaan jadwal secara langsung. Pembayaran DP dilakukan melalui skema unggah bukti transfer manual yang dilengkapi dengan sistem pembatalan otomatis (**Auto-Expire**) di sisi backend untuk mencegah pemblokiran jadwal fiktif.

---

## 🛠️ Teknologi yang Digunakan

### Backend & Admin Panel
*   **Framework:** Laravel 13
*   **Admin Panel:** Filament PHP v5
*   **Runtime:** PHP 8.4+
*   **Theme:** Andreia Filament Nord Theme

### Frontend & Styling
*   **Framework:** React 19 (SPA)
*   **Build Tool:** Vite 8
*   **Styling:** Tailwind CSS v4
*   **Icons:** Lucide React

---

## 🌟 Fitur Utama

1.  **Guest Checkout & Tracking Code:** Pelanggan dapat melakukan booking langsung tanpa harus membuat akun. Setiap pesanan akan menghasilkan Kode Booking Unik (misal: `TRASA-XYZ123`).
2.  **Sistem Rekomendasi Fuzzy Logic (Mamdani):**
    *   **Variabel Input (Fuzzifikasi):** Budget Pelanggan (Rupiah), Skala Acara (Kuantitas/Kerumitan), dan Durasi Kebutuhan (Jam).
    *   **Mekanisme:** Evaluasi aturan menggunakan implikasi MIN (kondisi AND) dan defuzzifikasi menggunakan metode **Centroid (Center of Area)** untuk menghasilkan Skor Kelayakan Relevansi paket.
3.  **Kalender Ketersediaan Publik:** Menampilkan slot tanggal dengan status *Available*, *Hold/Pending* (sedang dalam proses pembayaran DP), dan *Booked* secara real-time.
4.  **Auto-Expire Task Scheduling:** Cron Job otomatis yang berjalan setiap menit untuk membatalkan booking jika bukti transfer DP tidak diunggah dalam batas waktu yang ditentukan (default: 60 menit), sehingga slot tanggal dapat dilepas kembali ke publik.
5.  **Verifikasi Bukti Transfer Manual:** Dashboard admin Filament yang memudahkan administrator untuk menyetujui (*Approve*) atau menolak (*Reject*) bukti transfer.
6.  **Portal Pelacakan Pesanan:** Pelanggan dapat melacak status pengerjaan proyek (*Awaiting Payment* → *DP Paid* → *Scheduled* → *Editing* → *Completed*) dan mengunduh tautan hasil foto/video final menggunakan Kode Booking mereka.
7.  **Fuzzy Logic Engine Editor GUI:** Antarmuka khusus admin untuk menyesuaikan batas kurva keanggotaan fuzzy tanpa perlu menyentuh kode program.

---

## 📂 Struktur Direktori Utama

*   [`app/Models/`](file:///c:/Users/Syarif%20Hidayatullah/Herd/trasa_moment/app/Models) - Model database (`Portfolio`, `Testimonial`, `Booking`, `Package`, `FuzzyVariable`, dll).
*   [`database/migrations/`](file:///c:/Users/Syarif%20Hidayatullah/Herd/trasa_moment/database/migrations) - Skema database sistem booking dan parameter fuzzy logic.
*   [`routes/web.php`](file:///c:/Users/Syarif%20Hidayatullah/Herd/trasa_moment/routes/web.php) - Rute web dan endpoint API publik (`/api/landing-data`, `/api/checkout`, `/api/recommend`, dll).
*   [`resources/js/`](file:///c:/Users/Syarif%20Hidayatullah/Herd/trasa_moment/resources/js) - Komponen frontend SPA berbasis React.js.

---

## 🚀 Panduan Instalasi & Pengembangan

### 1. Prasyarat
Pastikan mesin lokal Anda sudah terinstal:
*   PHP 8.4+
*   Composer
*   Node.js & NPM
*   Database (MySQL / SQLite)

### 2. Langkah Setup Mandiri
Jalankan perintah pintas berikut yang sudah didefinisikan dalam `composer.json` untuk mengotomatisasi instalasi dependensi, penyalinan environment file, pembuatan key, migrasi database, dan build aset:

```bash
composer run setup
```

Secara manual, Anda juga dapat menjalankan langkah-langkah berikut:
```bash
# 1. Install dependensi PHP
composer install

# 2. Salin environment file
cp .env.example .env

# 3. Generate Application Key
php artisan key:generate

# 4. Jalankan Migrasi Database
php artisan migrate --force

# 5. Install dependensi Node.js
npm install

# 6. Build Aset Frontend
npm run build
```

### 3. Menjalankan Server Pengembangan (Dev Server)
Untuk menjalankan server Laravel, antrean queue, dan Vite secara bersamaan dalam satu terminal, gunakan perintah:

```bash
composer run dev
```

Atau jalankan secara terpisah di terminal yang berbeda:
```bash
# Terminal 1: Laravel Local Server
php artisan serve

# Terminal 2: Queue Listener (Untuk email / proses latar belakang)
php artisan queue:listen --tries=1

# Terminal 3: Vite Dev Server (React & Tailwind)
npm run dev
```

### 4. Menjalankan Task Scheduler (Auto-Expire)
Untuk menguji fitur pembatalan otomatis secara lokal, jalankan perintah scheduler worker:
```bash
php artisan schedule:work
```

---

## 📈 Alur Penggunaan Fuzzy Logic (Mamdani)

1.  **Input Pengguna:** Klien menggeser slider budget, memilih durasi acara, dan skala acara pada formulir rekomendasi.
2.  **Fuzzifikasi:** Input numerik dikonversi menjadi derajat keanggotaan menggunakan fungsi representasi kurva (misal: Segitiga/Trapesium) yang didefinisikan di admin panel.
3.  **Inferensi:** Aturan IF-THEN dievaluasi dengan operator MIN untuk memotong daerah konsekuen masing-masing aturan.
4.  **Defuzzifikasi:** Seluruh output daerah konsekuen digabungkan, lalu dihitung titik beratnya (Centroid) untuk menghasilkan skor kelayakan kuantitatif.
5.  **Output:** Paket dengan skor tertinggi akan diberikan lencana *"Paling Cocok untuk Anda"* pada halaman pencarian paket.

---

## 📄 Lisensi

Aplikasi ini dikembangkan sebagai perangkat lunak internal/komersial untuk agensi fotografi **Trasa Moment**. Hak cipta dilindungi undang-undang.

