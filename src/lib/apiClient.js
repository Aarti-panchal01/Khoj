const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let authToken = localStorage.getItem('khoj_token') || null;

const mapItem = (item) => ({
  ...item,
  id: item?._id || item?.id,
});

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('khoj_token', token);
  } else {
    localStorage.removeItem('khoj_token');
  }
};

const buildHeaders = (extra = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiRequest = async (path, { method = 'GET', body, headers, auth = true } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: auth ? buildHeaders(headers) : { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return response.json().catch(() => ({}));
};

export const AuthAPI = {
  signup: (payload) => apiRequest('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => apiRequest('/auth/me'),
};

export const ItemsAPI = {
  list: (params = {}) => {
    // Filter out undefined/null/empty values before building query string
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/items${query ? `?${query}` : ''}`).then(items => items.map(mapItem));
  },
  mine: () => apiRequest('/items/mine').then(items => items.map(mapItem)),
  getById: (id) => apiRequest(`/items/${id}`).then(mapItem),
  create: (payload) => apiRequest('/items', { method: 'POST', body: payload }).then(mapItem),
  update: (id, payload) => apiRequest(`/items/${id}`, { method: 'PUT', body: payload }).then(mapItem),
  remove: (id) => apiRequest(`/items/${id}`, { method: 'DELETE' }),
};

export const CampusAPI = {
  list: () => apiRequest('/campuses', { auth: false }),
};

export const UploadAPI = {
  uploadImages: async (files) => {
    const formData = new FormData();

    // Append each file to FormData
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const headers = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    // Don't set Content-Type - browser will set it with boundary for multipart/form-data

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || 'Upload failed');
      error.status = response.status;
      throw error;
    }

    return response.json();
  },
};
