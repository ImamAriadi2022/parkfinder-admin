import {
  Car,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../core/providers/AppProvider';

export default function Sidebar({ open, onClose }) {
  const { logout, isSuperAdmin, setSearch } = useApp();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    {
      section: 'Utama',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/parkings', label: 'Gedung Parkir', icon: Car },
      ],
    },
    ...(isSuperAdmin ? [{
      section: 'Manajemen',
      items: [
        { path: '/staff', label: 'Admin Area', icon: ShieldCheck },
        { path: '/users', label: 'Data Pengguna', icon: Users },
      ],
    }] : []),
    {
      section: 'Akun',
      items: [
        { path: '/profile', label: 'Profil', icon: UserCircle },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

  const handleNavClick = () => {
    setSearch?.('');
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

  return (
    <>
      {open && (
        <div onClick={onClose} className="sidebar-overlay" />
      )}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* Logo / Brand (Screenshot Style) */}
        <div className="sidebar-logo" style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 14,
              lineHeight: 1
            }}>P</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}>ParkFinder Admin</div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', paddingLeft: 32 }}>MANAGEMENT SUITE</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                  >
                    <span className="nav-item-icon"><Icon size={16} /></span>
                    <span className="nav-item-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer (Clean Logout Button only - Screenshot Style) */}
        <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', padding: '16px 10px' }}>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: 'var(--red)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: 'var(--radius)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <span className="nav-item-icon" style={{ color: 'var(--red)' }}><LogOut size={16} /></span>
            <span className="nav-item-label" style={{ fontWeight: 600 }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
