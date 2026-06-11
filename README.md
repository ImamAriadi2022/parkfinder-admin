# ParkFinder Web Admin Dashboard

Dashboard Administrasi Web untuk **ParkFinder** — platform manajemen, monitoring, dan analisis gedung parkir secara real-time. Dashboard ini menggunakan **Multi-Role System** yang secara dinamis membagi alur kerja (*flow*), komponen UI, dan hak akses data antara **Super Admin** dan **Staff Gedung (Admin Area)**.

Dokumentasi ini ditulis secara detail dan sistematis dalam Bahasa Indonesia formal sebagai referensi teknis yang siap digunakan untuk penulisan **Laporan Tugas Akhir / Skripsi**.

---

## 🚀 Fitur Utama

- **Real-Time Monitoring**: Grafik, metrik, dan tabel log untuk memantau okupansi slot parkir serta aktivitas masuk/keluar kendaraan secara langsung.
- **Manajemen Area & Slot Parkir**: Pengelolaan data gedung parkir beserta layout lantai dan kapasitas slot secara dinamis.
- **Sistem Manajemen Staff**: Pendaftaran, pembagian area tugas, dan pembaruan kredensial bagi petugas pengawas gedung parkir.
- **Pemantauan Pengguna**: Integrasi data profil pengemudi yang terdaftar pada aplikasi mobile maupun pengunjung web guest (tamu).
- **Interaksi & Feedback Responsif (Global Toast)**: Dilengkapi sistem **Global Toast Notification** (Sukses, Peringatan, Kesalahan, Info) berbasis animasi transisi CSS untuk umpan balik instan pada setiap tindakan manipulasi data.
- **Sistem Notifikasi Bell**: Fitur notifikasi drop-down di bar atas untuk memantau alert operasional real-time sesuai peran.
- **Full API-driven & Clean Code**: Aplikasi sepenuhnya terintegrasi dengan backend API production tanpa menggunakan data mock.

---

## 🛠️ Tech Stack & Arsitektur Sistem

- **Framework Utama**: React 19 (JavaScript) & Vite (Bundler)
- **Routing**: React Router DOM v7 (Mendukung rute terproteksi/Guarded Routes)
- **State & Context**: React Context API (`AppContext.jsx`) untuk manajemen global state (autentikasi, tema visual, dan antrian toast).
- **Visualisasi Data**: Recharts & Lucide React (ikonografi modern).
- **Styling**: Pure CSS (Vanilla CSS) dengan Custom CSS Variables untuk mendukung tema **Dark Mode** dan **Light Mode** secara dinamis.
- **Otorisasi Keamanan**: JSON Web Token (JWT) yang disimpan di `localStorage` (`pf_token`) dan dikirimkan secara otomatis di setiap *request header* (`Authorization: Bearer <token>`).

---

## 📂 Struktur Direktori Proyek

```text
web-admin/
├── public/                 # Aset statis publik (logo, favicon)
├── src/
│   ├── assets/             # Gambar dan aset media lokal
│   ├── components/         # Komponen UI global (Sidebar, Topbar, Layouts, dll.)
│   │   ├── pages/          # Sub-komponen modular tersegregasi per halaman
│   │   │   ├── LoginPage/  # Form, header, dan toggle halaman login
│   │   │   ├── UsersPage/  # Komponen summary, filter, tabel, dan modal detail user
│   │   │   ├── ProfilePage/# Panel upload foto dan pembaruan password
│   │   │   └── StaffDashboard/ # Modal edit info gedung operasional staff
│   │   ├── SlotManagerModal.jsx # Komponen visual grid pengelola slot parkir
│   │   └── StaffLayout.jsx      # Kerangka layout antarmuka khusus peran Staff
│   ├── context/            # Pengelola state global aplikasi
│   │   └── AppContext.jsx  # AuthState, ThemeState, & ToastNotificationState
│   ├── pages/              # Halaman-halaman utama (Views)
│   │   ├── LoginPage.jsx   # Halaman autentikasi
│   │   ├── Dashboard.jsx   # Dashboard analitik Super Admin
│   │   ├── StaffDashboard.jsx # Dashboard pemantauan lokal Staff Gedung
│   │   ├── ParkingsPage.jsx# Pengelolaan area dan slot gedung parkir
│   │   ├── AdminsPage.jsx  # Pengelolaan akun staff/petugas
│   │   ├── UsersPage.jsx   # Pemantauan data pengguna aplikasi
│   │   └── ProfilePage.jsx # Pengaturan profil & kata sandi admin
│   ├── services/           # Layer integrasi data & API
│   │   ├── apiService.js   # Konfigurasi fetch client & endpoint request (GET/POST/PUT/DELETE)
│   │   └── dataService.js  # Abstraksi pemrosesan respons data API ke komponen UI
│   ├── styles/             # Berkas CSS global
│   │   └── index.css       # Core design system, variabel warna HSL, dan animasi
│   ├── App.jsx             # Konfigurasi routing & rute terproteksi
│   └── main.jsx            # Entry point rendering React ke DOM
├── index.html              # Template HTML utama
├── package.json            # Konfigurasi dependensi proyek
└── vite.config.js          # Konfigurasi bundler Vite
```

---

## 🔐 Matriks Peran dan Hak Akses (Role Permission Matrix)

| Fitur / Halaman | Super Admin | Staff Gedung / Admin Area | Keterangan |
| :--- | :---: | :---: | :--- |
| **Dashboard Analitik Makro** | ✅ Ya | ❌ Tidak | Statistik keseluruhan jaringan parkir |
| **Dashboard Pemantauan Lokal** | ❌ Tidak | ✅ Ya | Pemantauan terpusat pada 1 gedung tugas |
| **Manajemen Gedung Parkir** | ✅ Ya | ❌ Tidak | Tambah, ubah, dan hapus area/gedung |
| **Tambah Slot Parkir Baru** | ✅ Ya | ❌ Tidak | Membuat slot baru dan men-generate Sensor ID |
| **Edit Info Gedung Tugas** | ❌ Tidak | ✅ Ya | Staff dapat mengubah alamat & catatan gedung tugas |
| **Kelola Status Slot (Visual Grid)** | ✅ Ya | ✅ Ya | Mengubah status slot (Staff terlindungi dari readonly slot terisi) |
| **Manajemen Akun Staff** | ✅ Ya | ❌ Tidak | Pendaftaran & pemindahan wilayah tugas staff |
| **Pemantauan Data Pengguna** | ✅ Ya | ❌ Tidak | Melihat profil pengendara mobile & web guest |
| **Pengaturan Akun & Password** | ✅ Ya | ❌ Tidak | Pengaturan keamanan profil personal |

---

## 🖥️ Analisis & Deskripsi Detail Halaman Aplikasi (Untuk Skripsi)

Sistem ini didesain dengan antarmuka yang sangat responsif, memiliki animasi transisi halus (`animate-fade-up`), serta dilengkapi sistem feedback instan. Berikut adalah analisis rinci dari masing-masing halaman:

### 1. Halaman Login (Login Page) — Rute: `/login` (Akses Publik)
- **Deskripsi Visual**: 
  Halaman login dirancang bersih dengan kartu formulir (*login card*) melayang di tengah layar berkat efek *glassmorphism*. Latar belakang menggunakan gradasi radial biru-ungu yang dinamis dengan pendaran cahaya dekoratif di pojok layar untuk memberikan kesan modern dan futuristik.
- **Elemen UI & Komponen**:
  1. `LoginHeader`: Menampilkan Logo ParkFinder dan teks judul ("Masuk ke Dashboard") beserta sub-deskripsi adaptif.
  2. `LoginRoleToggle`: Pilihan tab peran interaktif untuk berpindah mode:
     - **🛡️ Admin Parkir** (Akses sebagai Super Admin)
     - **👷 Staff Gedung** (Akses sebagai Admin Area)
  3. `LoginForm`: Formulir isian yang terdiri atas:
     - *Input Email*: Memiliki ikon amplop di sebelah kiri, tipe input `email`, placeholder `admin@parkfinder.id` dengan validasi wajib diisi (*required*).
     - *Input Password*: Memiliki ikon gembok di sebelah kiri, fitur tombol *show/hide* berupa ikon mata di sebelah kanan untuk memperlihatkan/menyembunyikan kata sandi.
     - *Tombol Submit (Masuk)*: Menggunakan tombol berwarna biru aksen (`btn-primary`). Saat status pengiriman data aktif, teks otomatis berubah menjadi "Memverifikasi..." disertai animasi putar lingkaran *loading spinner*.
     - *Alert Error Box*: Kotak notifikasi berwarna merah transparan (`rgba(239,68,68,0.1)`) yang muncul di atas formulir jika kredensial salah, menampilkan pesan kesalahan spesifik dari API.
- **Alur Interaksi (User Flow)**:
  ```mermaid
  graph TD
      A[Mulai] --> B[Pilih Peran di Toggle: Super Admin / Staff]
      B --> C[Masukkan Email & Password]
      C --> D[Klik Tombol Masuk]
      D --> E{Kredensial Valid?}
      E -- Tidak --> F[Tampilkan Alert Merah & Getar Input]
      E -- Ya --> G[Simpan JWT & User Data di LocalStorage]
      G --> H[Tampilkan Toast Sukses Selamat Datang]
      H --> I[Navigasi otomatis ke Rute Utama /]
  ```

---

### 2. Halaman Dashboard Utama (Dashboard Page) — Rute: `/` (Peran: Super Admin)
- **Deskripsi Visual**: 
  Pusat kendali utama bagi Super Admin untuk memantau performa bisnis seluruh gedung parkir. Menampilkan grid informasi ringkas, diagram progress bar keterisian, dan panel informasi server.
- **Elemen UI & Komponen**:
  1. `Page Header`: Judul halaman "Dashboard", teks sambutan dinamis nama admin, dan tombol "Refresh" dengan ikon putar untuk memuat ulang data secara real-time dari API.
  2. `Stat Grid (KPI Cards)`: Terdiri dari 4 kartu metrik dengan visualisasi warna adaptif:
     - **Total Area Parkir**: Menampilkan jumlah gedung parkir yang aktif dengan ikon lokasi berwarna biru.
     - **Total Slot**: Jumlah kapasitas slot parkir di seluruh gedung dengan ikon huruf P.
     - **Slot Terisi**: Jumlah slot yang sedang digunakan (status `occupied`) dengan ikon mobil berwarna jingga.
     - **Slot Kosong**: Jumlah slot yang tersedia (status `available`) dengan ikon mobil berwarna hijau.
  3. `Occupancy Card (Okupansi per Area)`: Menyajikan visualisasi tingkat okupansi per gedung parkir dalam bentuk persentase dan grafik progress bar. 
     - **Mekanisme Pewarnaan Otomatis**: Warna progress bar akan berubah sesuai ambang batas keterisian:
       - **Merah (`var(--red)`)**: Keterisian kritis &ge; 80% (gedung hampir penuh).
       - **Jingga (`var(--orange)`)**: Keterisian sedang &ge; 50%.
       - **Hijau (`var(--green)`)**: Keterisian aman < 50%.
  4. `System Info Card`: Panel informasi samping yang menampilkan data internal sistem, antara lain: Peran akun aktif, email login, persentase total okupansi gabungan, dan indikator status koneksi server ("Online" dengan lampu berkedip hijau).

---

### 3. Halaman Dashboard Staff Gedung (Staff Dashboard) — Rute: `/` (Peran: Staff Gedung)
- **Rancangan Antarmuka Terintegrasi (Desain Khusus Skripsi)**:
  > [!NOTE]
  > Berbeda dari Super Admin, antarmuka Staff dirancang sebagai **Single-Page Operations Center**. Di halaman ini, **tidak ada Halaman Gedung terpisah** maupun **Halaman Profil terpisah**. Hal ini dikarenakan:
  > 1. **Efisiensi Lapangan**: Staff bertugas memantau satu gedung penugasan secara intensif, sehingga semua kebutuhan (monitoring log masuk-keluar, manajemen status slot, dan edit info alamat gedung) diletakkan langsung di satu dashboard utama.
  > 2. **Keamanan & Kontrol Terpusat**: Detail akun staff dikelola secara mutlak oleh Super Admin (pada halaman `/staff`), sehingga tidak memerlukan halaman profil mandiri untuk meminimalkan risiko manipulasi data oleh staff di lokasi.
- **Elemen UI & Komponen**:
  1. `Staff Header`: Menampilkan nama staff, nama gedung parkir tugas (diambil dinamis dari database melalui `user.parkingName`), tombol aksi "Kelola Slot" (warna biru), dan "Edit Gedung" (warna jingga).
  2. `KPI Cards (6 Kolom)`: Informasi cepat mengenai: Kapasitas Total, Slot Terisi, Slot Tersedia, Booking Aktif, Jumlah Scan Berhasil, dan Jumlah Scan Gagal.
  3. `Monitor Panel Tabs (Live Logs)`: Antarmuka tabulasi dinamis untuk memantau data transaksi real-time:
     - **Tab Scan Logs**: Menampilkan tabel riwayat pemindaian kode QR tiket masuk/keluar (plat kendaraan, nama pengendara, waktu, aksi masuk/keluar, dan badge status sukses `success` hijau atau gagal `failed` merah).
     - **Tab Booking List**: Daftar reservasi slot aktif saat ini lengkap dengan durasi parkir.
     - **Tab Swap Requests**: Memantau permintaan pertukaran slot parkir antar pengguna aplikasi.
     - *Bar Pencarian (Search Input)*: Filter pencarian instan untuk menyaring data log berdasarkan nama pengguna, plat nomor, atau kode tiket secara langsung.
  4. **Modal Edit Gedung (Staff)**:
     - Form isian untuk memperbarui: **Alamat Gedung** (Textarea), **Catatan Operasional** (Textarea, misal: *"Lantai 2 ditutup karena genangan air"*), dan **Slot Terisi Saat Ini** (Input angka manual untuk sinkronisasi cepat dengan kondisi lapangan).
     - Validasi batas input: jumlah slot terisi tidak boleh melebihi kapasitas total gedung.

---

### 4. Halaman Kelola Slot Parkir — Komponen: `SlotManagerModal.jsx` (Akses: Bersama)
- **Fungsi Utama**: Komponen popup interaktif yang menampilkan denah tata letak (*layout grid*) slot parkir per lantai secara visual untuk melakukan pemantauan dan pengubahan status slot secara real-time.
- **Elemen UI & Komponen**:
  1. `Status Summary Bar`: Panel atas yang menunjukkan jumlah slot berdasarkan status: Tersedia (🟢), Terisi (🔴), Rusak (⛔), Maintenance (🔧), dan Nonaktif (⚫).
  2. `Floor Tabs`: Pilihan lantai gedung parkir (misal: Lantai L1, Lantai L2, Lantai L3) untuk memfilter tampilan grid slot di bawahnya.
  3. `Visual Slot Grid`: Grid interaktif yang menyajikan tombol representasi slot parkir. Setiap kotak slot memiliki warna latar belakang, border, dan ikon sesuai dengan statusnya.
- **Alur Interaksi Pengelolaan Status Slot**:
  ```mermaid
  graph TD
      A[Klik Tombol Kelola Slot] --> B[Buka SlotManagerModal]
      B --> C[Pilih Lantai melalui Tab Lantai]
      C --> D[Klik Salah Satu Kotak Slot]
      D --> E{Apakah Status Terisi?}
      E -- Ya & Peran Staff --> F[Readonly: Dinonaktifkan demi Keamanan]
      E -- Tidak / Peran Admin --> G[Tampilkan Popover Status Picker]
      G --> H[Pilih Status Baru: Tersedia/Rusak/Maintenance/Nonaktif]
      H --> I[Kotak Slot Ditandai Outline Biru & Jumlah Perubahan Bertambah]
      I --> J[Klik Tombol Simpan Perubahan]
      J --> K[Kirim Request PUT ke API Server]
      K --> L[Toast Sukses & Data Diperbarui]
  ```
- **Fitur Khusus**:
  - *Outline Biru (Unsaved Changes Indicator)*: Slot yang statusnya telah diubah tetapi belum disimpan ke database akan menampilkan outline berwarna biru sebagai pengingat visual.
  - *Tombol Reset*: Tombol di sebelah tombol simpan untuk membatalkan seluruh perubahan sementara sebelum disimpan ke server.

---

### 5. Halaman Manajemen Gedung Parkir (Parkings Page) — Rute: `/parkings` (Peran: Super Admin)
- **Deskripsi Visual**: 
  Antarmuka ini dirancang menggunakan **Split-Layout (2 Kolom)**. Kolom kiri menampilkan daftar gedung parkir, dan kolom kanan menampilkan detail daftar slot parkir dari gedung yang dipilih.
- **Elemen UI & Komponen**:
  1. `Left Column (Daftar Area)`:
     - Setiap baris gedung menampilkan nama gedung, alamat, dan jumlah lantai.
     - Dilengkapi tombol "Edit" (ikon pensil) dan "Hapus" (ikon tempat sampah dengan prompt konfirmasi pop-up).
     - Tombol "+ Tambah Area" di pojok kanan atas untuk mendaftarkan gedung baru.
  2. `Right Column (Detail Slot)`:
     - Menampilkan tabel data slot parkir dari area terpilih: Nama Slot, Tipe Kendaraan (Motor/Mobil), Status Badge, dan Kolom Aksi.
     - Aksi Cepat: Tombol toggle status instan seperti "Maintenance" (untuk menonaktifkan slot yang rusak) atau "Aktifkan" (untuk mengembalikan status ke tersedia).
     - Tombol "+ Tambah Slot" di bagian header kolom kanan.

- **Alur & Formulir Detail Tambah Slot Baru (Detailed Flow)**:
  1. Super Admin menekan tombol **"+ Tambah Slot"** pada kolom kanan.
  2. Sistem memunculkan **Add Slot Modal** di atas layar dengan form isian:
     - **Floor (Lantai)**: Input tipe angka (`number`) wajib diisi (misal: `1`).
     - **Nama Slot**: Input tipe teks (`text`) wajib diisi (misal: `A-04`).
     - **Sensor ID**: Kolom input bertipe read-only (tidak dapat diedit manual) yang nilainya di-generate secara real-time oleh sistem dengan sintaks berikut:
       $$\text{Sensor ID} = \text{SENSOR} - [\text{8 Karakter Pertama ID Area}] - [\text{Lantai}] - [\text{Nama Slot}]$$
       *Contoh*: `SENSOR-BWOJPZOA-1-A-04`.
     - **Status Awal**: Dropdown pilihan (`select`) berisi opsi: Tersedia (*available*), Terisi (*occupied*), dan Maintenance (*maintenance*).
  3. Super Admin mengklik tombol **"Simpan"**:
     - Sistem mengaktifkan status loading (`saving = true`).
     - **Pembersihan Payload (Solusi Validasi API)**: Sistem secara otomatis menghapus properti `"status"` dari objek payload untuk menghindari penolakan skema validasi Joi di backend (karena backend hanya menerima data `floor`, `slotName`, dan `sensorId` pada rute pembuatan slot awal).
     - Program memanggil service API `POST /areas/slots`.
  4. **Pemberitahuan Sukses**: Setelah API mengembalikan respons sukses, modal ditutup otomatis -> Toast sukses hijau bertuliskan *"Slot parkir baru berhasil ditambahkan!"* muncul di layar -> fungsi `fetchSlots()` dipanggil untuk merender ulang tabel data slot secara real-time tanpa me-reload browser.

---

### 6. Halaman Staff Parkir (Admins Page) — Rute: `/staff` (Peran: Super Admin)
- **Deskripsi Visual**: 
  Tabel berisikan seluruh petugas (staff) lapangan beserta data area penugasan mereka. Dilengkapi header aksi dan modal manajemen formulir.
- **Elemen UI & Komponen**:
  1. `Staff Table`: Kolom-kolom menampilkan:
     - **Nama**: Menampilkan inisial huruf di dalam lingkaran avatar berwarna-warni dan nama lengkap staff.
     - **Email**: Alamat email aktif staff.
     - **Area Parkir**: Nama gedung parkir penugasan staff (misal: *"RSUD Abdul Moeloek"*).
     - **Aksi**: Tombol "Edit" (ikon pensil) dan "Hapus" (ikon sampah).
  2. **Modal Tambah Staff**:
     - Formulir input: Nama Lengkap, Alamat Email, Password Akun, dan Dropdown Area Parkir (memuat daftar gedung secara dinamis dari database).
  3. **Modal Edit Staff**:
     - Formulir input: Nama Lengkap, Password Baru (Opsional, kosongkan jika tidak ingin diubah), dan Dropdown Area Parkir untuk memindahkan staff ke lokasi gedung lain.
     - Kolom Email ditampilkan sebagai label statis abu-abu (readonly) karena email staff merupakan primary key unik yang tidak diperkenankan diubah setelah registrasi akun.

---

### 7. Halaman Data Pengguna (Users Page) — Rute: `/users` (Peran: Super Admin)
- **Deskripsi Visual**: 
  Menyajikan rekapitulasi data pengguna aplikasi yang terintegrasi dengan sistem ParkFinder. Terdiri atas kartu metrik ringkasan, bilah pencarian dan filter, serta tabel database.
- **Elemen UI & Komponen**:
  1. `Users Summary`: 4 kartu metrik menampilkan: Total Pengguna, Pengguna Aktif, Pengguna Nonaktif, Pengguna Mobile App, dan Pengguna Web (Tamu/Guest).
  2. `Filter Bar`: Input pencarian cepat berdasarkan nama, email, plat nomor kendaraan, atau ID pengguna. Memiliki tombol filter tab berdasarkan Platform (Semua / Mobile / Web) dan Status (Semua / Aktif / Nonaktif).
  3. `Users Table`: Menampilkan kolom data pengguna. Untuk **Web Guest (Tamu)**, kolom kontak secara otomatis menampilkan label miring *"Tidak ada akun"* dan platform bertuliskan badge ungu *"Web (Tamu)"*.
  4. **User Detail Modal (Popup)**:
     - Membuka informasi detail pengguna yang dipilih.
     - **Pemberitahuan Pengguna Tamu (Web Guest)**: Jika tipe pengguna adalah guest, sistem memunculkan banner biru bertuliskan: *"🌐 Pengguna ini mengakses melalui Web User tanpa login — tidak ada data akun."*
     - Menampilkan informasi detail: Tipe platform, nomor plat kendaraan utama, email, telepon, total transaksi booking, booking aktif saat ini, tanggal bergabung, tanggal terakhir aktif, dan status akun.
     - Aksi: Tombol "Nonaktifkan" berwarna merah (hanya aktif untuk pengguna terdaftar / non-guest) dan tombol "Tutup".

---

### 8. Halaman Profil Akun (Profile Page) — Rute: `/profile` (Peran: Super Admin)
- **Deskripsi Visual**: 
  Antarmuka satu kolom terpusat yang terbagi menjadi panel modifikasi foto profil dan panel pengaturan keamanan kata sandi.
- **Elemen UI & Komponen**:
  1. `ProfileCard`:
     - Menampilkan foto profil saat ini (menggunakan inisial huruf jika foto kosong).
     - Fitur unggah foto dengan dukungan *drag & drop* file gambar.
     - **Validasi Keamanan File**: Sistem akan memblokir file dan menampilkan pesan peringatan toast jika ukuran file melebihi batas maksimal **2MB** atau jika format file bukan berupa gambar (*image/jpeg*, *image/png*).
     - Tombol "Hapus Foto" untuk mengembalikan foto profil ke avatar inisial default.
  2. `PasswordCard`:
     - Formulir penggantian kata sandi dengan field: **Password Saat Ini**, **Password Baru**, dan **Konfirmasi Password Baru**.
     - Setiap kolom password dilengkapi tombol ikon mata untuk menyembunyikan/memperlihatkan karakter sandi.
     - **Validasi Kredensial**: Tombol simpan akan memvalidasi input secara lokal: password baru wajib minimal **6 karakter**, dan password baru harus cocok dengan kolom konfirmasi.

---

### 9. Fitur Notifikasi Real-Time (Bell Alerts) — Akses: Bersama (Top Bar)
- **Deskripsi Visual**:
  Terdapat ikon lonceng pada bar bagian atas aplikasi (pada `Topbar.jsx` untuk Super Admin, dan `StaffLayout.jsx` untuk Staff). Lonceng dilengkapi lampu penanda merah kecil jika terdapat notifikasi yang belum dibaca.
- **Mekanisme & Konten Alert**:
  Ketika ikon diklik, modal drop-down melayang akan tampil menampilkan daftar alert terbaru yang diambil dari backend API:
  - **Notifikasi Peran Super Admin**:
    - *Contoh*: `"🔴 RSUD Abdul Moeloek mencapai 92% kapasitas"` (Waktu: 2 mnt lalu) - Menandakan perlunya rekayasa lalu lintas atau pengalihan parkir.
    - *Contoh*: `"🟢 8 booking baru dalam 5 menit terakhir"` - Info performa transaksi masuk.
    - *Contoh*: `"🔄 Farah Amelia melakukan tukar slot"` - Info penukaran slot aktif.
    - *Contoh*: `"⚠️ Scan tiket gagal di Stasiun TK"` - Peringatan adanya kendala mesin scanner gerbang.
  - **Notifikasi Peran Staff Gedung**:
    - *Contoh*: `"🟢 3 kendaraan baru masuk dalam 10 menit"` - Info aktivitas gerbang gedung.
    - *Contoh*: `"⚠️ Scan tiket gagal – cek gerbang masuk"` - Perintah pengecekan fisik unit scanner gerbang tugas.
    - *Contoh*: `"🔄 Permintaan tukar slot diterima"` - Info penukaran slot di gedung tugas.

---

## ⚡ Integrasi API Terpusat

Aplikasi ini menggunakan **HTTP Client fetch** terpusat untuk komunikasi dengan server API production.

- **Base URL API**: `https://backend-api-services-291631508657.asia-southeast2.run.app`
- **Otorisasi Otomatis**: Setiap request akan disisipkan header otorisasi secara dinamis jika token JWT tersedia di browser:
  ```javascript
  const headers = {
    'Content-Type': 'application/json',
    ...(localStorage.getItem('pf_token') && { 'Authorization': `Bearer ${localStorage.getItem('pf_token')}` })
  }
  ```
- **Error Handling**: Setiap respons API di luar kode status `2xx` akan dilempar sebagai objek error dan ditangkap oleh sistem Global Toast untuk ditampilkan sebagai notifikasi visual kesalahan berwarna merah di layar pengguna.

---

## 🔧 Pengembangan Lokal

Langkah-langkah untuk menjalankan proyek di mesin lokal Anda:

### 1. Prasyarat
Pastikan Anda telah memasang [Node.js](https://nodejs.org/) (versi 16 atau yang lebih baru disarankan).

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori proyek:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Lokal)
Mulai server pengembangan lokal dengan perintah:
```bash
npm run dev
```
Buka browser Anda dan akses rute `http://localhost:5173`.

### 4. Build Kompilasi Rilis
Untuk mengompilasi dan mengoptimalkan kode untuk rilis produksi:
```bash
npm run build
```
Hasil kompilasi akan berada di folder `/dist` dan siap di-deploy ke layanan cloud hosting (Vercel, Netlify, dll.).
