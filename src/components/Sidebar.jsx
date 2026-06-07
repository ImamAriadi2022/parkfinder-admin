import {
    Car,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    UserCircle,
    UserCog,
    Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const LOGO_URL = 'https://storage.googleapis.com/parkfinderbucket/foto/logo.png'

export default function Sidebar({ open, onClose }) {
  const { user, logout, isSuperAdmin } = useApp()
  const navigate = useNavigate()

  // Build nav items based on role
  const NAV_ITEMS = [
    {
      section: 'Utama',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/parkings', label: 'Gedung Parkir', icon: Car },
      ],
    },
    // SuperAdmin-only section
    ...(isSuperAdmin ? [{
      section: 'Manajemen',
      items: [
        { path: '/staff', label: 'Staff Parkir', icon: ShieldCheck },
        { path: '/users', label: 'Data Pengguna', icon: Users },
      ],
    }] : []),
    {
      section: 'Akun',
      items: [
        { path: '/profile', label: 'Profil', icon: UserCircle },
      ],
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    onClose?.()
  }

  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 99 }} />
      )}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src={LOGO_URL}
            alt="ParkFinder"
            style={{ height: 36, width: 'auto', objectFit: 'contain', maxWidth: 140 }}
            onError={e => { e.target.style.display = 'none' }}
          />
          <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginTop: 2, letterSpacing: '0.5px' }}>
            {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN PARKIR'}
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="nav-item-icon"><Icon size={16} /></span>
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius)',
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
          }}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isSuperAdmin ? 'Super Admin' : 'Admin Parkir'}
              </div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
              display: 'flex', padding: 4, borderRadius: 6, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
