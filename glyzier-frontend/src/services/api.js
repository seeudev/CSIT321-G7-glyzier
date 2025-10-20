/**
 * API Configuration - Axios Instance
 * 
 * This file creates and exports a pre-configured Axios instance for making
 * HTTP requests to the Glyzier backend API.
 * 
 * Key features:
 * - Base URL configured to point to the Spring Boot backend (http://localhost:8080)
 * - Request interceptor to automatically add JWT token to Authorization header
 * - Response interceptor for global error handling
 * - Timeout configuration
 * 
 * Usage:
 * import api from './services/api';
 * const response = await api.get('/products');
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import axios from 'axios';

/**
 * Base URL for the backend API
 * This should match the Spring Boot server's address and port
 * 
 * In production, this would be replaced with the actual deployed backend URL
 * (e.g., https://api.glyzier.com)
 */
const BASE_URL = 'http://localhost:8080';

/**
 * Create an Axios instance with pre-configured settings
 * 
 * This instance will be used throughout the application instead of
 * the default axios instance to ensure consistent configuration
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * This interceptor runs before every request is sent.
 * It automatically adds the JWT token to the Authorization header
 * if the token exists in localStorage.
 * 
 * This means we don't have to manually add the token to every request.
 */
api.interceptors.request.use(
  (config) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This interceptor runs after every response is received.
 * It handles global error cases like:
 * - 401 Unauthorized (token expired or invalid)
 * - 403 Forbidden (insufficient permissions)
 * - 500 Server errors
 * 
 * This provides centralized error handling logic.
 */
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // Handle different error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      switch (error.response.status) {
        case 401:
          // Unauthorized - token is invalid or expired
          // Clear the token and redirect to login
          console.error('Unauthorized - Please log in again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Don't redirect here - let the component handle it
          // to avoid infinite loops
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Forbidden - You do not have permission to access this resource');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error - Please try again later');
          break;
          
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    // Always reject the promise so the calling code can handle the error
    return Promise.reject(error);
  }
);

// Export the configured Axios instance as default
export default api;
