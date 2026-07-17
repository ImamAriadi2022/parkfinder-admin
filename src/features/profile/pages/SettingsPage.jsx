import { useState } from 'react';
import { Settings, Bell, Shield, Database, Wifi, Palette } from 'lucide-react';
import SettingSection from '../components/SettingSection';
import InputRow from '../components/InputRow';
import Toggle from '../components/Toggle';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Pengaturan Sistem</h1>
          <p className="page-sub">Konfigurasi dan preferensi admin ParkFinder</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {saved && (
            <div style={{
              padding: '8px 16px', background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10,
              fontSize: 13, color: 'var(--green)', fontWeight: 600
            }}>
              ✓ Pengaturan disimpan
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSave}>Simpan Perubahan</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div>
          <SettingSection icon={Settings} title="Pengaturan Umum">
            <InputRow label="Nama Aplikasi" defaultValue="ParkFinder Admin" placeholder="Nama aplikasi" />
            <InputRow label="Email Admin" defaultValue="admin@parkfinder.id" placeholder="Email" type="email" />
            <InputRow label="Zona Waktu" defaultValue="Asia/Jakarta (WIB)" placeholder="Zona waktu" />
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Bahasa</label>
              <select className="input">
                <option>🇮🇩 Bahasa Indonesia</option>
                <option>🇬🇧 English</option>
              </select>
            </div>
          </SettingSection>

          <SettingSection icon={Bell} title="Notifikasi">
            <Toggle label="Notifikasi Kapasitas Penuh" desc="Alert ketika gedung mencapai >90% kapasitas" />
            <Toggle label="Notifikasi Booking Baru" desc="Notifikasi saat ada booking masuk" />
            <Toggle label="Notifikasi Scan Gagal" desc="Alert ketika ada scan tiket gagal berulang" />
            <Toggle label="Notifikasi Tukar Slot" desc="Update status proses penukaran slot" defaultChecked={false} />
            <Toggle label="Laporan Harian Otomatis" desc="Kirim ringkasan harian ke email admin" />
          </SettingSection>

          <SettingSection icon={Palette} title="Tampilan">
            <Toggle label="Tema Gelap" desc="Gunakan tampilan dark mode (aktif)" />
            <Toggle label="Animasi UI" desc="Aktifkan transisi dan animasi antarmuka" />
            <div style={{ marginTop: 12, marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>Warna Aksen</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#00D2FF', '#7B61FF', '#22c55e', '#f59e0b', '#ef4444'].map(c => (
                  <div key={c} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: c === '#00D2FF' ? '3px solid white' : '2px solid transparent'
                  }} />
                ))}
              </div>
            </div>
          </SettingSection>
        </div>

        {/* Right column */}
        <div>
          <SettingSection icon={Shield} title="Keamanan & Akses">
            <InputRow label="Ubah Password" placeholder="Password saat ini" type="password" />
            <InputRow label="" placeholder="Password baru" type="password" />
            <InputRow label="" placeholder="Konfirmasi password baru" type="password" />
            <div style={{ marginTop: 4, marginBottom: 14 }}>
              <button className="btn btn-ghost btn-sm">Ubah Password</button>
            </div>
            <Toggle label="Autentikasi Dua Faktor (2FA)" desc="Aktifkan 2FA untuk keamanan login admin" defaultChecked={false} />
            <Toggle label="Session Timeout" desc="Logout otomatis setelah 30 menit tidak aktif" />
            <Toggle label="Log Aktivitas Admin" desc="Rekam semua aksi yang dilakukan admin" />
          </SettingSection>

          <SettingSection icon={Database} title="Data & Backup">
            <Toggle label="Backup Otomatis" desc="Backup data harian ke cloud storage" />
            <Toggle label="Retensi Data Booking" desc="Simpan data booking hingga 1 tahun" />
            <Toggle label="Export Data Terjadwal" desc="Export CSV mingguan ke email admin" defaultChecked={false} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-ghost btn-sm">📥 Backup Sekarang</button>
              <button className="btn btn-ghost btn-sm">📊 Export Semua Data</button>
            </div>
          </SettingSection>

          <SettingSection icon={Wifi} title="Integrasi & API">
            <InputRow label="Base URL API" defaultValue="https://api.parkfinder.id/v1" placeholder="API URL" />
            <InputRow label="API Key" defaultValue="pk_live_••••••••••••••••••••" placeholder="API Key" type="password" />
            <Toggle label="Mode Produksi" desc="Gunakan endpoint production (bukan sandbox)" />
            <Toggle label="Push Notification (Firebase)" desc="Aktifkan notifikasi push ke mobile app" />
            <Toggle label="Google Maps Integration" desc="Tampilkan peta interaktif di dashboard" defaultChecked={false} />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Status Koneksi</div>
              {[
                { name: 'API Backend', status: 'Terhubung', ok: true },
                { name: 'Database', status: 'Terhubung', ok: true },
                { name: 'Firebase FCM', status: 'Terhubung', ok: true },
                { name: 'Google Maps', status: 'Tidak Aktif', ok: false }
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text2)' }}>{c.name}</span>
                  <span style={{ color: c.ok ? 'var(--green)' : 'var(--text3)', fontWeight: 600 }}>
                    {c.ok ? '● ' : '○ '}{c.status}
                  </span>
                </div>
              ))}
            </div>
          </SettingSection>
        </div>
      </div>

      {/* Info box */}
      <div style={{
        padding: '16px 20px', background: 'rgba(0,210,255,0.05)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius)', display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 4
      }}>
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>ParkFinder Admin v1.0.0</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            Sistem monitoring terpadu untuk Web User dan Mobile App ParkFinder. 
            Untuk bantuan teknis, hubungi <span style={{ color: 'var(--accent)' }}>dev@parkfinder.id</span>
          </div>
        </div>
      </div>
    </div>
  );
}
