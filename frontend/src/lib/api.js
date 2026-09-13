import axios from 'axios';

// Get base domain (e.g. 'https://anditourss.onrender.com')
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');

// Guarantee root domain without trailing /api
export const getBackendBaseUrl = () => {
  return rawUrl.replace(/\/api$/, '');
};

// Guarantee API_URL always ends with /api exactly once
export const API_URL = `${getBackendBaseUrl()}/api`;

export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = getBackendBaseUrl();
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 seconds timeout for multi-image uploads on Render
});

api.interceptors.request.use((config) => {
  let token = null;
  try {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (stored) {
      token = stored.token || stored.user?.token || null;
    }
  } catch (e) {}

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('user');
      } catch (e) {}
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;