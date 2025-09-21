import axios from 'axios';

// Use environment variable or fallback to your Render backend URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://sales-analytics-dashboard-0x4w.onrender.com/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for Render's free tier
});

// Add a request interceptor to handle errors
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running');
    } else if (error.response?.status === 0) {
      console.error('Network error or CORS issue');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

// Generate analytics report
export const generateReport = (dateRange) => {
  return api.post('/analytics/generate', dateRange);
};

// Get all analytics reports
export const getReports = () => {
  return api.get('/analytics/reports');
};

// Get specific report by ID
export const getReportById = (id) => {
  return api.get(`/analytics/reports/${id}`);
};

// Health check
export const healthCheck = () => {
  return api.get('/health');
};

export default api;
