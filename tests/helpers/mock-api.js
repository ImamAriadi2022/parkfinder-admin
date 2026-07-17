/**
 * Helper to setup Mock API endpoints for all E2E tests
 */
export async function setupMockAPI(page) {
  // In-memory data structures per test session
  const areas = [
    {
      id: "area-1",
      name: "RSUD Abdul Moeloek",
      shortName: "RSUD AM",
      address: "Jl. Penjajaran No. 2, Bandar Lampung",
      location: "Jl. Penjajaran No. 2, Bandar Lampung",
      totalFloors: 2,
      totalSlots: 10,
      availableSlots: 6,
      occupancy: 40,
      floors: ["L1", "L2"],
      lat: -5.401,
      lng: 105.258,
      contactEmail: "rsud@parkfinder.id",
      isActive: true
    },
    {
      id: "area-2",
      name: "Stasiun Tanjung Karang",
      shortName: "Stasiun TK",
      address: "Jl. Kotabumi No. 10, Bandar Lampung",
      location: "Jl. Kotabumi No. 10, Bandar Lampung",
      totalFloors: 1,
      totalSlots: 5,
      availableSlots: 2,
      occupancy: 60,
      floors: ["L1"],
      lat: -5.412,
      lng: 105.262,
      contactEmail: "stasiun@parkfinder.id",
      isActive: true
    }
  ];

  const slots = {
    "area-1": [
      { id: "slot-1-1", floor: 1, slotName: "A-01", sensorId: "SENSOR-AREA1-1-A01", status: "available" },
      { id: "slot-1-2", floor: 1, slotName: "A-02", sensorId: "SENSOR-AREA1-1-A02", status: "occupied" },
      { id: "slot-1-3", floor: 2, slotName: "B-01", sensorId: "SENSOR-AREA1-2-B01", status: "available" }
    ],
    "area-2": [
      { id: "slot-2-1", floor: 1, slotName: "A-01", sensorId: "SENSOR-AREA2-1-A01", status: "available" },
      { id: "slot-2-2", floor: 1, slotName: "A-02", sensorId: "SENSOR-AREA2-1-A02", status: "occupied" }
    ]
  };

  const staffList = [
    {
      id: "staff-1",
      name: "Farah Amelia",
      email: "farah@parkfinder.id",
      phone: "081277778888",
      parkingId: "area-1",
      parkingName: "RSUD Abdul Moeloek",
      shifts: "Pagi"
    },
    {
      id: "staff-2",
      name: "Riko Wijaya",
      email: "riko@parkfinder.id",
      phone: "081399990000",
      parkingId: "area-2",
      parkingName: "Stasiun Tanjung Karang",
      shifts: "Siang"
    }
  ];

  const admins = [
    {
      id: "admin-1",
      name: "Super Admin ParkFinder",
      email: "super@parkfinder.id",
      role: "superAdmin",
      managedAreaId: null,
      parkingName: null
    }
  ];

  const users = [
    {
      userId: "user-1",
      name: "Budi Santoso",
      email: "budi@gmail.com",
      phoneNumber: "081234567890",
      vehicles: [{ plateNumber: "BE 1234 AB" }],
      platform: "mobile",
      totalBookings: 15,
      activeTicketId: "res-1",
      createdAt: "2026-01-15T00:00:00.000Z",
      status: "active"
    },
    {
      userId: "user-2",
      name: "Siti Aminah",
      email: "siti@gmail.com",
      phoneNumber: "081987654321",
      vehicles: [{ plateNumber: "BE 5678 CD" }],
      platform: "mobile",
      totalBookings: 4,
      activeTicketId: null,
      createdAt: "2026-03-10T00:00:00.000Z",
      status: "active"
    }
  ];

  const reservations = [
    {
      id: "res-1",
      userId: "user-1",
      userName: "Budi Santoso",
      userPhone: "081234567890",
      plate: "BE 1234 AB",
      parkingId: "area-1",
      parkingName: "RSUD Abdul Moeloek",
      floor: "L1",
      slotName: "A-02",
      status: "active",
      createdAt: "2026-07-17T08:00:00.000Z",
      duration: "2 jam",
      scanTime: "2026-07-17T08:05:00.000Z",
      exitTime: null
    },
    {
      id: "res-2",
      userId: "user-2",
      userName: "Siti Aminah",
      userPhone: "081987654321",
      plate: "BE 5678 CD",
      parkingId: "area-2",
      parkingName: "Stasiun Tanjung Karang",
      floor: "L1",
      slotName: "A-02",
      status: "completed",
      createdAt: "2026-07-17T09:00:00.000Z",
      duration: "1 jam",
      scanTime: "2026-07-17T09:02:00.000Z",
      exitTime: "2026-07-17T10:00:00.000Z"
    }
  ];

  const scans = [
    {
      id: "scan-1",
      plateNumber: "BE 1234 AB",
      name: "Budi Santoso",
      time: "2026-07-17T08:05:00.000Z",
      action: "Masuk",
      status: "success",
      parking: "RSUD Abdul Moeloek"
    },
    {
      id: "scan-2",
      plateNumber: "BE 9999 XX",
      name: "Tamu Tanpa Izin",
      time: "2026-07-17T08:10:00.000Z",
      action: "Masuk",
      status: "failed",
      parking: "Stasiun Tanjung Karang"
    }
  ];

  const swaps = [
    {
      id: "swap-1",
      requesterName: "Rian Hidayat",
      targetName: "Ahmad Dani",
      slotFrom: "A-02",
      slotTo: "A-05",
      status: "approved",
      time: "2026-07-17T08:30:00.000Z",
      fromParking: "RSUD Abdul Moeloek",
      toParking: "RSUD Abdul Moeloek"
    }
  ];

  // Enable request interception for auth login
  await page.route('**/auth/login', async (route) => {
    const postData = JSON.parse(route.request().postData());
    const { email, password } = postData;

    if (!email || !password) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Email dan password wajib diisi" })
      });
      return;
    }

    if (email === 'super@parkfinder.id') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiZW1haWwiOiJzdXBlckBwYXJrZmluZGVyLmlkIn0.signature",
          user: {
            id: "admin-1",
            name: "Super Admin ParkFinder",
            email: "super@parkfinder.id",
            role: "superAdmin",
            managedAreaId: null,
            parkingName: null
          }
        })
      });
    } else if (email === 'staff@parkfinder.id') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGFmZiIsImVtYWlsIjoic3RhZmZAcGFya2ZpbmRlci5pZCJ9.signature",
          user: {
            id: "staff-1",
            name: "Farah Amelia",
            email: "staff@parkfinder.id",
            role: "staff",
            managedAreaId: "area-1",
            parkingName: "RSUD Abdul Moeloek"
          }
        })
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Email atau password salah" })
      });
    }
  });

  await page.route('**/auth/logout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true })
    });
  });

  // Catch-all route for any URL containing '/areas' (regex handles /areas and /areas/something)
  await page.route(/\/areas(\/|$)/, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // 1. Get slots for specific area: /areas/<areaId>/slots
    const slotsMatch = url.match(/\/areas\/([^/]+)\/slots/);
    if (slotsMatch) {
      const areaId = slotsMatch[1];
      const areaSlots = slots[areaId] || [];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: areaSlots })
      });
      return;
    }

    // 2. Specific slot actions: /areas/slots/<slotId>
    if (url.includes('/areas/slots/')) {
      const parts = url.split('/');
      const slotId = parts[parts.length - 1];

      let foundAreaId = null;
      let foundSlotIndex = -1;
      for (const [aId, sList] of Object.entries(slots)) {
        const idx = sList.findIndex(s => s.id === slotId);
        if (idx !== -1) {
          foundAreaId = aId;
          foundSlotIndex = idx;
          break;
        }
      }

      if (method === 'PUT') {
        const postData = JSON.parse(route.request().postData());
        let updatedSlot = null;
        if (foundAreaId !== null && foundSlotIndex !== -1) {
          const slot = slots[foundAreaId][foundSlotIndex];
          if (typeof postData === 'string') {
            slot.status = postData;
          } else if (postData.appStatus) {
            slot.status = postData.appStatus;
          }
          if (postData.slotName) slot.slotName = postData.slotName;
          if (postData.floor) slot.floor = postData.floor;
          updatedSlot = slot;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: updatedSlot })
        });
      } else if (method === 'DELETE') {
        if (foundAreaId !== null && foundSlotIndex !== -1) {
          slots[foundAreaId].splice(foundSlotIndex, 1);
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: "Slot deleted successfully" })
        });
      }
      return;
    }

    // 3. Add slot: POST /areas/slots
    if (url.includes('/areas/slots') && !url.includes('/slots/') && method === 'POST') {
      const postData = JSON.parse(route.request().postData());
      const { areaId, floor, slotName, sensorId } = postData;
      if (!slots[areaId]) {
        slots[areaId] = [];
      }
      const newSlot = {
        id: `slot-${areaId}-${slots[areaId].length + 1}`,
        floor,
        slotName,
        sensorId,
        status: "available"
      };
      slots[areaId].push(newSlot);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: newSlot })
      });
      return;
    }

    // 4. Specific area GET/PUT/DELETE: /areas/<areaId>
    if (!url.endsWith('/areas') && !url.includes('/areas?')) {
      const parts = url.split('/');
      const areaId = parts[parts.length - 1];

      if (method === 'PUT') {
        const postData = JSON.parse(route.request().postData());
        const area = areas.find(a => a.id === areaId);
        if (area) {
          area.name = postData.name;
          area.address = postData.address;
          area.location = postData.address;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: area })
        });
      } else if (method === 'DELETE') {
        const index = areas.findIndex(a => a.id === areaId);
        if (index !== -1) {
          areas.splice(index, 1);
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: "Area deleted successfully" })
        });
      } else if (method === 'GET') {
        const area = areas.find(a => a.id === areaId);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: area })
        });
      }
      return;
    }

    // 5. General GET/POST /areas
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: areas })
      });
    } else if (method === 'POST') {
      const postData = JSON.parse(route.request().postData());
      const newArea = {
        id: `area-${areas.length + 1}`,
        name: postData.name,
        shortName: postData.name.substring(0, 7),
        address: postData.address,
        location: postData.address,
        totalFloors: postData.totalFloors,
        totalSlots: 0,
        availableSlots: 0,
        occupancy: 0,
        floors: Array.from({ length: postData.totalFloors }, (_, i) => `L${i + 1}`),
        lat: 0,
        lng: 0,
        contactEmail: postData.contactEmail,
        isActive: postData.isActive
      };
      areas.push(newArea);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: newArea })
      });
    }
  });

  // Catch-all route for any URL containing '/staff'
  await page.route(/\/staff(\/|$)/, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // 1. Staff password change: /staff/<staffId>/password
    if (url.endsWith('/password')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Password updated successfully" })
      });
      return;
    }

    // 2. Specific staff actions: /staff/<staffId>
    if (!url.endsWith('/staff') && !url.includes('/staff?')) {
      const parts = url.split('/');
      const staffId = parts[parts.length - 1];

      if (method === 'PUT') {
        const postData = JSON.parse(route.request().postData());
        const staff = staffList.find(s => s.id === staffId);
        if (staff) {
          if (postData.name) staff.name = postData.name;
          if (postData.phone) staff.phone = postData.phone;
          if (postData.parkingId) {
            staff.parkingId = postData.parkingId;
            staff.parkingName = postData.parkingId === 'area-1' ? 'RSUD Abdul Moeloek' : 'Stasiun Tanjung Karang';
          }
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: staff })
        });
      } else if (method === 'DELETE') {
        const index = staffList.findIndex(s => s.id === staffId);
        if (index !== -1) {
          staffList.splice(index, 1);
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: "Staff deleted successfully" })
        });
      }
      return;
    }

    // 3. General GET/POST /staff
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: staffList })
      });
    } else if (method === 'POST') {
      const postData = JSON.parse(route.request().postData());
      const newStaff = {
        id: `staff-${staffList.length + 1}`,
        name: postData.name,
        email: postData.email,
        phone: postData.phone,
        parkingId: postData.parkingId,
        parkingName: postData.parkingId === 'area-1' ? 'RSUD Abdul Moeloek' : 'Stasiun Tanjung Karang',
        shifts: postData.shifts || 'Pagi'
      };
      staffList.push(newStaff);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: newStaff })
      });
    }
  });

  // Catch-all route for stats calls
  await page.route(/\/stats(\/|$)/, async (route) => {
    const url = route.request().url();

    if (url.includes('/stats/bookings')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            totalBookings: 120,
            growth: 12.5,
            dailyData: [
              { date: "11 Jul", count: 15 },
              { date: "12 Jul", count: 18 },
              { date: "13 Jul", count: 12 },
              { date: "14 Jul", count: 22 },
              { date: "15 Jul", count: 19 },
              { date: "16 Jul", count: 14 },
              { date: "17 Jul", count: 20 }
            ]
          }
        })
      });
    } else if (url.includes('/stats/scans')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            totalScans: 250,
            successCount: 240,
            failedCount: 10,
            successRate: 96
          }
        })
      });
    } else if (url.includes('/stats/analytics')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            platformBreakdown: [
              { name: "Mobile", value: 75 },
              { name: "Web (Tamu)", value: 25 }
            ]
          }
        })
      });
    }
  });

  // Basic setups
  await page.route('**/reservations', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: reservations })
    });
  });

  await page.route('**/scans', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: scans })
    });
  });

  await page.route('**/swaps', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: swaps })
    });
  });

  await page.route('**/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { users: users } })
    });
  });

  await page.route('**/superAdmin/admins', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: admins })
    });
  });
}
