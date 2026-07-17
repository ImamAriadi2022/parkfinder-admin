import { useState } from 'react';
import { Bell, Sun, Moon, LogOut, RefreshCw, Building2 } from 'lucide-react';
import { useApp } from '../providers/AppProvider';

const LOGO_URL = 'https://storage.googleapis.com/parkfinderbucket/foto/logo.png';

const NOTIFS_STAFF = [
  { icon: '🟢', text: '3 kendaraan baru masuk dalam 10 menit', time: '5 mnt lalu' },
  { icon: '⚠️', text: 'Scan tiket gagal – cek gerbang masuk', time: '18 mnt lalu' },
  { icon: '🔄', text: 'Permintaan tukar slot diterima', time: '32 mnt lalu' },
];

export default function StaffLayout({ children }) {
  const { user, logout, theme, toggleTheme } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', flexDirection:'column' }}>
      {/* Top Bar */}
      <header style={{
        height: 64, background:'var(--bg-surface)', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 24px', position:'sticky', top:0, zIndex:50,
        backdropFilter:'blur(12px)',
      }}>
        {/* Left: Logo + Gedung Info */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <img src={LOGO_URL} alt="ParkFinder" style={{ height:32, width:'auto', objectFit:'contain' }}
            onError={e => { e.target.style.display='none' }}
          />
          <div style={{ width:1, height:32, background:'var(--border)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:32, height:32, borderRadius:9, background:'var(--accent-glow)',
              border:'1px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Building2 size={16} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', lineHeight:1.2 }}>
                {user?.parkingName}
              </div>
              <div style={{ fontSize:11, color:'var(--text3)' }}>Staff Dashboard · Mode Monitoring</div>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'} style={{
            background:'var(--bg-hover)', border:'1px solid var(--border)',
            borderRadius:10, padding:'7px 10px', cursor:'pointer', color:'var(--text2)', display:'flex',
          }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Refresh */}
          <button onClick={() => window.location.reload()} style={{
            background:'var(--bg-hover)', border:'1px solid var(--border)',
            borderRadius:10, padding:'7px 10px', cursor:'pointer', color:'var(--text2)', display:'flex',
          }}>
            <RefreshCw size={14} />
          </button>

          {/* Notif */}
          <div style={{ position:'relative' }}>
            <button onClick={() => setNotifOpen(!notifOpen)} style={{
              background:'var(--bg-hover)', border:'1px solid var(--border)',
              borderRadius:10, padding:'7px 10px', cursor:'pointer', color:'var(--text2)',
              display:'flex', position:'relative',
            }}>
              <Bell size={16} />
              <span style={{ position:'absolute', top:6, right:8, width:7, height:7, borderRadius:'50%', background:'var(--red)', border:'1.5px solid var(--bg-surface)' }} />
            </button>
            {notifOpen && (
              <>
                <div onClick={() => setNotifOpen(false)} style={{ position:'fixed', inset:0, zIndex:150 }} />
                <div style={{
                  position:'absolute', right:0, top:'calc(100% + 8px)', width:280,
                  background:'var(--bg-card)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow)', zIndex:200, overflow:'hidden',
                }}>
                  <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:14, color:'var(--text)' }}>
                    Notifikasi Gedung
                  </div>
                  {NOTIFS_STAFF.map((n, i) => (
                    <div key={i} onClick={() => setNotifOpen(false)} style={{
                      padding:'11px 16px', borderBottom:'1px solid var(--border)',
                      display:'flex', gap:10, cursor:'pointer',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:16 }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize:12, color:'var(--text)', lineHeight:1.4 }}>{n.text}</div>
                        <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Staff avatar + nama */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px 4px 4px', background:'var(--bg-hover)', border:'1px solid var(--border)', borderRadius:12 }}>
            <div className="avatar avatar-sm">{user?.name?.[0] || 'S'}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', lineHeight:1.2 }}>{user?.name}</div>
              <div style={{ fontSize:10, color:'var(--text3)' }}>Staff</div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={logout} title="Logout" style={{
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)',
            borderRadius:10, padding:'7px 10px', cursor:'pointer', color:'var(--red)', display:'flex', gap:5, alignItems:'center', fontSize:12, fontWeight:600,
          }}>
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex:1, padding:24, maxWidth:1400, width:'100%', margin:'0 auto' }}>
        {children}
      </main>
    </div>
  );
}
