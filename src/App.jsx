import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { AppProvider, useApp } from './context/AppContext'
import AdminsPage from './pages/AdminsPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import ParkingsPage from './pages/ParkingsPage'
import ProfilePage from './pages/ProfilePage'
import StaffManagementPage from './pages/StaffManagementPage'
import UsersPage from './pages/UsersPage'
import './styles/index.css'

/* ── Admin Layout ──────────────────────────────────────────────────── */
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="admin-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}

/* ── Route Guards ──────────────────────────────────────────────────── */
function RequireAuth({ children }) {
  const { isLoggedIn } = useApp()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function RequireSuperAdmin({ children }) {
  const { isLoggedIn, isSuperAdmin } = useApp()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isSuperAdmin) return <Navigate to="/" replace />
  return children
}

/* ── Routes ────────────────────────────────────────────────────────── */
function AppRoutes() {
  const { isLoggedIn } = useApp()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        !isLoggedIn ? <LoginPage /> : <Navigate to="/" replace />
      } />

      {/* Shared routes (both superAdmin & admin) */}
      <Route path="/" element={<RequireAuth><AdminLayout><Dashboard /></AdminLayout></RequireAuth>} />
      <Route path="/parkings" element={<RequireAuth><AdminLayout><ParkingsPage /></AdminLayout></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><AdminLayout><ProfilePage /></AdminLayout></RequireAuth>} />
      <Route path="/staff" element={<RequireSuperAdmin><AdminLayout><AdminsPage /></AdminLayout></RequireSuperAdmin>} />
      <Route path="/users" element={<RequireSuperAdmin><AdminLayout><UsersPage /></AdminLayout></RequireSuperAdmin>} />

      {/* SuperAdmin-only routes */}
      <Route path="/admins" element={<RequireSuperAdmin><AdminLayout><Navigate to="/staff" replace /></AdminLayout></RequireSuperAdmin>} />

      {/* Fallback */}
      <Route path="*" element={
        <Navigate to={isLoggedIn ? '/' : '/login'} replace />
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
