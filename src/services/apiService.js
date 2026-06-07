// API Service for ParkFinder Admin Dashboard
// All API calls centralized here

// const API_BASE_URL = 'https://backend-api-services-291631508657.asia-southeast2.run.app';
const BASE_URL = 'https://backend-api-services-173368161554.asia-southeast2.run.app';

// Get token from localStorage
const getToken = () => localStorage.getItem('pf_token');

// Fetch wrapper with authorization
const fetchAPI = async (method, endpoint, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
};

// ─── Authentication ───────────────────────────────────────
export const authService = {
  login: (email, password) => 
    fetchAPI('POST', '/auth/login', { email, password }),
  
  logout: () => 
    fetchAPI('POST', '/auth/logout'),
};

// ─── SuperAdmin → Admin Management ──────────────────────────
export const adminService = {
  getAll: () => 
    fetchAPI('GET', '/superAdmin/admins'),
  
  getById: (adminId) => 
    fetchAPI('GET', `/superAdmin/admins/${adminId}`),
  
  create: (name, email, password, areaId) =>
    fetchAPI('POST', '/superAdmin/admins', { name, email, password, areaId }),
  
  update: (adminId, data) =>
    fetchAPI('PUT', `/superAdmin/admins/${adminId}`, data),
  
  delete: (adminId) =>
    fetchAPI('DELETE', `/superAdmin/admins/${adminId}`),
};

// ─── User Management ───────────────────────────────────────
export const userService = {
  getAll: () => 
    fetchAPI('GET', '/users'),
  
  getById: (userId) => 
    fetchAPI('GET', `/users/${userId}`),
  
  delete: (userId) =>
    fetchAPI('DELETE', `/users/${userId}`),
  
  getProfile: () =>
    fetchAPI('GET', '/users/profile'),
  
  updateProfile: (name, phoneNumber) =>
    fetchAPI('PUT', '/users/profile', { name, phoneNumber }),
};

// ─── Staff Management ───────────────────────────────────────
export const staffService = {
  getAll: () =>
    fetchAPI('GET', '/staff'),
  
  getById: (staffId) =>
    fetchAPI('GET', `/staff/${staffId}`),
  
  create: (name, email, password, phone, parkingId, shifts) =>
    fetchAPI('POST', '/staff', { name, email, password, phone, parkingId, shifts }),
  
  update: (staffId, data) =>
    fetchAPI('PUT', `/staff/${staffId}`, data),
  
  delete: (staffId) =>
    fetchAPI('DELETE', `/staff/${staffId}`),
  
  changePassword: (staffId, newPassword) =>
    fetchAPI('PUT', `/staff/${staffId}/password`, { newPassword }),
};

// ─── Parking Area Management ──────────────────────────────
export const parkingService = {
  getAll: () => 
    fetchAPI('GET', '/areas'),
  
  getById: (areaId) =>
    fetchAPI('GET', `/areas/${areaId}`),
  
  create: (name, address, totalFloors, contactEmail, isActive) =>
    fetchAPI('POST', '/areas', { name, address, totalFloors, contactEmail, isActive }),
  
  update: (areaId, name, address) =>
    fetchAPI('PUT', `/areas/${areaId}`, { name, address }),
  
  delete: (areaId) =>
    fetchAPI('DELETE', `/areas/${areaId}`),
};

// ─── Parking Slot Management ──────────────────────────────
export const slotService = {
  add: (areaId, floor, slotName, sensorId, status = 'available') =>
    fetchAPI('POST', '/areas/slots', { areaId, floor, slotName, sensorId, status }),

  // PUT /areas/slots/{slotId} — update slot status (super admin)
  // Body: { appStatus }
  update: (slotId, appStatus) =>
    fetchAPI('PUT', `/areas/slots/${slotId}`, { appStatus }),

  delete: (slotId) =>
    fetchAPI('DELETE', `/areas/slots/${slotId}`),
  
  getById: (slotId) =>
    fetchAPI('GET', `/areas/slots/${slotId}`),
  
  getByArea: (areaId) =>
    fetchAPI('GET', `/areas/${areaId}/slots`),
};

// ─── Statistics ───────────────────────────────────────────
export const statsService = {
  getDashboardStats: () =>
    fetchAPI('GET', '/stats/dashboard'),

  getBookingStats: (days = 7) =>
    fetchAPI('GET', `/stats/bookings?days=${days}`),

  getScanStats: () =>
    fetchAPI('GET', '/stats/scans'),

  getAnalytics: (period = 'week') =>
    fetchAPI('GET', `/stats/analytics?period=${period}`),
};

// ─── Booking / Reservation Service ───────────────────────
export const bookingService = {
  // Fetch all reservations (optionally filter by area/parking)
  list: (query = '') =>
    fetchAPI('GET', `/reservations${query ? `?${query}` : ''}`),

  getById: (reservationId) =>
    fetchAPI('GET', `/reservations/${reservationId}`),

  // Update reservation status (arrive/complete/cancel) - generic PATCH
  patch: (reservationId, data) =>
    fetchAPI('PATCH', `/reservations/${reservationId}`, data),
};
