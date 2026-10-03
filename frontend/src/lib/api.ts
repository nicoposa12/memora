import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Auth uses Bearer tokens (see interceptor below), not cookies
  withCredentials: false,
});

// Request interceptor to attach Bearer token if stored
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('memora_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred. Please try again.';

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/auth');

      if (!isAuthPage) {
        if (status === 401) {
          localStorage.removeItem('memora_token');
          localStorage.removeItem('memora_user');
          window.location.href = '/login?error=' + encodeURIComponent('This account session is no longer active. Please authenticate again.');
        } else if (status === 403 && message.toLowerCase().includes('suspended')) {
          localStorage.removeItem('memora_token');
          localStorage.removeItem('memora_user');
          window.location.href = '/login?error=' + encodeURIComponent('Your account has been suspended. Please contact support.');
        }
      }
    }
      
    return Promise.reject(new Error(message));
  }
);
