import { fetchAPI } from '../../../core/api/apiClient';

export const authService = {
  login: (email, password) => 
    fetchAPI('POST', '/auth/login', { email, password }),
  
  logout: () => 
    fetchAPI('POST', '/auth/logout'),
};
