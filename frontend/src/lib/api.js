import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
