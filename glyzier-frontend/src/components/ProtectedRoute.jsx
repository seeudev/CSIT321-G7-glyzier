/**
 * ProtectedRoute Component
 * 
 * This component wraps routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 * 
 * This is a common pattern in React applications to protect certain
 * pages from unauthorized access.
 * 
 * Usage in App.jsx or routing configuration:
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   } 
 * />
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 6)
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute functional component
 * 
 * Checks if the user is authenticated using the AuthContext.
 * If authenticated, renders the child components.
 * If not authenticated, redirects to the login page.
 * 
 * The current location is passed to the login page so that after
 * successful login, the user can be redirected back to where they
 * were trying to go.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The protected component(s) to render if authenticated
 * @returns {JSX.Element} - Either the protected component or a redirect to login
 * 
 * Example:
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/login" element={<LoginPage />} />
 *       <Route 
 *         path="/dashboard" 
 *         element={
 *           <ProtectedRoute>
 *             <DashboardPage />
 *           </ProtectedRoute>
 *         } 
 *       />
 *     </Routes>
 *   );
 * }
 */
function ProtectedRoute({ children }) {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();
  
  // Get the current location (the page the user is trying to access)
  const location = useLocation();
  
  // If still loading (checking initial auth state), show loading indicator
  // This prevents redirecting to login before we know if user is authenticated
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5em',
        color: '#667eea',
      }}>
        Loading...
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login page
  // Pass the current location in state so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render the protected component
  return children;
}

export default ProtectedRoute;
