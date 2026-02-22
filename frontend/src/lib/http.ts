
import axios from 'axios';

const TOKEN_KEY = 'auth_token';

let accessToken: string | null = localStorage.getItem(TOKEN_KEY);

const resolveApiUrl = (): string => {
  const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('redmecanica.cl')) {
    return '/api';
  }

  return envApiUrl || '/api';
};

export const setAuthToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const api = axios.create({
  baseURL: resolveApiUrl().replace(/\/$/, ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAuthToken(data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAuthToken(null);
        window.dispatchEvent(new CustomEvent('session-expired'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
