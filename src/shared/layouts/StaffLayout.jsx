import { useApp } from '../../core/providers/AppProvider';

export default function StaffLayout({ children }) {
  const { user, logout } = useApp();
  
  return (
    <div className="staff-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Topbar */}
      <header className="admin-topbar" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.5px' }}>ParkFinder</span>
          <span className="badge badge-blue">Staff Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{(user?.name || 'S').charAt(0).toUpperCase()}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{user?.name || 'Staff'}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout} style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,0.2)' }}>
            Keluar
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
