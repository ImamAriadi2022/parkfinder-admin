import {
  bookingService,
  parkingService,
  statsService,
  userService,
  scansService,
  swapsService,
} from './apiService';

// ─── Parking Data ──────────────────────────────────
export const getParkings = async () => {
  const res = await parkingService.getAll();
  const list = res.data || res.areas || res || [];
  return Array.isArray(list) ? list.map(p => ({
    id: p.id || p._id || '',
    name: p.name || 'Unknown Area',
    shortName: p.shortName || p.name || 'Unknown',
    address: p.address || p.location || '',
    occupancy: p.occupancy || (p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0),
    totalSlots: p.totalSlots || p.slot || 0,
    usedSlots: p.usedSlots || (p.totalSlots - p.availableSlots) || 0,
    distance: p.distance || '0.0 km',
    tag: p.availableSlots > 0 ? 'Tersedia' : 'Penuh',
    tagClass: p.availableSlots > 0 ? 'green' : 'red',
    floors: p.floors || ['L1'],
    lat: p.lat || 0,
    lng: p.lng || 0,
    googleMapsUrl: p.googleMapsUrl || ''
  })) : [];
};

export const getParkingById = async (parkingId) => {
  const res = await parkingService.getById(parkingId);
  const p = res.data || res;
  if (p) {
    return {
      id: p.id || p._id || '',
      name: p.name || 'Unknown Area',
      shortName: p.shortName || p.name || 'Unknown',
      address: p.address || p.location || '',
      occupancy: p.occupancy || (p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0),
      totalSlots: p.totalSlots || p.slot || 0,
      usedSlots: p.usedSlots || (p.totalSlots - p.availableSlots) || 0,
      distance: p.distance || '0.0 km',
      tag: p.availableSlots > 0 ? 'Tersedia' : 'Penuh',
      tagClass: p.availableSlots > 0 ? 'green' : 'red',
      floors: p.floors || ['L1'],
      lat: p.lat || 0,
      lng: p.lng || 0,
      googleMapsUrl: p.googleMapsUrl || ''
    };
  }
  return null;
};

// ─── User Data ─────────────────────────────────────
export const getUsers = async () => {
  const userRes = await userService.getAll();
  const userList = userRes.data?.users || userRes.users || userRes || [];
  const apiUsers = userList.map(u => ({
    id: u.userId || u.id,
    name: u.name || 'User',
    email: u.email || '',
    phone: u.phoneNumber || u.phone || '',
    plate: u.vehicles?.[0]?.plateNumber || u.plate || '—',
    platform: u.platform || 'mobile',
    totalBookings: u.totalBookings || 0,
    activeBookings: u.activeTicketId ? 1 : (u.activeBookings || 0),
    joinDate: u.createdAt || u.joinDate || '',
    lastActive: u.createdAt || u.lastActive || '',
    status: u.status || 'active',
  }));

  let apiBookings = [];
  try {
    const bookingsRes = await bookingService.list();
    apiBookings = bookingsRes.data || bookingsRes.reservations || bookingsRes || [];
  } catch (err) {
    console.warn('Failed to fetch bookings in getUsers:', err);
  }

  const registeredUserIds = new Set(apiUsers.map(u => String(u.id)));
  const guestMap = new Map();

  for (const b of apiBookings) {
    const userId = b.userId || b.user?.id || b.user?.userId;
    if (!userId || !registeredUserIds.has(String(userId))) {
      const guestId = b.ticketId || b.userId || b.id || `${b.name || 'Tamu'}-${b.plateNumber || '—'}`;
      const name = b.name || b.userName || 'Tamu';
      const phone = b.phone || b.userPhone || '—';
      const plate = b.plateNumber || b.plate || '—';
      const createdAt = b.createdAt || '';
      const isActive = b.status === 'active';

      if (!guestMap.has(guestId)) {
        guestMap.set(guestId, {
          id: guestId,
          name: name,
          email: '—',
          phone: phone,
          plate: plate,
          platform: 'web',
          totalBookings: 0,
          activeBookings: 0,
          joinDate: createdAt,
          lastActive: createdAt,
          status: 'active',
        });
      }

      const guest = guestMap.get(guestId);
      guest.totalBookings += 1;
      if (isActive) {
        guest.activeBookings += 1;
      }
      if (createdAt && (!guest.joinDate || new Date(createdAt) < new Date(guest.joinDate))) {
        guest.joinDate = createdAt;
      }
      if (createdAt && (!guest.lastActive || new Date(createdAt) > new Date(guest.lastActive))) {
        guest.lastActive = createdAt;
      }
    }
  }

  const mappedGuestUsers = Array.from(guestMap.values()).map(g => ({
    ...g,
    status: g.activeBookings > 0 ? 'active' : 'inactive'
  }));

  return [...apiUsers, ...mappedGuestUsers];
};

export const getUserById = async (userId) => {
  try {
    const res = await userService.getById(userId);
    const u = res.data || res;
    if (u) {
      return {
        id: u.userId || u.id,
        name: u.name || 'User',
        email: u.email || '',
        phone: u.phoneNumber || u.phone || '',
        plate: u.vehicles?.[0]?.plateNumber || u.plate || '—',
        platform: u.platform || 'mobile',
        totalBookings: u.totalBookings || 0,
        activeBookings: u.activeTicketId ? 1 : (u.activeBookings || 0),
        joinDate: u.createdAt || u.joinDate || '',
        lastActive: u.createdAt || u.lastActive || '',
        status: u.status || 'active',
      };
    }
  } catch (error) {
    console.warn('User API failed or user is a guest, checking reservations:', error);
  }

  try {
    const bookingsRes = await bookingService.list();
    const list = bookingsRes.data || bookingsRes.reservations || bookingsRes || [];
    const guestBookings = list.filter(b => {
      const guestId = b.ticketId || b.userId || b.id || `${b.name || 'Tamu'}-${b.plateNumber || '—'}`;
      return String(guestId) === String(userId);
    });

    if (guestBookings.length > 0) {
      const first = guestBookings[0];
      const name = first.name || first.userName || 'Tamu';
      const phone = first.phone || first.userPhone || '—';
      const plate = first.plateNumber || first.plate || '—';
      
      let activeBookings = 0;
      let joinDate = '';
      let lastActive = '';
      
      for (const b of guestBookings) {
        if (b.status === 'active') activeBookings++;
        const createdAt = b.createdAt || '';
        if (createdAt && (!joinDate || new Date(createdAt) < new Date(joinDate))) {
          joinDate = createdAt;
        }
        if (createdAt && (!lastActive || new Date(createdAt) > new Date(lastActive))) {
          lastActive = createdAt;
        }
      }

      return {
        id: userId,
        name: name,
        email: '—',
        phone: phone,
        plate: plate,
        platform: 'web',
        totalBookings: guestBookings.length,
        activeBookings: activeBookings,
        joinDate: joinDate,
        lastActive: lastActive,
        status: activeBookings > 0 ? 'active' : 'inactive',
      };
    }
  } catch (err) {
    console.warn('Failed to find guest user in reservations:', err);
  }
  return null;
};

// ─── Dashboard Stats ──────────────────────────────
export const getDashboardStats = async () => {
  const res = await statsService.getDashboardStats();
  return res.data || res;
};

export const getBookingStats = async (days = 7) => {
  const res = await statsService.getBookingStats(days);
  return res.data || res;
};

export const getScanStats = async () => {
  const res = await statsService.getScanStats();
  return res.data || res;
};

export const getOccupancyData = async () => {
  const parkings = await parkingService.getAll();
  const list = parkings.data || parkings.areas || parkings || [];
  return list.map(p => ({ 
    name: p.shortName || p.name || '—', 
    value: p.occupancy || (p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0)
  }));
};

export const getPlatformData = async () => {
  const analytics = await statsService.getAnalytics('today');
  const data = analytics.data || analytics;
  return data.platformBreakdown;
};

// ─── Booking Data ─────────────────────────────────
export const getBookings = async (query = '') => {
  const q = typeof query === 'string' ? query : '';
  const res = await bookingService.list(q);
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

// ─── Scan Data ─────────────────────────────────────
export const getScans = async () => {
  const res = await scansService.getAll();
  return res.data || res.scans || res || [];
};

// ─── Swap Data ─────────────────────────────────────
export const getSwaps = async () => {
  const res = await swapsService.getAll();
  return res.data || res.swaps || res || [];
};

export default {
  getParkings,
  getParkingById,
  getUsers,
  getUserById,
  getDashboardStats,
  getBookingStats,
  getScanStats,
  getOccupancyData,
  getPlatformData,
  getBookings,
  getScans,
  getSwaps,
};
