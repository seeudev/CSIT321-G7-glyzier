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
 * - /products/:pid : Product detail page (public)
 * - /dashboard : User dashboard (protected - requires authentication)
 * - /seller/dashboard : Seller dashboard (protected - requires authentication + seller status)
 * 
 * Module 6 implementation includes:
 * - AuthProvider wrapping the entire app for global auth state
 * - ProtectedRoute component for authenticated-only pages
 * - Automatic token-based authentication with localStorage
 * 
 * Module 7 implementation includes:
 * - Product listing on home page
 * - Product detail page with Buy Now button
 * - ProductService for API calls
 * 
 * Module 8 implementation includes:
 * - Order placement functionality
 * - Real order history on dashboard
 * - Seller registration and dashboard
 * - Product management (CRUD operations)
 * 
 * @author Glyzier Team
 * @version 4.0 (Module 8 - User & Seller Dashboards)
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import context providers
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerDashboard from './pages/SellerDashboard';
import ManageProducts from './pages/ManageProducts';
import CartPage from './pages/CartPage';
import ShopsPage from './pages/ShopsPage';
import CommunityPage from './pages/CommunityPage';
import MorePage from './pages/MorePage';

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
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
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
            
            {/* Product detail page - view individual product (PUBLIC) */}
            <Route path="/products/:pid" element={<ProductDetailPage />} />
            
            {/* Placeholder pages for navigation links (PUBLIC) */}
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/more" element={<MorePage />} />
          
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
          
          {/* Seller Dashboard - seller's product management dashboard (PROTECTED) */}
          <Route 
            path="/seller/dashboard" 
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Manage Products - dedicated product management page for sellers (PROTECTED) */}
          <Route 
            path="/seller/manage-products" 
            element={
              <ProtectedRoute>
                <ManageProducts />
              </ProtectedRoute>
            } 
          />
          
          {/* Shopping Cart page - view and manage cart (PROTECTED - Module 9) */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 
            Additional routes to be added in future modules:
            - /orders/:orderid - Order details (Future module, PROTECTED)
            - /sellers/:sid - Public seller profile page (Future module, PUBLIC)
          */}
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
