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
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;