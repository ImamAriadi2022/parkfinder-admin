# ParkFinder Web Admin Dashboard

Dashboard Administrasi Web untuk **ParkFinder** — platform manajemen, monitoring, dan analisis gedung parkir secara real-time. Dashboard ini terbagi menjadi dua level akses utama: **Super Admin** dan **Admin Parkir (Staff Monitoring)**.

---

## 🚀 Fitur Utama

- **Real-Time Monitoring**: Grafik okupansi slot parkir dan aktivitas masuk/keluar kendaraan secara langsung.
- **Manajemen Area Parkir**: Pengelolaan gedung parkir beserta layout lantai dan kapasitas slot secara lengkap.
- **Manajemen Staff**: Pendaftaran dan pembagian wilayah tugas petugas monitoring lapangan.
- **Manajemen Pengguna**: Pemantauan data pengemudi (aplikasi mobile).
- **Interaksi & Feedback Responsif**: Dilengkapi sistem **Global Toast Notification** (Sukses, Peringatan, Kesalahan, Info) berbasis animasi yang dinamis untuk memberikan umpan balik instan pada setiap tindakan manipulasi data (tambah/edit/hapus).
- **Full API-driven**: Seluruh data bersumber langsung dari backend melalui API Service terpusat.

---

## 🛠️ Tech Stack

- **Framework & Runtime**: React 19, Vite, Node.js
- **Routing**: React Router DOM v7
- **Grafik / Data Visual**: Recharts (Area, Bar, Line, Pie Charts)
- **Icons**: Lucide React
- **Styling**: Pure CSS (Vanilla CSS) dengan Custom CSS Variables & Dark/Light mode theme toggle.

---

## 📂 Struktur Direktori Proyek

```text
web-admin/
├── public/               # Aset statis publik
├── src/
│   ├── assets/           # Gambar, logo, dan aset media lokal
│   ├── components/       # Komponen UI umum (Sidebar, Topbar, Modals, dll.)
│   │   └── pages/        # Sub-komponen modular spesifik per halaman
│   ├── context/          # State global aplikasi (Auth state, Theme state)
│   │   └── AppContext.jsx
│   ├── data/             # Data mock lokal untuk fallback pengembangan
│   │   └── mockData.js
│   ├── pages/            # Halaman-halaman utama aplikasi (Views)
│   ├── services/         # Layer integrasi data & API
│   │   ├── apiService.js  # Panggilan API terpusat menggunakan fetch
│   │   └── dataService.js # Abstraksi pemuatan data dengan toggle API/Mock
│   ├── styles/           # Styling CSS global dan variabel tema
│   │   └── index.css
│   ├── App.jsx           # Entry point routing dan layout utama
│   └── main.jsx          # Entry point rendering React ke DOM
├── index.html            # Template HTML utama
├── package.json          # Konfigurasi dependensi npm
└── vite.config.js        # Konfigurasi bundler Vite
```

---

## 🖥️ Daftar Halaman Aplikasi

Berikut adalah daftar nama halaman beserta penjelasan fungsinya yang tersedia di dalam sistem:

### 1. Akses Halaman Utama & Peran Pengguna (Aktif)

Sistem membedakan tampilan halaman utama berdasarkan peran akun saat login:

*   **Halaman Login (Login Page)**
    *   *Akses*: Publik (belum masuk sistem).
    *   *Fungsi*: Halaman gerbang masuk utama. Memiliki elemen pemilih peran (*toggle role*) untuk masuk sebagai **"🛡️ Admin Parkir" (Super Admin)** atau **"👷 Staff Gedung" (Staff/Admin Area)**. Menyimpan token JWT (`pf_token`) dan data akun (`pf_user`) ke dalam `localStorage`.
*   **Halaman Dashboard Utama (Dashboard Page) — Khusus Super Admin**
    *   *Akses*: Super Admin (Admin Utama).
    *   *Fungsi*: Menyajikan ringkasan visual data statistik dan grafik performa *seluruh area parkir* yang terintegrasi di sistem (tren booking, okupansi total, platform pengguna mobile/web, dan log scan harian). Rute: `/` (di bawah `AdminLayout`).
*   **Halaman Dashboard Staff (Staff Dashboard Page) — Khusus Staff Gedung / Admin Area**
    *   *Akses*: Staff Gedung (Petugas Lapangan).
    *   *Fungsi*: Menyajikan monitoring kapasitas gedung secara real-time, statistik slot masuk/keluar, dan manajemen slot *khusus untuk 1 gedung parkir* yang ditugaskan kepada staff tersebut. Dilengkapi dengan navigasi notifikasi real-time dan logout tanpa sidebar. Rute: `/` (di bawah `StaffLayout`).
*   **Halaman Manajemen Gedung Parkir (Parkings Page) — Khusus Super Admin**
    *   *Akses*: Super Admin.
    *   *Fungsi*: Digunakan untuk melakukan operasi CRUD (tambah, edit, hapus) area gedung parkir dan mengelola tata letak lantai beserta kapasitas slot parkir menggunakan **Slot Manager Modal**. Rute: `/parkings` (di bawah `AdminLayout`).
*   **Halaman Manajemen Staff Parkir (Staff/Admins Page) — Khusus Super Admin**
    *   *Akses*: Super Admin.
    *   *Fungsi*: Mengelola pendaftaran akun petugas monitoring lapangan (Staff Parkir), menetapkan area gedung parkir yang menjadi tanggung jawab tugas staff, melakukan reset password, dan menghapus akun staff. Rute: `/staff`.
*   **Halaman Data Pengguna (Users Page) — Khusus Super Admin**
    *   *Akses*: Super Admin.
    *   *Fungsi*: Memantau daftar pengemudi (pengguna aplikasi mobile) yang terdaftar di sistem beserta data nomor telepon, plat kendaraan, dan opsi hapus akun. Rute: `/users`.
*   **Halaman Profil Akun (Profile Page) — Khusus Super Admin**
    *   *Akses*: Super Admin.
    *   *Fungsi*: Melihat detail profil yang sedang aktif, mengubah nama/nomor telepon, mengunggah foto profil, dan logout. Rute: `/profile`.

### 2. Modul Halaman Pendukung (Pengembangan Fitur/Dev Modul)

Beberapa halaman tambahan telah dibuat dan tersedia di `src/pages/` untuk kebutuhan pengembangan lebih lanjut:
*   **Halaman Daftar Pemesanan (BookingsPage.jsx)**: Halaman untuk memantau data seluruh pemesanan (reservasi) parkir dari pengguna, dilengkapi dengan fitur pencarian dan filter berdasarkan status reservasi (aktif, selesai, ditukar, atau dibatalkan).
*   **Halaman Log Scan QR (ScansPage.jsx)**: Halaman log yang mencatat riwayat aktivitas pemindaian (scan) kode QR masuk dan keluar kendaraan secara real-time.
*   **Halaman Tukar Slot Parkir (SwapsPage.jsx)**: Halaman untuk memantau dan mengelola permohonan pertukaran slot parkir aktif antar pengguna di area parkir.
*   **Halaman Analitik Detail (AnalyticsPage.jsx)**: Halaman khusus untuk menyajikan analisis statistik performa gedung parkir berdasarkan periode waktu (harian, mingguan, bulanan, tahunan).
*   **Halaman Pengaturan Sistem (SettingsPage.jsx)**: Halaman untuk melakukan konfigurasi umum sistem admin, preferensi akun, keamanan, dan pengaturan notifikasi.
*   **Halaman Alternatif Manajemen Staff (StaffManagementPage.jsx)**: Modul alternatif atau versi terdahulu untuk manajemen staff parkir.

---

## ⚡ Integrasi API

Aplikasi ini menggunakan sistem **Data Abstraction Layer** yang memisahkan komponen visual dari backend dan kini telah sepenuhnya terintegrasi secara langsung menggunakan API (*Full API-driven*), tanpa menggunakan data tiruan (*mock data*).

- **Base URL API**: `https://backend-api-services-291631508657.asia-southeast2.run.app`
- **Layanan API (`src/services/apiService.js`)**: Mengelola modul-modul *HTTP request* (GET, POST, PUT, DELETE, PATCH) ke backend dengan penyematan token otorisasi otomatis dari `localStorage`.
- **Layanan Data (`src/services/dataService.js`)**: Berfungsi sebagai pengambil data yang memproses dan memetakan respons JSON dari `apiService.js` langsung ke komponen UI halaman web. Berkas `mockData.js` lama telah dibersihkan dan dinonaktifkan sepenuhnya.

---

## 🔧 Pengembangan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di mesin lokal Anda:

### 1. Prasyarat
Pastikan Anda telah memasang [Node.js](https://nodejs.org/) (versi 16 atau yang lebih baru disarankan).

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori proyek untuk mengunduh seluruh dependensi yang diperlukan:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Lokal)
Mulai server pengembangan lokal dengan perintah:
```bash
npm run dev
```
Buka browser Anda dan akses alamat `http://localhost:5173` (atau port lain yang tertera di terminal).

### 4. Build untuk Produksi
Gunakan perintah berikut jika ingin mengompilasi dan mengoptimalkan kode untuk rilis produksi:
```bash
npm run build
```
Hasil kompilasi akan berada di folder `/dist` dan siap di-deploy ke layanan hosting (seperti Vercel, Netlify, dll.).
