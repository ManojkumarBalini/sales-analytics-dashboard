import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running');
      alert('Backend server is not running. Please make sure the backend is started on port 5000.');
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

export default api;