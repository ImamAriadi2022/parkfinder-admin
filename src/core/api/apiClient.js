// API client configuration and fetch wrapper
const API_BASE_URL = 'https://backend-api-services-173368161554.asia-southeast2.run.app';

const getToken = () => localStorage.getItem('pf_token');

export const fetchAPI = async (method, endpoint, body = null) => {
  const headers = {};

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
};
