import { fetchAPI } from '../../../core/api/apiClient';

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
