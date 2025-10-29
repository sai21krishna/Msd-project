import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_BACKEND_BASEURL || 'http://localhost:5001/api';

// Debug: Log the API base URL
console.log('🔧 API Configuration:');
console.log('  REACT_APP_BACKEND_BASEURL from env:', process.env.REACT_APP_BACKEND_BASEURL);
console.log('  Final API_BASE_URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Debug: Log the full request URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log('   Request data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('   Error data:', error.response.data);
    } else if (error.request) {
      console.error(`❌ Network Error: No response received for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('   Error:', error.message);
    } else {
      console.error('❌ Request Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      await apiClient.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify email');
    }
  },

  // Logout (optional - mainly for server-side token invalidation)
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout - we'll clear local storage anyway
      console.warn('Logout API call failed:', error.message);
    }
  },
};

// Utility functions
export const tokenUtils = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem('token');
  },

  // Decode JWT token (without verification)
  decodeToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = tokenUtils.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
};

// Export the configured axios instance for other API calls
export default apiClient;