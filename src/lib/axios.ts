import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { redirect } from 'next/navigation';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the auth token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;

    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        token = state.token;
      } catch (e) {
        console.error('Error parsing auth storage:', e);
      }
    }

    // If we have a token, add it to the request headers
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect on 401 if we're not already on the auth endpoint
      if (!error.config?.url?.includes('/auth')) {
        redirect('/');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
