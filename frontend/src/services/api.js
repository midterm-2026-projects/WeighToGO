const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    login: (role, email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ role, email, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    session: () => request('/auth/session'),
  },
  children: {
    list: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/children${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/children/${id}`),
    create: (data) => request('/children', { method: 'POST', body: JSON.stringify(data) }),
    assess: (id, data) => request(`/children/${id}/assessment`, { method: 'PUT', body: JSON.stringify(data) }),
    history: (id) => request(`/children/${id}/history`),
    checkup: (id, status) => request(`/children/${id}/checkup`, { method: 'PUT', body: JSON.stringify({ checkup_status: status }) }),
    filters: () => request('/children/filters'),
    totals: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/children/totals${query ? `?${query}` : ''}`);
    },
  },
  reports: {
    monthly: (month, year) => request(`/reports/monthly?month=${month}&year=${year}`),
    health: () => request('/reports/health'),
    masterlist: () => request('/reports/masterlist'),
  },
  analytics: {
    trendline: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/analytics/trendline${query ? `?${query}` : ''}`);
    },
    trendlineFilters: () => request('/analytics/trendline/filters'),
    barGraph: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/analytics/bar-graph${query ? `?${query}` : ''}`);
    },
    barGraphFilters: () => request('/analytics/bar-graph/filters'),
    map: () => request('/analytics/map'),
    barangay: (name) => request(`/analytics/barangay/${encodeURIComponent(name)}`),
  },
};
