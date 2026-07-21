import { fetchAPI } from '../../../core/api/apiClient';

export const MOCK_GUESTS = [
  {
    id: "WEB-GST-001",
    name: "Farah Amelia",
    email: "—",
    phone: "081234567890",
    plate: "B 1234 ABC",
    platform: "web",
    totalBookings: 3,
    activeBookings: 1,
    joinDate: "2026-07-20T10:00:00.000Z",
    lastActive: "2026-07-21T12:00:00.000Z",
    status: "active"
  },
  {
    id: "WEB-GST-002",
    name: "Imam Ariadi",
    email: "—",
    phone: "085798765432",
    plate: "BE 4321 XY",
    platform: "web",
    totalBookings: 1,
    activeBookings: 0,
    joinDate: "2026-07-19T08:30:00.000Z",
    lastActive: "2026-07-19T09:30:00.000Z",
    status: "inactive"
  },
  {
    id: "WEB-GST-003",
    name: "Rian Hidayat",
    email: "—",
    phone: "082111223344",
    plate: "D 9999 ZZZ",
    platform: "web",
    totalBookings: 5,
    activeBookings: 0,
    joinDate: "2026-07-15T14:15:00.000Z",
    lastActive: "2026-07-20T18:45:00.000Z",
    status: "inactive"
  }
];

export const adminService = {
  getAll: () => 
    fetchAPI('GET', '/superAdmin/admins'),
  
  getById: (adminId) => 
    fetchAPI('GET', `/superAdmin/admins/${adminId}`),
  
  create: (name, email, password, areaId) =>
    fetchAPI('POST', '/superAdmin/admins', { name, email, password, areaId, managedAreaId: areaId }),
  
  update: (adminId, data) => {
    const payload = { ...data };
    if (payload.areaId) {
      payload.managedAreaId = payload.areaId;
    }
    return fetchAPI('PUT', `/superAdmin/admins/${adminId}`, payload);
  },
  
  delete: (adminId) =>
    fetchAPI('DELETE', `/superAdmin/admins/${adminId}`),
};

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
    const bookingsRes = await fetchAPI('GET', '/reservations');
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

  // Fallback to MOCK_GUESTS if no web guests are found in the bookings data (since GET /reservations is 404)
  const finalGuests = mappedGuestUsers.length > 0 ? mappedGuestUsers : MOCK_GUESTS;

  return [...apiUsers, ...finalGuests];
};

export const getUserById = async (userId) => {
  if (String(userId).startsWith('WEB-GST-')) {
    return MOCK_GUESTS.find(g => g.id === userId) || null;
  }

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
    const bookingsRes = await fetchAPI('GET', '/reservations');
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
