import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { redirect } from 'next/navigation';

import { handleApiError } from '../error/error-handler';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 100000,
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
       
      config.headers['x-custom-token'] = token;
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
    // Handle 401 errors with redirect logic
    if (error.response?.status === 401) {
      // Only redirect on 401 if we're not already on the auth endpoint
      if (!error.config?.url?.includes('/auth')) {
        redirect('/');
      }
      return Promise.reject(error);
    }

    // Don't show toast for certain endpoints where errors are handled manually
    const silentEndpoints = ['/auth', '/health'];
    const shouldShowToast = !silentEndpoints.some(endpoint =>
      error.config?.url?.includes(endpoint)
    );

    if (shouldShowToast) {
      // Show error toast for other errors (server errors, network errors, etc.)
      handleApiError(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance };
