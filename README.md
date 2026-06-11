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

## 🖥️ Analisis & Deskripsi Detail Halaman Aplikasi (Untuk Skripsi)

Sistem ini didesain menggunakan **Multi-Role System** yang secara dinamis membagi alur kerja (*flow*), komponen UI, dan hak akses data antara **Super Admin** dan **Staff Gedung (Admin Area)**.

### 1. Halaman Login (Login Page) — Akses Publik
*   **Fungsi Utama**: Gerbang autentikasi masuk ke sistem menggunakan pencocokan surel (*email*) dan kata sandi (*password*).
*   **Elemen UI & Komponen**:
    *   `LoginHeader`: Menampilkan Logo ParkFinder dan teks sambutan adaptif sesuai peran yang sedang dipilih.
    *   `LoginRoleToggle`: Pilihan tab peran interaktif:
        *   **🛡️ Admin Parkir** (Super Admin): Hak akses penuh mengelola semua gedung, staff, dan data user.
        *   **👷 Staff Gedung** (Admin Area): Hak akses terbatas memantau 1 gedung parkir yang ditugaskan.
    *   `LoginForm`: Formulir isian yang terdiri atas:
        *   *Input Email*: validasi format email dengan ikon amplop.
        *   *Input Password*: input sandi dengan fitur tombol *show/hide password* (mata terbuka/tertutup).
        *   *Tombol Submit (Masuk)*: tombol aksi dengan teks dinamis "Masuk" atau "Memverifikasi..." disertai ikon *loading spinner* ketika status pengiriman data aktif.
        *   *Alert Error Box*: kotak notifikasi kesalahan berwarna merah di atas tombol submit jika login gagal (surel salah atau password tidak valid).
*   **Alur Sistem (Flow)**: Pengguna memilih peran lewat toggle -> memasukkan kredensial -> mengklik "Masuk" -> sistem mengirim *request* `POST /auth/login` -> jika sukses, JWT disimpan di `localStorage` sebagai `pf_token` dan detail profil di `pf_user` -> navigasi dialihkan ke rute utama `/`.

---

### 2. Halaman Dashboard Utama (Dashboard Page) — Khusus Peran Super Admin
*   **Fungsi Utama**: Menyajikan visualisasi data analitik dan statistik operasional keseluruhan jaringan parkir. Rute: `/` (di bawah `AdminLayout`).
*   **Elemen UI & Komponen**:
    *   `Page Header`: Judul halaman "Dashboard", teks dinamis nama admin, dan tombol "Refresh" untuk memperbarui data real-time dengan efek putar ikon.
    *   `Stat Grid (KPI Cards)`: Kisi 4 kolom kartu metrik interaktif yang menampilkan:
        *   *Total Area Parkir*: Jumlah gedung parkir yang aktif.
        *   *Total Slot*: Akumulasi kapasitas slot seluruh gedung.
        *   *Slot Terisi*: Jumlah slot dengan status `occupied` (merah).
        *   *Slot Kosong*: Jumlah slot dengan status `available` (hijau).
    *   `Occupancy Card (Okupansi per Area)`: Daftar kemajuan (*progress bar*) real-time yang menunjukkan tingkat keterisian masing-masing gedung (misal: "2/5 slot kosong"). Warna progress bar otomatis berubah: merah (okupansi >= 80%), jingga (okupansi >= 50%), dan hijau (okupansi < 50%).
    *   `System Info Card (Informasi Sistem)`: Panel informasi samping yang menampilkan peran akun aktif ("Super Admin"), surel pengguna, persentase total keterisian parkir secara akumulatif, dan status koneksi server ("Online" dengan lampu berkedip hijau).

---

### 3. Halaman Dashboard Staff (Staff Dashboard Page) — Khusus Peran Staff Gedung / Admin Area
*   **Fungsi Utama**: Pusat monitoring real-time dan manajemen operasional khusus pada *satu area gedung parkir* yang ditugaskan kepada staff tersebut. Rute: `/` (di bawah `StaffLayout`).
*   **Elemen UI & Komponen**:
    *   `StaffHeader`: Salam pembuka, nama gedung penugasan (diambil dari `user.parkingName`), indikator status online, tombol "Kelola Slot", dan tombol "Edit Gedung".
    *   `Staff KPI Cards`: Kartu status spesifik gedung: Kapasitas Total, Slot Terisi, Slot Tersedia, Booking Aktif, Scan Berhasil, dan Scan Gagal.
    *   `Monitor Panel Tabs (Live Logs)`: Antarmuka tabulasi yang menampilkan:
        *   *Tab Scan Logs*: Riwayat pemindaian QR masuk/keluar kendaraan (kode tiket, nama pengendara, plat, waktu scan, aksi masuk/keluar, status sukses/gagal).
        *   *Tab Booking List*: Daftar reservasi aktif di gedung tersebut (nama, plat, slot lantai, dan durasi).
        *   *Tab Swap Requests*: Permintaan pertukaran slot parkir antar pengemudi.
        *   *Bar Pencarian (Search Input)*: Filter pencarian instan berdasarkan nama, plat nomor, atau kode tiket di semua tab logs.
    *   `Modal Edit Gedung`: Formulir popup untuk memperbarui Nama dan Alamat gedung tugas.
    *   `Modal Kelola Slot`: Kisi visual tata letak slot per lantai.

---

### 4. Halaman Manajemen Gedung Parkir (Parkings Page) — Khusus Peran Super Admin
*   **Fungsi Utama**: Pengelolaan data area gedung parkir beserta layout slot parkir per lantai secara dinamis. Rute: `/parkings` (di bawah `AdminLayout`).
*   **Elemen UI & Komponen**:
    *   `Left Card (Daftar Area)`: Menampilkan lis seluruh gedung parkir (nama, alamat, jumlah lantai). Memiliki tombol "Edit" dan "Hapus" di setiap baris area parkir (hanya untuk Super Admin).
    *   `Right Card (Detail Slot)`: Kisi tabel data slot parkir pada area yang sedang dipilih secara detail (nama slot, lantai, tipe kendaraan, status, dan tombol aksi ubah status *maintenance*/*active*, edit slot, dan hapus slot).
    *   **Alur Operasional Tambah Slot Baru (Flow & UI Detail)**:
        1. Pengguna memilih salah satu area di panel kiri, lalu mengklik tombol **"+ Tambah Slot"** pada panel kanan.
        2. Sistem memunculkan **Add Slot Modal (Popup)** dengan form isian:
            *   *Floor (Lantai)*: Input tipe angka (`number`) untuk lantai slot (misal: `1`).
            *   *Nama Slot*: Input tipe teks (`text`) untuk penamaan slot (misal: `A-04`).
            *   *Sensor ID*: Input read-only yang secara otomatis men-generate ID sensor secara real-time dengan format `SENSOR-[ID_GEDUNG]-[LANTAI]-[NAMA_SLOT]` (misal: `SENSOR-BWOJPZOA-1-A-04`).
            *   *Status Awal*: Dropdown pilihan (`select`) status awal slot (Tersedia / Terisi / Maintenance).
        3. Pengguna menekan tombol **"Simpan"** -> tombol berganti status menjadi loading -> sistem mengirim request `POST /areas/slots` ke API server backend (tanpa menyertakan kunci `status` karena status dikelola otomatis secara terpisah).
        4. Jika berhasil, modal tertutup -> menampilkan *toast notification success* berwarna hijau bertuliskan "Slot parkir baru berhasil ditambahkan!" -> memanggil fungsi `fetchSlots()` untuk memuat ulang daftar slot parkir di tabel tanpa perlu mereload halaman web.

---

### 5. Halaman Manajemen Staff Parkir (Staff/Admins Page) — Khusus Peran Super Admin
*   **Fungsi Utama**: Pendaftaran dan pembagian area tugas pengawasan untuk para petugas parkir lapangan. Rute: `/staff`.
*   **Elemen UI & Komponen**:
    *   `Header Action`: Tombol "+ Tambah Staff" dan tombol "Refresh".
    *   `Staff Table`: Menampilkan avatar, nama staff, surel, area penugasan parkir (dikaitkan langsung ke data gedung parkir dari database), dan aksi baris:
        *   *Edit*: Mengubah nama, kata sandi staff, atau memindahkan wilayah gedung parkir tugas.
        *   *Hapus*: Tombol hapus dengan konfirmasi popup untuk menghapus akun secara permanen dari server.
    *   `Staff Form Modal`: Formulir tambah/edit staff yang berisi kolom: Nama Lengkap, Surel, Kata Sandi, dan Pilihan Gedung Parkir (berupa dropdown dinamis dari hasil query daftar gedung).

---

### 6. Halaman Data Pengguna (Users Page) — Khusus Peran Super Admin
*   **Fungsi Utama**: Memantau seluruh data pengguna aplikasi mobile (pengemudi) dan pengguna web (tamu/guest). Rute: `/users`.
*   **Elemen UI & Komponen**:
    *   `Summary Cards`: Kartu akumulasi: Total Pengguna, Pengguna Aktif, Pengguna Non-Aktif, Pengguna Mobile (Aplikasi), dan Pengguna Web (Tamu).
    *   `Filter Bar`: Pencarian cepat nama/email/plat, filter tab tipe platform (Semua / Mobile / Web), dan filter status (Semua / Aktif / Nonaktif).
    *   `Users Table`: Kolom nama, surel (tampil label "Tamu" jika guest), telepon, plat nomor utama, platform, tanggal bergabung, status (Aktif/Nonaktif), dan tombol "Detail".
    *   `User Detail Modal`: Popup detail yang memuat riwayat transaksi booking parkir dan plat nomor kendaraan cadangan dari pengguna terkait.

---

### 7. Halaman Profil Akun (Profile Page) — Khusus Peran Super Admin
*   **Fungsi Utama**: Pengaturan informasi pribadi pengguna dan pengaturan keamanan akun. Rute: `/profile`.
*   **Elemen UI & Komponen**:
    *   `ProfileCard`: Area unggah foto profil (mendukung drag & drop file gambar, batas maksimal file 2MB), tombol hapus foto profil, nama lengkap, dan peran akun.
    *   `PasswordCard`: Formulir pembaruan keamanan kata sandi yang berisi kolom isian: Password Saat Ini, Password Baru (minimal 6 karakter), dan Konfirmasi Password Baru.
    *   `Topbar Logout Button`: Tombol keluar yang akan menghapus sesi `localStorage` (`pf_token` dan `pf_user`) secara instan serta menampilkan toast sukses logout sebelum dialihkan kembali ke `/login`.

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
