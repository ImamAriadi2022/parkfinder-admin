import { fetchAPI } from '../../../core/api/apiClient';

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
