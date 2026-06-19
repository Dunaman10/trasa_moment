## PRODUCT REQUIREMENTS DOCUMENT
## (PRD)
## Sistem Rekomendasi Booking Fotografi Berbasis Fuzzy Logic
(Mamdani)
## Proyek: Trasa Moment Booking System
## 1. INFORMASI DOKUMEN
## Parameter Spesifikasi
Nama Proyek Trasa Moment Booking System (Aplikasi
## Rekomendasi Paket Fotografi & Videografi)
Versi Dokumen 4.0 (MVP Guest Checkout, Public Calendar
## & Manual Payment)
## Tanggal Pembaruan Juni 2026
## Metode Utama Fuzzy Logic Metode Mamdani
(Rekomendasi Paket Internal)
Teknologi Backend Laravel 12 (API Server) & Filament PHP
(Admin Panel)
Teknologi Frontend React.js & Tailwind CSS
Lingkungan Server PHP 8.4 (Optimasi API Environment
## Terkini)
## 2. RINGKASAN EKSEKUTIF & TUJUAN PROYEK
Trasa Moment Booking System adalah platform berbasis web dengan arsitektur headless
yang dirancang untuk mendigitalkan manajemen operasional agensi fotografi Trasa
Moment. Sistem ini memadukan algoritma Fuzzy Logic Mamdani untuk memberikan
rekomendasi paket layanan yang paling sesuai dengan kebutuhan pengguna secara real-
time.
Pembaruan utama pada versi ini adalah penerapan alur pemesanan tanpa kewajiban login
(Guest Checkout) guna meminimalisir hambatan pengguna (friction). Sistem ini juga
mengedepankan transparansi melalui Fitur Kalender Publik, di mana klien dapat melihat
ketersediaan jadwal secara langsung. Untuk fase MVP (Minimum Viable Product),
pembayaran DP dilakukan melalui skema unggah bukti transfer manual yang dilengkapi
dengan sistem pembatalan otomatis (Auto-Expire) di sisi backend untuk mencegah
pemblokiran jadwal fiktif.

## 3. HAK AKSES & MANAJEMEN PERAN (USER ROLES)
Sistem disederhanakan menjadi dua peran utama untuk menjaga integritas data dan
mempercepat alur transaksi:
3.1. Administrator (Manajemen Utama Trasa Moment)
- Akses penuh terhadap seluruh modul administrasi sistem melalui panel Filament PHP.
- Melakukan tinjauan, persetujuan (approval), atau penolakan terhadap bukti transfer DP
yang diunggah klien.
- Memperbarui status proyek (contoh: New Request -> DP Paid -> Scheduled -> Editing ->
## Completed).
- Mengelola jadwal ketersediaan (Master Calendar), memblokir tanggal libur, atau
menetapkan tanggal penuh.
- Mengelola parameter kurva keanggotaan dan basis aturan untuk engine Fuzzy Logic
secara dinamis.
- Mengunggah tautan (link) hasil karya foto/video final untuk diakses dan diunduh oleh
klien.
3.2. Customer (Pelanggan / Klien)
- Mengakses aplikasi publik berbasis React.js dan menggunakan Widget Rekomendasi
Fuzzy tanpa login.
- Melihat Kalender Ketersediaan Publik untuk mengecek hari dan jam operasional Trasa
Moment sebelum memesan.
- Melakukan proses booking secara langsung (Guest Checkout) dengan mengisi formulir
acara dan mengunggah bukti bayar DP.
- Melacak status pesanan secara real-time dan mengunduh file hasil akhir menggunakan
Kode Booking Unik pada halaman pelacakan (Order Tracking Page).
## 4. IMPLEMENTASI ALGORITMA FUZZY LOGIC (MAMDANI)
Sistem melakukan pemetaan (mapping) kebutuhan klien secara objektif terhadap katalog
produk paket internal melalui request API.
4.1. Variabel Input (Fuzzifikasi)
- Budget Pelanggan (Rupiah): Dibagi menjadi himpunan linguistik Terbatas, Menengah,
dan Tinggi.
- Skala Acara (Kuantitas / Kerumitan): Dibagi menjadi himpunan Intimate (Kecil),
Standar (Sedang), dan Grand (Besar).
- Durasi Kebutuhan (Jam): Dibagi menjadi himpunan Singkat, Reguler, dan Seharian (Full-
day).
## 4.2. Mekanisme Evaluasi Aturan & Defuzzifikasi
Kombinasi nilai input dipetakan menggunakan aturan kondisional implikasi MIN (kondisi
AND). Metode penegasan kuantitatif menggunakan pendekatan Centroid (Center of Area)

untuk mengubah akumulasi daerah konsekuen menjadi nilai numerik tunggal (Skor
Kelayakan Relevansi). Formulasi integral matematika di backend:
z* = ∫(μc(z) × z) dz / ∫μc(z) dz
Skor dikirim via JSON untuk menyematkan lencana "Paling Cocok untuk Anda" pada UI
frontend.
## 5. KEBUTUHAN FITUR APLIKASI (FUNCTIONAL REQUIREMENTS)
5.1. Antarmuka Klien (Frontend - React.js SPA)
- Kalender Ketersediaan Publik: Komponen visual yang menampilkan slot Available,
Hold/Pending (saat ada klien lain di tahap pembayaran), dan Booked.
- Guest Checkout & Rekomendasi: Formulir interaktif (Fuzzy slider, lokasi Maps API) dan
unggah file bukti transfer (multipart/form-data) tanpa pembuatan akun. Dilengkapi
keamanan reCAPTCHA.
- Order Tracking Portal: Halaman khusus pelacakan pesanan menggunakan input Kode
Booking (misal: TRASA-XYZ123) untuk melihat progres pekerjaan dan mengunduh
hasil.
5.2. Panel Manajemen Internal (Backend - Laravel 12 & Filament PHP)
- Pipeline Booking Dashboard: Tampilan antarmuka (Kanban/Tabel) untuk memantau
status pesanan (Awaiting Payment, DP Paid, Scheduled, Done).
- Verifikasi Bukti Transfer: Modul untuk meninjau gambar bukti transfer yang diunggah
klien dengan tombol aksi cepat (Approve DP / Reject).
- Task Scheduling (Auto-Expire): Cron Job Laravel yang berjalan setiap menit untuk
membatalkan pesanan (Cancelled) secara otomatis jika klien tidak mengunggah bukti
bayar dalam batas waktu tertentu (misal: 60 menit), membebaskan kembali slot jadwal.
- Fuzzy Logic Engine Editor GUI: Halaman admin untuk mengubah batas nilai kurva
keanggotaan variabel tanpa menyentuh kode program.
- Centralized Master Calendar: Kalender terpusat untuk mengatur penugasan internal
dan memblokir tanggal libur.
## 6. CATATAN INFRASTRUKTUR & LINGKUNGAN SERVER
Backend Laravel 12 API dan panel Filament di-deploy pada VPS atau Shared Hosting
Enterprise (seperti Hostinger) dengan runtime PHP 8.4 aktif, serta konfigurasi Cron Job di
level server untuk menjalankan Task Scheduling (Auto-Expire).
Frontend React.js dapat di-deploy terpisah (decoupled) di Vercel atau edge hosting lainnya
demi performa muat halaman yang instan dan optimal.