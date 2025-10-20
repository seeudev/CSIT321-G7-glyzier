/**
 * App Component - Main Application Entry Point
 * 
 * This is the root component of the Glyzier React application.
 * It sets up the routing structure using React Router.
 * 
 * Routes configured:
 * - / : Home page (public)
 * - /login : Login page (public)
 * - /register : Registration page (public)
 * - /dashboard : User dashboard (will be protected in Module 6)
 * 
 * In Module 6, we will add:
 * - AuthContext provider to wrap the entire app
 * - Protected routes for authenticated-only pages
 * - Automatic token-based authentication
 * 
 * In Module 7-8, we will add:
 * - Product listing and detail pages
 * - Seller dashboard
 * - Order placement functionality
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

/**
 * App functional component
 * Sets up the routing structure for the application
 * 
 * @returns {JSX.Element} The main app component with routing
 */
function App() {
  return (
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
        
        {/* Dashboard - user's personal dashboard */}
        {/* Note: This will be protected in Module 6 with ProtectedRoute */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* 
          Additional routes to be added in later modules:
          - /products - Product listing (Module 7)
          - /products/:pid - Product detail page (Module 7)
          - /seller/dashboard - Seller dashboard (Module 8)
          - /orders/:orderid - Order details (Module 8)
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
