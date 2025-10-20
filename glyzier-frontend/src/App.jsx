/**
 * App Component - Main Application Entry Point
 * 
 * This is the root component of the Glyzier React application.
 * It sets up the routing structure using React Router and provides
 * global authentication state via AuthContext.
 * 
 * Routes configured:
 * - / : Home page (public)
 * - /login : Login page (public)
 * - /register : Registration page (public)
 * - /dashboard : User dashboard (protected - requires authentication)
 * 
 * Module 6 implementation includes:
 * - AuthProvider wrapping the entire app for global auth state
 * - ProtectedRoute component for authenticated-only pages
 * - Automatic token-based authentication with localStorage
 * 
 * In Module 7-8, we will add:
 * - Product listing and detail pages
 * - Seller dashboard
 * - Order placement functionality
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 6 - Full Authentication Implementation)
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import context provider
import { AuthProvider } from './context/AuthContext.jsx';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

/**
 * App functional component
 * Sets up the routing structure for the application
 * 
 * The entire app is wrapped in AuthProvider to provide authentication
 * state to all components. Protected routes use the ProtectedRoute
 * component to ensure users are authenticated before accessing them.
 * 
 * @returns {JSX.Element} The main app component with routing
 */
function App() {
  return (
    // Wrap everything in AuthProvider to provide auth state globally
    <AuthProvider>
      <BrowserRouter>
        {/* 
          Routes component contains all route definitions
          Each Route maps a URL path to a component
        */}
        <Routes>
          {/* Public routes - accessible to everyone */}
          
          {/* Home page - landing page with product showcase */}
          <Route path="/" element={<HomePage />} />
          
          {/* Login page - user authentication */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Register page - new user registration */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes - require authentication */}
          
          {/* Dashboard - user's personal dashboard (PROTECTED) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 
            Additional routes to be added in later modules:
            - /products - Product listing (Module 7)
            - /products/:pid - Product detail page (Module 7)
            - /seller/dashboard - Seller dashboard (Module 8, PROTECTED)
            - /orders/:orderid - Order details (Module 8, PROTECTED)
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
