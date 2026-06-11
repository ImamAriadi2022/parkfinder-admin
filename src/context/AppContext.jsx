import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/apiService'

const AppContext = createContext()

const normalizeRole = (roleValue) => {
  const raw = String(roleValue || '').trim().toLowerCase()
  if (raw === 'superadmin' || raw === 'super_admin' || raw === 'super-admin') return 'superAdmin'
  if (raw === 'admin') return 'admin'
  if (raw === 'staff') return 'staff'
  return roleValue || 'admin'
}

const pickFirst = (...values) => values.find((v) => v !== undefined && v !== null && v !== '')

const buildUserFromLogin = (responseData, fallbackEmail) => {
  const source = responseData || {}
  const rawUser =
    source.user ||
    source.account ||
    source.admin ||
    source.data?.user ||
    source.data?.account ||
    { email: fallbackEmail }

  const role = normalizeRole(
    pickFirst(
      rawUser.role,
      rawUser.userRole,
      source.role,
      source.data?.role,
      source.userRole,
    ),
  )

  const areaId = pickFirst(
    rawUser.managedAreaId,
    rawUser.areaId,
    rawUser.parkingId,
    rawUser.assignedAreaId,
    rawUser.adminAreaId,
    rawUser.area?.id,
    rawUser.parking?.id,
    source.managedAreaId,
    source.areaId,
    source.parkingId,
    source.assignedAreaId,
    source.adminAreaId,
    source.area?.id,
    source.parking?.id,
    source.data?.managedAreaId,
    source.data?.areaId,
    source.data?.parkingId,
    source.data?.assignedAreaId,
    source.data?.adminAreaId,
    source.data?.area?.id,
    source.data?.parking?.id,
  )

  const parkingName = pickFirst(
    rawUser.parkingName,
    rawUser.areaName,
    rawUser.assignedAreaName,
    rawUser.area?.name,
    rawUser.parking?.name,
    source.parkingName,
    source.areaName,
    source.assignedAreaName,
    source.area?.name,
    source.parking?.name,
    source.data?.parkingName,
    source.data?.areaName,
    source.data?.assignedAreaName,
    source.data?.area?.name,
    source.data?.parking?.name,
  )

  return {
    ...rawUser,
    email: rawUser.email || fallbackEmail,
    role,
    areaId,
    parkingId: areaId,
    assignedAreaId: areaId,
    parkingName,
  }
}

const detectIsSuperAdmin = (userValue) => {
  if (!userValue) return false

  const roleCandidates = [
    userValue.role,
    userValue.userRole,
    userValue.type,
    userValue.userType,
    userValue?.data?.role,
  ]

  const hasSuperRole = roleCandidates.some((r) => {
    const normalized = normalizeRole(r)
    return normalized === 'superAdmin'
  })

  if (hasSuperRole) return true

  // Fallback for inconsistent API role payloads.
  const email = String(userValue.email || '').toLowerCase()
  const name = String(userValue.name || '').toLowerCase()
  if (email === 'super@parkfinder.id') return true
  if (name.includes('super admin')) return true

  return false
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pf_user')) || null } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('pf_token') || null)
  const [theme, setTheme] = useState(() => localStorage.getItem('pf_theme') || 'dark')

  const clearSession = () => {
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_user')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    if (!token) return

    const looksLikeJwt = token.split('.').length === 3
    if (token.startsWith('demo-') || !looksLikeJwt) {
      clearSession()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pf_theme', theme)
  }, [theme])

  const isLoggedIn = !!user && !!token
  // superAdmin = highest privileged dashboard account
  const isSuperAdmin = detectIsSuperAdmin(user)
  // admin = staff/admin parkir
  const isAdmin = normalizeRole(user?.role) === 'admin'

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password)
      const data = res.data || res
      const t = data.token || data.accessToken || data.jwt || null
      const u = buildUserFromLogin(data, email)

      if (!t) {
        return { ok: false, msg: 'Token tidak ditemukan di respons login.' }
      }
      
      localStorage.setItem('pf_token', t)
      localStorage.setItem('pf_user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      return { ok: true, user: u }
    } catch (err) {
      return { ok: false, msg: err.message || 'Login gagal' }
    }
  }

  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes toastIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    return () => {
      try { document.head.removeChild(style) } catch (e) { /* ignore */ }
    }
  }, [])

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    clearSession()
  }

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <AppContext.Provider value={{
      user, token, isLoggedIn, isSuperAdmin, isAdmin,
      login, logout,
      theme, toggleTheme,
      toast,
    }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </div>
    </AppContext.Provider>
  )
}

function Toast({ message, type, onClose }) {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }
  
  const borderColors = {
    success: 'var(--green)',
    error: 'var(--red)',
    info: 'var(--blue)',
    warning: 'var(--orange)',
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${borderColors[type] || 'var(--accent)'}`,
      borderRadius: 12,
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      minWidth: 280,
      maxWidth: 360,
      backdropFilter: 'blur(12px)',
      animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>{icons[type]}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{message}</span>
      </div>
      <button onClick={onClose} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text3)',
        fontSize: 14,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
      >
        ✕
      </button>
    </div>
  )
}

export const useApp = () => useContext(AppContext)
