import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, RefreshCw, Sun, Moon } from 'lucide-react';
import { useApp } from '../providers/AppProvider';
import Avatar from '../../shared/components/Avatar';

const PAGE_TITLES = {
  '/':                  { title: 'Dashboard',          sub: 'Selamat datang kembali, Admin' },
  '/parkings':          { title: 'Gedung Parkir',       sub: 'Kelola semua lokasi parkir' },
  '/bookings':          { title: 'Manajemen Booking',   sub: 'Monitor semua transaksi booking' },
  '/users':             { title: 'Data Pengguna',       sub: 'Kelola akun pengguna Web & Mobile' },
  '/scans':             { title: 'Log Scan QR',         sub: 'Riwayat scan tiket parkir' },
  '/swaps':             { title: 'Tukar Slot',          sub: 'Monitor permintaan penukaran slot' },
  '/analytics':         { title: 'Analitik & Statistik', sub: 'Insight performa sistem parkir' },
  '/staff':             { title: 'Staff Parkir',       sub: 'Kelola petugas monitoring gedung parkir' },
  '/settings':          { title: 'Pengaturan',          sub: 'Konfigurasi sistem admin' },
};

const NOTIFS = [
  { icon: '🔴', text: 'RSUD Abdul Moeloek mencapai 92% kapasitas', time: '2 mnt lalu' },
  { icon: '🟢', text: '8 booking baru dalam 5 menit terakhir', time: '5 mnt lalu' },
  { icon: '🔄', text: 'Farah Amelia melakukan tukar slot', time: '18 mnt lalu' },
  { icon: '⚠️', text: 'Scan tiket gagal di Stasiun TK', time: '34 mnt lalu' },
];

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { theme, toggleTheme } = useApp();
  const page = PAGE_TITLES[location.pathname] || { title: 'ParkFinder Admin', sub: '' };
  const [notifOpen, setNotifOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onMenuClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex', padding: 6 }}>
          <Menu size={20} />
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>{page.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>{page.sub}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} title={isDark ? 'Switch ke Light Mode' : 'Switch ke Dark Mode'} style={{
          background: 'var(--bg-hover)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
          color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
        }}>
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span style={{ display: 'none' }}>{isDark ? 'Light' : 'Dark'}</span>
        </button>

        {/* Refresh */}
        <button onClick={() => window.location.reload()} title="Refresh" style={{
          background: 'var(--bg-hover)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
          color: 'var(--text2)', display: 'flex', alignItems: 'center',
        }}>
          <RefreshCw size={14} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
            color: 'var(--text2)', display: 'flex', alignItems: 'center', position: 'relative',
          }}>
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 6, right: 8, width: 7, height: 7,
              borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--bg-surface)',
            }} />
          </button>
          {notifOpen && (
            <>
              <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: 300, background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                  Notifikasi <span className="badge badge-red" style={{ marginLeft: 6 }}>{NOTIFS.length}</span>
                </div>
                {NOTIFS.map((n, i) => (
                  <div key={i} onClick={() => setNotifOpen(false)} style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 18 }}>{n.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => navigate('/profile')}
          title="Profil & Keamanan"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', borderRadius: '50%' }}
        >
          <Avatar size={34} fontSize={14} />
        </button>
      </div>
    </header>
  );
}
