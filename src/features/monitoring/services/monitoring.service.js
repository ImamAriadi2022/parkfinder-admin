import { fetchAPI } from '../../../core/api/apiClient';

export const getBookingStats = async (days = 7) => {
  const res = await fetchAPI('GET', `/stats/bookings?days=${days}`);
  return res.data || res;
};

export const getScanStats = async () => {
  const res = await fetchAPI('GET', '/stats/scans');
  return res.data || res;
};

export const getOccupancyData = async () => {
  const parkings = await fetchAPI('GET', '/areas');
  const list = parkings.data || parkings.areas || parkings || [];
  return list.map(p => ({ 
    name: p.shortName || p.name || '—', 
    value: p.occupancy || (p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0)
  }));
};

export const getPlatformData = async () => {
  const analytics = await fetchAPI('GET', '/stats/analytics?period=today');
  const data = analytics.data || analytics;
  return data.platformBreakdown;
};

export const getBookings = async (query = '') => {
  const q = typeof query === 'string' ? query : '';
  const res = await fetchAPI('GET', `/reservations${q ? `?${q}` : ''}`);
  const list = res.data || res.reservations || res || [];
  
  return Array.isArray(list) ? list.map(b => ({
    id: b.id || b._id || b.ticketId || b.reservationId || '',
    userId: b.userId || b.user?.id || b.user?.userId || '',
    userName: b.userName || b.name || b.user?.name || 'Tamu',
    userPhone: b.userPhone || b.phone || b.user?.phoneNumber || b.user?.phone || '—',
    plate: b.plate || b.plateNumber || b.user?.vehicles?.[0]?.plateNumber || '—',
    parkingId: b.parkingId || b.areaId || b.area?.id || b.slot?.areaId || '',
    parkingName: b.parkingName || b.areaName || b.area?.name || b.slot?.area?.name || '—',
    floor: b.floor || b.slot?.floor || 'L1',
    slot: b.slotName || b.slot?.slotName || (typeof b.slot === 'string' ? b.slot : '') || '—',
    status: b.status || 'active',
    createdAt: b.createdAt || '',
    duration: b.duration || '—',
    scanTime: b.scanTime || null,
    exitTime: b.exitTime || null
  })) : [];
};

export const getScans = async () => {
  const res = await fetchAPI('GET', '/scans');
  return res.data || res.scans || res || [];
};

export const getSwaps = async () => {
  const res = await fetchAPI('GET', '/swaps');
  return res.data || res.swaps || res || [];
};

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
