/**
 * AuthService - Authentication Service Module
 * 
 * This service handles all authentication-related API calls to the backend.
 * It provides functions for user login and registration.
 * 
 * Key functions:
 * - login(email, password): Authenticates a user and returns JWT token
 * - register(displayname, email, password): Creates a new user account
 * 
 * The JWT token returned from login is stored in localStorage and used
 * for subsequent authenticated API requests via the Axios interceptor.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 6)
 */

import api from './api';

/**
 * Login function
 * 
 * Sends a POST request to the backend with user credentials.
 * If successful, returns the JWT token and user information.
 * 
 * Backend endpoint: POST /api/auth/login
 * Request body: { email, password }
 * Response: { token, uid, displayname, email }
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Promise that resolves to the response data containing token and user info
 * @throws {Error} - If login fails (invalid credentials, network error, etc.)
 * 
 * Usage:
 * try {
 *   const data = await authService.login('user@example.com', 'password123');
 *   console.log('Token:', data.token);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
const login = async (email, password) => {
  try {
    // Make POST request to login endpoint
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    
    // The response should contain: { token, uid, displayname, email, isAdmin }
    // Store the token in localStorage for persistent authentication
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Store user info as well (optional, but useful for UI)
      // Module 17: Include isAdmin for admin access control
      const userInfo = {
        uid: response.data.userid,
        displayname: response.data.displayname,
        email: response.data.email,
        isAdmin: response.data.isAdmin, // Module 17: Store admin flag
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
    }
    
    // Return the full response data
    return response.data;
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Backend returned an error response
      // Throw a more user-friendly error message
      throw new Error(
        error.response.data.message || 
        error.response.data.error || 
        'Invalid email or password'
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to reach the server. Please check your connection.');
    } else {
      // Something else went wrong
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

/**
 * Register function
 * 
 * Sends a POST request to the backend to create a new user account.
 * After successful registration, the user should be redirected to login.
 * 
 * Backend endpoint: POST /api/auth/register
 * Request body: { displayname, email, password }
 * Response: { message, uid } (does not auto-login, user must login separately)
 * 
 * @param {string} displayname - User's display name (3-100 characters)
 * @param {string} email - User's email address (must be unique)
 * @param {string} password - User's password (minimum 6 characters)
 * @returns {Promise<Object>} - Promise that resolves to the response data
 * @throws {Error} - If registration fails (email already exists, validation error, etc.)
 * 
 * Usage:
 * try {
 *   const data = await authService.register('John Doe', 'john@example.com', 'password123');
 *   console.log('Registration successful:', data.message);
 *   // Redirect to login page
 * } catch (error) {
 *   console.error('Registration failed:', error.message);
 * }
 */
const register = async (displayname, email, password) => {
  try {
    // Make POST request to register endpoint
    const response = await api.post('/api/auth/register', {
      displayname,
      email,
      password,
    });
    
    // The response should contain: { message, uid }
    // Note: Registration does NOT automatically log in the user
    // The user will need to login separately with their new credentials
    
    return response.data;
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Backend returned an error response
      // Common errors: email already exists, validation failures
      throw new Error(
        error.response.data.message || 
        error.response.data.error || 
        'Registration failed. Please check your information.'
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to reach the server. Please check your connection.');
    } else {
      // Something else went wrong
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

/**
 * Logout function
 * 
 * Clears the authentication token and user info from localStorage.
 * This effectively logs the user out on the client side.
 * 
 * Note: This is a client-side only operation. If you implement
 * token blacklisting on the backend, you would call an API endpoint here.
 * 
 * @returns {void}
 * 
 * Usage:
 * authService.logout();
 * // Redirect to login or home page
 */
const logout = () => {
  // Remove token and user info from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Optional: If your backend has a logout endpoint for token invalidation:
  // await api.post('/api/auth/logout');
};

/**
 * Get current user info from localStorage
 * 
 * Retrieves the stored user information without making an API call.
 * Returns null if no user is logged in.
 * 
 * @returns {Object|null} - User object { uid, displayname, email } or null
 * 
 * Usage:
 * const user = authService.getCurrentUser();
 * if (user) {
 *   console.log('Logged in as:', user.displayname);
 * }
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    // If JSON parsing fails, return null
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Get current user info from backend
 * 
 * Fetches the latest user information from the backend API.
 * This ensures the local state is synchronized with the database.
 * Useful for checking admin status changes or profile updates.
 * 
 * Backend endpoint: GET /api/users/me
 * Response: { userid, displayname, email, phonenumber, isAdmin, createdAt }
 * 
 * @returns {Promise<Object>} - Promise that resolves to user data from backend
 * @throws {Error} - If request fails
 * 
 * Usage:
 * const userData = await authService.getCurrentUserFromBackend();
 * console.log('Admin status:', userData.isAdmin);
 */
const getCurrentUserFromBackend = async () => {
  try {
    // Make GET request to /api/users/me endpoint
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    // Handle errors
    if (error.response) {
      throw new Error(
        error.response.data.message || 
        error.response.data.error || 
        'Failed to fetch user data'
      );
    } else if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

/**
 * Check if user is authenticated
 * 
 * Simple helper function to check if a token exists.
 * Note: This does NOT validate if the token is still valid.
 * The backend will reject invalid/expired tokens.
 * 
 * @returns {boolean} - true if token exists, false otherwise
 * 
 * Usage:
 * if (authService.isAuthenticated()) {
 *   // User is logged in
 * } else {
 *   // Redirect to login
 * }
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Export all functions as a single object (default export)
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getCurrentUserFromBackend,
  isAuthenticated,
};

export default authService;
