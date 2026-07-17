import { fetchAPI } from '../../../core/api/apiClient';

export const slotService = {
  add: (areaId, floor, slotName, sensorId) =>
    fetchAPI('POST', '/areas/slots', { areaId, floor, slotName, sensorId }),

  update: (slotId, data) =>
    fetchAPI('PUT', `/areas/slots/${slotId}`, typeof data === 'string' ? { appStatus: data } : data),

  delete: (slotId) =>
    fetchAPI('DELETE', `/areas/slots/${slotId}`),
  
  getById: (slotId) =>
    fetchAPI('GET', `/areas/slots/${slotId}`),
  
  getByArea: (areaId) =>
    fetchAPI('GET', `/areas/${areaId}/slots`),
};
