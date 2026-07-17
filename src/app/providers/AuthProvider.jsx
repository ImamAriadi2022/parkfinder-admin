import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../../features/auth/services/auth.service';

const AuthContext = createContext();

const normalizeRole = (roleValue) => {
  const raw = String(roleValue || '').trim().toLowerCase();
  if (raw === 'superadmin' || raw === 'super_admin' || raw === 'super-admin') return 'superAdmin';
  if (raw === 'admin') return 'admin';
  if (raw === 'staff') return 'staff';
  return roleValue || 'admin';
};

const pickFirst = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

const buildUserFromLogin = (responseData, fallbackEmail) => {
  const source = responseData || {};
  const rawUser =
    source.user ||
    source.account ||
    source.admin ||
    source.data?.user ||
    source.data?.account ||
    { email: fallbackEmail };

  const role = normalizeRole(
    pickFirst(
      rawUser.role,
      rawUser.userRole,
      source.role,
      source.data?.role,
      source.userRole,
    ),
  );

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
  );

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
  );

  return {
    ...rawUser,
    email: rawUser.email || fallbackEmail,
    role,
    areaId,
    parkingId: areaId,
    assignedAreaId: areaId,
    parkingName,
  };
};

const detectIsSuperAdmin = (userValue) => {
  if (!userValue) return false;

  const roleCandidates = [
    userValue.role,
    userValue.userRole,
    userValue.type,
    userValue.userType,
    userValue?.data?.role,
  ];

  const hasSuperRole = roleCandidates.some((r) => {
    const normalized = normalizeRole(r);
    return normalized === 'superAdmin';
  });

  if (hasSuperRole) return true;

  // Fallback for inconsistent API role payloads.
  const email = String(userValue.email || '').toLowerCase();
  const name = String(userValue.name || '').toLowerCase();
  if (email === 'super@parkfinder.id') return true;
  if (name.includes('super admin')) return true;

  return false;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pf_user')) || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pf_token') || null);
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('pf_profile_photo') || null);

  const clearSession = () => {
    localStorage.removeItem('pf_token');
    localStorage.removeItem('pf_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;

    const looksLikeJwt = token.split('.').length === 3;
    if (token.startsWith('demo-') || !looksLikeJwt) {
      clearSession();
    }
  }, []);

  const isLoggedIn = !!user && !!token;
  const isSuperAdmin = detectIsSuperAdmin(user);
  const isAdmin = normalizeRole(user?.role) === 'admin';

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const data = res.data || res;
      const t = data.token || data.accessToken || data.jwt || null;
      const u = buildUserFromLogin(data, email);

      if (!t) {
        return { ok: false, msg: 'Token tidak ditemukan di respons login.' };
      }
      
      localStorage.setItem('pf_token', t);
      localStorage.setItem('pf_user', JSON.stringify(u));
      setToken(t);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, msg: err.message || 'Login gagal' };
    }
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    clearSession();
  };

  const updateProfilePhoto = (photo) => {
    localStorage.setItem('pf_profile_photo', photo);
    setProfilePhoto(photo);
  };

  const removeProfilePhoto = () => {
    localStorage.removeItem('pf_profile_photo');
    setProfilePhoto(null);
  };

  const changeAdminPassword = (currentPassword, newPassword) => {
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoggedIn, isSuperAdmin, isAdmin, login, logout,
      profilePhoto, updateProfilePhoto, removeProfilePhoto, changeAdminPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
