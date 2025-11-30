/**
 * AuthContext - Global Authentication State Management
 * 
 * This context provides authentication state and functions to all components
 * in the application tree. It uses React Context API to avoid prop drilling.
 * 
 * State managed:
 * - user: Current user object { uid, displayname, email } or null
 * - isAuthenticated: Boolean indicating if user is logged in
 * - loading: Boolean indicating if initial auth check is in progress
 * 
 * Functions provided:
 * - login(email, password): Logs in a user
 * - register(displayname, email, password): Registers a new user
 * - logout(): Logs out the current user
 * 
 * Usage:
 * // Wrap your app with AuthProvider in App.jsx:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * // Use the context in any component:
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 6)
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Create the AuthContext
 * This will hold the authentication state and functions
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * This component wraps the application and provides authentication
 * state and functions to all child components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} - The provider component
 */
export const AuthProvider = ({ children }) => {
  // State for current user (null if not logged in)
  const [user, setUser] = useState(null);
  
  // State for authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State for loading indicator (true during initial auth check)
  const [loading, setLoading] = useState(true);
  
  /**
   * useEffect hook to check authentication status on component mount
   * 
   * This runs once when the app loads and checks if there's a valid
   * token and user info in localStorage. If so, it restores the session.
   */
  useEffect(() => {
    try {
      console.log('AuthContext: Checking authentication...');
      // Check if user is already logged in (token in localStorage)
      const token = localStorage.getItem('token');
      const userInfo = authService.getCurrentUser();
      
      if (token && userInfo) {
        // User has a token and user info, restore the session
        console.log('AuthContext: User authenticated', userInfo);
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        console.log('AuthContext: No authentication found');
      }
      
      // Set loading to false after checking
      setLoading(false);
    } catch (error) {
      console.error('AuthContext: Error during auth check', error);
      setLoading(false);
    }
  }, []); // Empty dependency array = run only once on mount
  
  /**
   * Login function
   * 
   * Calls the authService.login function and updates the context state
   * on successful login.
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Promise that resolves to user data
   * @throws {Error} - If login fails
   * 
   * Usage in a component:
   * const { login } = useAuth();
   * try {
   *   await login(email, password);
   *   // Redirect to dashboard
   * } catch (error) {
   *   // Show error message
   * }
   */
  const login = async (email, password) => {
    try {
      // Call the authService login function
      const data = await authService.login(email, password);
      
      // Update the context state with the logged-in user
      // Module 17: Include isAdmin for admin access control
      const userInfo = {
        uid: data.userid,
        displayname: data.displayname,
        email: data.email,
        isAdmin: data.isAdmin, // Module 17: Store admin flag
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      
      // Return the data in case the component needs it
      return data;
    } catch (error) {
      // If login fails, ensure state is cleared
      setUser(null);
      setIsAuthenticated(false);
      
      // Re-throw the error so the component can handle it
      throw error;
    }
  };
  
  /**
   * Register function
   * 
   * Calls the authService.register function to create a new user account.
   * Note: This does NOT automatically log in the user. After successful
   * registration, the user should be redirected to the login page.
   * 
   * @param {string} displayname - User's display name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Promise that resolves to registration response
   * @throws {Error} - If registration fails
   * 
   * Usage in a component:
   * const { register } = useAuth();
   * try {
   *   await register(displayname, email, password);
   *   // Redirect to login page
   * } catch (error) {
   *   // Show error message
   * }
   */
  const register = async (displayname, email, password) => {
    try {
      // Call the authService register function
      const data = await authService.register(displayname, email, password);
      
      // Registration successful, but user is NOT logged in yet
      // Component should redirect to login page
      
      return data;
    } catch (error) {
      // Re-throw the error so the component can handle it
      throw error;
    }
  };
  
  /**
   * Refresh user data from backend
   * 
   * Fetches the latest user information from the backend to ensure
   * the local state is synchronized with the database.
   * Useful for checking admin status changes or profile updates.
   * 
   * @returns {Promise<void>}
   */
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, clear state
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Fetch current user from backend
      const response = await authService.getCurrentUserFromBackend();
      
      // Update context and localStorage with fresh data
      const userInfo = {
        uid: response.userid,
        displayname: response.displayname,
        email: response.email,
        isAdmin: response.isAdmin || false,
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      console.log('AuthContext: User data refreshed', userInfo);
    } catch (error) {
      console.error('AuthContext: Failed to refresh user data', error);
      // If refresh fails, logout the user
      logout();
    }
  };

  /**
   * Logout function
   * 
   * Logs out the current user by clearing the token and user info
   * from localStorage and resetting the context state.
   * 
   * @returns {void}
   * 
   * Usage in a component:
   * const { logout } = useAuth();
   * const handleLogout = () => {
   *   logout();
   *   // Redirect to home or login page
   * };
   */
  const logout = () => {
    console.log('AuthContext: Logging out user');
    
    // Call the authService logout function to clear localStorage
    authService.logout();
    
    // Clear the context state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('AuthContext: User logged out successfully');
  };
  
  /**
   * The value object that will be provided to all consuming components
   * This includes both state and functions
   */
  const value = {
    user,              // Current user object or null
    isAuthenticated,   // Boolean: is user logged in?
    loading,           // Boolean: is initial auth check in progress?
    login,             // Function to log in
    register,          // Function to register
    logout,            // Function to log out
    refreshUser,       // Function to refresh user data from backend
  };
  
  // Removed blocking loading screen to allow HomePage to render immediately
  // The loading state is still available for components that need it
  
  // Provide the context value to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext
 * 
 * This hook provides a convenient way to access the authentication
 * context in any component. It also includes error checking.
 * 
 * @returns {Object} - The authentication context value
 * @throws {Error} - If used outside of AuthProvider
 * 
 * Usage in a component:
 * import { useAuth } from '../context/AuthContext';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (isAuthenticated) {
 *     return <div>Welcome, {user.displayname}!</div>;
 *   }
 *   
 *   return <div>Please log in</div>;
 * }
 */
export const useAuth = () => {
  // Get the context value
  const context = useContext(AuthContext);
  
  // Check if the hook is being used within AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export the context itself (rarely needed, but available)
export default AuthContext;
