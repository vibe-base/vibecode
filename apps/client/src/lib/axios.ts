import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/', // Base URL will be relative to the current domain
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // IMPORTANT: For development/testing, always use a hardcoded token
    // This ensures all requests have authentication
    const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2stdXNlci1pZCIsInVzZXJuYW1lIjoibW9ja191c2VyIiwiZW1haWwiOiJtb2NrQGV4YW1wbGUuY29tIiwiZnVsbF9uYW1lIjoiTW9jayBVc2VyIiwicHJvdmlkZXIiOiJtb2NrIn0.8J7ySQkLN6KuSEUzD7tHpQmEzWrs2d6SFbxuFxrCLQ4";

    // Try to get token from different possible localStorage keys
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      hardcodedToken;

    // Always set the Authorization header
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
