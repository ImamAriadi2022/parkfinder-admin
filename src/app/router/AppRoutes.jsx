import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';
import { RequireAuth, RequireSuperAdmin } from './ProtectedRoute';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import StaffLayout from '../layouts/StaffLayout';

// Features / Pages
import LoginPage from '../../features/auth/pages/LoginPage';
import Dashboard from '../../features/dashboard/pages/Dashboard';
import StaffDashboard from '../../features/dashboard/pages/StaffDashboard';
import ParkingsPage from '../../features/parking-area/pages/ParkingsPage';
import ProfilePage from '../../features/profile/pages/ProfilePage';
import AdminsPage from '../../features/users/pages/AdminsPage';
import UsersPage from '../../features/users/pages/UsersPage';

import AnalyticsPage from '../../features/monitoring/pages/AnalyticsPage';
import BookingsPage from '../../features/monitoring/pages/BookingsPage';
import ScansPage from '../../features/monitoring/pages/ScansPage';
import SwapsPage from '../../features/monitoring/pages/SwapsPage';
import StaffManagementPage from '../../features/monitoring/pages/StaffManagementPage';
import SettingsPage from '../../features/profile/pages/SettingsPage';

export default function AppRoutes() {
  const { isLoggedIn, user } = useApp();
  const isStaff = user?.role === 'staff';

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={
        !isLoggedIn ? <LoginPage /> : <Navigate to="/" replace />
      } />

      {/* Shared routes (both superAdmin & admin) */}
      <Route path="/" element={
        <RequireAuth>
          {isStaff ? (
            <StaffLayout>
              <StaffDashboard />
            </StaffLayout>
          ) : (
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          )}
        </RequireAuth>
      } />
      
      <Route path="/parkings" element={
        <RequireAuth>
          {isStaff ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLayout>
              <ParkingsPage />
            </AdminLayout>
          )}
        </RequireAuth>
      } />
      
      <Route path="/profile" element={
        <RequireAuth>
          {isStaff ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLayout>
              <ProfilePage />
            </AdminLayout>
          )}
        </RequireAuth>
      } />

      <Route path="/bookings" element={
        <RequireAuth>
          {isStaff ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLayout>
              <BookingsPage />
            </AdminLayout>
          )}
        </RequireAuth>
      } />

      <Route path="/settings" element={
        <RequireAuth>
          {isStaff ? (
            <Navigate to="/" replace />
          ) : (
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          )}
        </RequireAuth>
      } />
      
      <Route path="/staff" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <AdminsPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />
      
      <Route path="/users" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      <Route path="/analytics" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <AnalyticsPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      <Route path="/scans" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <ScansPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      <Route path="/swaps" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <SwapsPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      <Route path="/staff-management" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <StaffManagementPage />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      {/* SuperAdmin-only routes */}
      <Route path="/admins" element={
        <RequireSuperAdmin>
          <AdminLayout>
            <Navigate to="/staff" replace />
          </AdminLayout>
        </RequireSuperAdmin>
      } />

      {/* Fallback */}
      <Route path="*" element={
        <Navigate to={isLoggedIn ? '/' : '/login'} replace />
      } />
    </Routes>
  );
}
