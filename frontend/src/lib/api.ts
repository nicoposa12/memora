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
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred. Please try again.';
      
    return Promise.reject(new Error(message));
  }
);
