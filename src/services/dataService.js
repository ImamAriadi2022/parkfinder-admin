// Data Service - Bridge between API and mock data
// Provides fallback to mock data while APIs are being implemented

import {
    BOOKING_CHART_DATA,
    BOOKINGS,
    HOURLY_SCAN_DATA,
    OCCUPANCY_DATA,
    PARKINGS,
    PLATFORM_DATA,
    SCAN_LOGS,
    STATS_OVERVIEW,
    SWAP_LOGS,
    USERS,
} from '../data/mockData';
import {
    bookingService,
    parkingService,
    statsService,
    userService,
} from './apiService';

// ─── Parking Data ──────────────────────────────────
export const getParkings = async (useAPI = false) => {
  if (useAPI) {
    try {
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
    } catch (error) {
      console.warn('Parking API failed, using mock data:', error);
    }
  }
  return PARKINGS;
};

export const getParkingById = async (parkingId, useAPI = false) => {
  if (useAPI) {
    try {
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
    } catch (error) {
      console.warn('Parking API failed, using mock data:', error);
    }
  }
  return PARKINGS.find(p => String(p.id) === String(parkingId));
};

// ─── User Data ─────────────────────────────────────
export const getUsers = async (useAPI = false) => {
  if (useAPI) {
    try {
      // 1. Ambil data user terdaftar dari API
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

      // 2. Ambil data seluruh reservasi dari API untuk memetakan tamu
      let apiBookings = [];
      try {
        const bookingsRes = await bookingService.list();
        apiBookings = bookingsRes.data || bookingsRes.reservations || bookingsRes || [];
      } catch (err) {
        console.warn('Failed to fetch bookings in getUsers:', err);
      }

      // Kumpulan ID user terdaftar untuk menyaring tamu
      const registeredUserIds = new Set(apiUsers.map(u => String(u.id)));

      // Saring reservasi milik tamu (tidak memiliki userId terdaftar)
      const guestReservations = apiBookings.filter(b => {
        const userId = b.userId || b.user?.id || b.user?.userId;
        return !userId || !registeredUserIds.has(String(userId));
      });

      // Kelompokkan reservasi tamu untuk membentuk objek user Tamu yang unik
      const guestMap = new Map();

      for (const b of guestReservations) {
        // Unique identifier: ticketId (guest session ID) atau plate atau name
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
            platform: 'web', // Platform web menunjukkan Tamu (guest)
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

      const mappedGuestUsers = Array.from(guestMap.values()).map(g => ({
        ...g,
        status: g.activeBookings > 0 ? 'active' : 'inactive'
      }));

      return [...apiUsers, ...mappedGuestUsers];
    } catch (error) {
      console.warn('User API failed, using mock data:', error);
    }
  }

  // Fallback ke data mock
  return USERS.map(u => {
    if (u.platform === 'web') {
      const matchBooking = BOOKINGS.find(b => b.userId === u.id);
      return {
        ...u,
        name: matchBooking ? matchBooking.userName : (u.name || 'Tamu'),
        phone: matchBooking ? matchBooking.userPhone : (u.phone || ''),
      };
    }
    return u;
  });
};

export const getUserById = async (userId, useAPI = false) => {
  if (useAPI) {
    try {
      // Coba cari di user terdaftar terlebih dahulu
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
      
      // Jika tidak ditemukan di table users, cari di data reservasi sebagai tamu
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
    }
  }

  // Fallback ke data mock
  const u = USERS.find(usr => usr.id === userId);
  if (u) {
    if (u.platform === 'web') {
      const matchBooking = BOOKINGS.find(b => b.userId === u.id);
      return {
        ...u,
        name: matchBooking ? matchBooking.userName : (u.name || 'Tamu'),
        phone: matchBooking ? matchBooking.userPhone : (u.phone || ''),
      };
    }
    return u;
  }
  return null;
};

// ─── Dashboard Stats ──────────────────────────────
export const getDashboardStats = async (useAPI = false) => {
  if (useAPI) {
    try {
      const res = await statsService.getDashboardStats();
      return res.data || res;
    } catch (error) {
      console.warn('Stats API failed, using mock data:', error);
    }
  }
  return STATS_OVERVIEW;
};

export const getBookingStats = async (days = 7, useAPI = false) => {
  if (useAPI) {
    try {
      const res = await statsService.getBookingStats(days);
      return res.data || res;
    } catch (error) {
      console.warn('Booking stats API failed, using mock data:', error);
    }
  }
  return BOOKING_CHART_DATA;
};

export const getScanStats = async (useAPI = false) => {
  if (useAPI) {
    try {
      const res = await statsService.getScanStats();
      return res.data || res;
    } catch (error) {
      console.warn('Scan stats API failed, using mock data:', error);
    }
  }
  return HOURLY_SCAN_DATA;
};

export const getOccupancyData = async (useAPI = false) => {
  if (useAPI) {
    try {
      const parkings = await parkingService.getAll();
      const list = parkings.data || parkings.areas || parkings || [];
      return list.map(p => ({ 
        name: p.shortName || p.name || '—', 
        value: p.occupancy || (p.totalSlots > 0 ? Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100) : 0)
      }));
    } catch (error) {
      console.warn('Occupancy API failed, using mock data:', error);
    }
  }
  return OCCUPANCY_DATA;
};

export const getPlatformData = async (useAPI = false) => {
  if (useAPI) {
    try {
      const analytics = await statsService.getAnalytics('today');
      const data = analytics.data || analytics;
      return data.platformBreakdown;
    } catch (error) {
      console.warn('Platform API failed, using mock data:', error);
    }
  }
  return PLATFORM_DATA;
};

// ─── Booking Data ─────────────────────────────────
export const getBookings = async (useAPI = false, query = '') => {
  if (useAPI) {
    try {
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
    } catch (error) {
      console.warn('Bookings API failed, using mock data:', error);
    }
  }
  return BOOKINGS;
};

// ─── Scan Data (currently in mock) ────────────────
export const getScans = () => SCAN_LOGS;

// ─── Swap Data (currently in mock) ────────────────
export const getSwaps = () => SWAP_LOGS;

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
