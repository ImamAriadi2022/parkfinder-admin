# LAMPIRAN: DOKUMENTASI PENGUJIAN END-TO-END (E2E) MENGGUNAKAN PLAYWRIGHT FRAMEWORK

Dokumentasi ini disusun sebagai panduan teknis sekaligus lampiran skripsi untuk menjelaskan implementasi, arsitektur, konfigurasi, dan kasus uji (test cases) dari pengujian *End-to-End* (E2E) pada aplikasi **ParkFinder Web Admin**.

---

## 1. PENDAHULUAN
Pengujian *End-to-End* (E2E) bertujuan untuk memastikan seluruh alur aplikasi berjalan secara harmonis dari sudut pandang pengguna akhir (user-centric). Pada proyek frontend **ParkFinder Web Admin** yang berbasis **React / Vite**, framework **Playwright** dipilih sebagai solusi pengujian E2E karena:
1. **Dukungan Multi-Browser**: Dapat menguji aplikasi pada tiga mesin peramban utama secara bersamaan: Chromium (Chrome, Edge), Firefox (Gecko), dan WebKit (Safari).
2. **Kinerja Tinggi**: Eksekusi pengujian berjalan sangat cepat secara paralel dengan arsitektur berbasis *event-driven* yang meminimalkan *flakiness* (ketidakstabilan hasil tes).
3. **Rich Debugging Tools**: Menyediakan visualisasi laporan interaktif berupa tangkapan layar (screenshots), rekaman video, serta pelacakan jejak eksekusi (*Traces*).

---

## 2. ARSITEKTUR DAN STRUKTUR FOLDER PENGUJIAN
Pengujian diorganisasikan ke dalam direktori khusus bernama `tests/` di akar proyek (root project) dengan struktur hierarki sebagai berikut:

```text
tests/
├── auth/
│   └── auth.spec.js          # Pengujian login, validasi formulir, dan logout
├── booking/
│   └── booking.spec.js       # Pengujian pemantauan booking dan detail reservasi
├── helpers/
│   ├── mock-api.js           # Sistem simulasi (mocking) API backend
│   └── test-helper.js        # Fungsi pembantu (reusable helper) untuk autentikasi & navigasi
├── navigation/
│   └── navigation.spec.js    # Pengujian kontrol akses rute & menu navigasi berdasarkan peran
├── parking/
│   └── parking.spec.js       # Pengujian pengelolaan area gedung dan slot parkir (sensor)
└── profile/
    └── profile.spec.js       # Pengujian detail profil admin dan perubahan kata sandi
```

### 2.1. Reusable Helpers (`test-helper.js`)
Guna menghindari duplikasi kode (*Don't Repeat Yourself* - DRY), dibuat fungsi pembantu yang dapat digunakan kembali di berbagai berkas pengujian:
* `loginAsSuperAdmin(page)`: Mengotomatiskan pengisian formulir login menggunakan peran Super Admin dan memverifikasi pengalihan halaman.
* `loginAsStaff(page)`: Mengotomatiskan pengisian formulir login menggunakan peran Staff Gedung.
* `navigateTo(page, menuText)`: Membantu navigasi menu samping (sidebar) berdasarkan nama teks menu.

### 2.2. Sistem Mocking API (`mock-api.js`)
Salah satu keunggulan arsitektur pengujian ini adalah penerapan **Mock API**. Pengujian E2E tidak menembak langsung ke server backend produksi/staging untuk menghindari ketergantungan jaringan serta polusi data uji di basis data riil. 

Menggunakan fitur `page.route` dari Playwright, semua permintaan HTTP ke server backend (`https://backend-api-services-.../*`) dicegat (intercepted) di level jaringan browser lalu dialihkan untuk mengembalikan data tiruan (*mock data* in-memory) yang didefinisikan secara lokal di `mock-api.js`.
* **Keuntungan**: Tes berjalan terisolasi, deterministik, tanpa memodifikasi satu baris pun kode produksi aplikasi utama.

---

## 3. KONFIGURASI PLAYWRIGHT (`playwright.config.js`)
Konfigurasi utama diatur pada berkas `playwright.config.js`. Berikut adalah rangkuman poin konfigurasi krusial:

* **Direktori Uji**: `testDir: './tests'` mendefinisikan lokasi berkas uji.
* **Timeout Global**: Batas waktu eksekusi tiap kasus uji dibatasi maksimal `30000ms` (30 detik).
* **Paralelisasi**: Pengujian dijalankan secara paralel untuk mempercepat total waktu eksekusi.
* **Boots Server Otomatis (`webServer`)**: Konfigurasi `webServer` memastikan server pengembangan lokal Vite (`npm run dev` pada `http://localhost:5173`) akan dinyalakan secara otomatis sebelum pengujian dimulai dan dimatikan secara otomatis setelah pengujian selesai.
* **Reporters**: Laporan pengujian disimpan dalam format HTML (`playwright-report/`) yang dapat dibuka secara interaktif.
* **Browser Projects**: Pengujian didelegasikan ke 3 peramban:
  1. **Chromium**: Mewakili mayoritas pengguna Google Chrome, Microsoft Edge, dan Opera.
  2. **Firefox**: Mewakili pengguna Mozilla Firefox.
  3. **WebKit**: Mewakili pengguna Safari (macOS & iOS).

---

## 4. DAFTAR KASUS UJI (TEST SUITES) DAN LOGIKA PENGUJIAN

### 4.1. Modul Autentikasi (`auth.spec.js`)
Menguji keamanan pintu masuk aplikasi web admin:
1. **Menampilkan halaman login & switch role**: Memverifikasi antarmuka login dapat berpindah mode antara "Admin Parkir" (Super Admin) dan "Staff Gedung".
2. **Peringatan validasi input kosong**: Memastikan formulir menolak pengiriman data dan memunculkan pesan kesalahan jika email atau password dikosongkan.
3. **Kredensial tidak valid**: Memastikan sistem menolak email/password yang salah dan menampilkan toast notifikasi kesalahan dari backend.
4. **Login Super Admin berhasil**: Memastikan login sukses, menyimpan token autentikasi ke penyimpanan lokal, dan mengalihkan halaman ke `/` (Dashboard utama).
5. **Logout berhasil**: Memverifikasi proses keluar akun menghapus sesi autentikasi dan mengembalikan pengguna ke halaman `/login`.

### 4.2. Modul Pemantauan Booking (`booking.spec.js`)
Menguji antarmuka pemantauan data transaksi reservasi parkir:
1. **Memuat daftar booking & ringkasan statistik**: Memverifikasi kartu ringkasan (Total, Aktif, Selesai, Ditukar) menghitung dan menampilkan jumlah data yang sesuai dari API.
2. **Pencarian dan penyaringan (filter)**: Memverifikasi kotak pencarian dapat menyaring nama pemesan secara langsung, serta tab filter dapat membagi data berdasarkan status reservasi (Aktif/Selesai).
3. **Membuka detail tiket parkir (modal)**: Memverifikasi klik tombol "Detail" membuka modal dialog yang menampilkan rincian nama pemesan, nomor plat kendaraan, dan area gedung parkir yang dituju.

### 4.3. Modul Manajemen Gedung & Slot (`parking.spec.js`)
Modul inti untuk mengelola aset area parkir dan slot sensor IoT secara dinamis:
1. **Memuat daftar area & slot**: Memverifikasi area parkir (misal: RSUD Abdul Moeloek) termuat di kolom kiri, dan saat dipilih, daftar slot parkir di dalamnya (A-01, A-02, dsb.) termuat di kolom kanan.
2. **Menambah area parkir baru**: Menguji pengisian formulir nama area, alamat, jumlah lantai, dan email kontak, lalu mengirim data dan memverifikasi toast sukses.
3. **Menambah slot dengan Auto-Generated Sensor ID**: Menguji pembuatan slot baru. Memastikan kode sensor IoT unik (seperti `SENSOR-AREA1-1-A03`) digenerasikan secara otomatis berdasarkan kombinasi nama area, lantai, dan nomor slot.
4. **Mengubah status slot parkir**: Menguji aksi cepat mengubah status slot dari `Tersedia (available)` ke `Maintenance` dan sebaliknya (Aktifkan kembali), lalu memastikan warna badge berubah secara dinamis.
5. **Menghapus slot**: Memverifikasi dialog konfirmasi penghapusan slot dan memastikan baris data slot hilang dari tabel setelah dihapus.

### 4.4. Modul Navigasi & Kontrol Akses (`navigation.spec.js`)
Memastikan keamanan pembatasan hak akses (*Role-Based Access Control* - RBAC):
1. **Navigasi penuh untuk Super Admin**: Memastikan pengguna dengan peran `superAdmin` dapat mengakses semua halaman menu: Dashboard, Gedung Parkir, Staff Parkir, Data Pengguna, dan Profil.
2. **Restriksi navigasi peran Staff**: Memastikan pengguna dengan peran `staff` dibatasi aksesnya. Sidebar staff tidak boleh menampilkan menu manajemen staff lain maupun menu data pengguna global demi keamanan data.

### 4.5. Modul Profil & Settings (`profile.spec.js`)
Menguji pembaruan profil personal administrator:
1. **Menampilkan detail profil**: Memverifikasi nama, email, dan peranan pengguna termuat dengan benar di halaman pengaturan.
2. **Ubah kata sandi (Validasi & Berhasil)**: Memverifikasi validasi kesesuaian kata sandi baru dengan konfirmasi kata sandi, serta keberhasilan pengiriman formulir perubahan sandi baru.

---

## 5. CARA MENJALANKAN PENGUJIAN

Perintah berikut didefinisikan pada berkas `package.json` untuk memudahkan eksekusi pengujian:

### 5.1. Menjalankan Seluruh Uji (Headless Mode)
Gunakan perintah ini untuk mengeksekusi semua kasus uji di latar belakang untuk ketiga browser (Chromium, Firefox, WebKit):
```bash
npm run test:e2e
```

### 5.2. Menjalankan Uji pada Browser Spesifik
Untuk menjalankan pengujian hanya pada satu jenis mesin browser (misalnya Firefox):
```bash
npx.cmd playwright test --project=firefox
```

### 5.3. Menampilkan Laporan Uji (HTML Report)
Setelah pengujian selesai dijalankan, laporan HTML dapat dibuka untuk dianalisis melalui perintah:
```bash
npx playwright show-report
```
Laporan ini akan menyajikan statistik persentase kelulusan, durasi tiap tes, serta lampiran visual berupa cuplikan gambar dan rekaman video kegagalan apabila terjadi *error*.

---

## 6. HASIL EVALUASI PENGUJIAN (SUMMARY)
Berdasarkan hasil eksekusi pengujian E2E terakhir pada mesin lokal:
* **Total Kasus Uji**: 54 kasus uji (18 skenario uji × 3 browser).
* **Jumlah Kelulusan**: 54 lulus (100% Passed).
* **Browser Tercakup**: Chromium, Firefox, WebKit.

Hasil kelulusan 100% ini menunjukkan bahwa aplikasi **ParkFinder Web Admin** memiliki ketahanan fungsionalitas yang tinggi, bebas dari kendala regresi, serta siap untuk diintegrasikan dan dipublikasikan ke lingkungan produksi.
