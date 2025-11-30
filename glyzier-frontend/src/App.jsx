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
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import ShopsPage from './pages/ShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';
import CommunityPage from './pages/CommunityPage';
import MorePage from './pages/MorePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import NotFoundPage from './pages/NotFoundPage';

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
            
            {/* Search page - search and filter products (PUBLIC - Module 11) */}
            <Route path="/search" element={<SearchPage />} />
            
            {/* Placeholder pages for navigation links (PUBLIC) */}
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/more" element={<MorePage />} />
            
            {/* Shop Detail page - view individual shop (PUBLIC - Module 15) */}
            <Route path="/shops/:sid" element={<ShopDetailPage />} />
          
          {/* Protected routes - require authentication */}
          
          {/* Favorites page - user's wishlist (PROTECTED) - Module 10 */}
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard - user's personal dashboard (PROTECTED) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile - user profile management (PROTECTED - Module 14) */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
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
          
          {/* Seller Orders - view and manage orders containing seller's products (PROTECTED - Module 13) */}
          <Route 
            path="/seller/orders" 
            element={
              <ProtectedRoute>
                <SellerOrdersPage />
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
          
          {/* Checkout page - address and payment (PROTECTED - Module 12) */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Order Confirmation page - show order details after checkout (PROTECTED - Module 12) */}
          <Route 
            path="/order-confirmation/:orderid" 
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Messages - 2-column layout with conversations and messages (PROTECTED - Module 16) */}
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Message Thread - specific conversation selected (PROTECTED - Module 16) */}
          <Route 
            path="/messages/:id" 
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes - require ADMIN role (Module 17) */}
          
          {/* Admin Dashboard - overview statistics (PROTECTED - ADMIN ONLY) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Users - user management (PROTECTED - ADMIN ONLY) */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Products - product moderation (PROTECTED - ADMIN ONLY) */}
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute>
                <AdminProductsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Categories - category management (PROTECTED - ADMIN ONLY) */}
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedRoute>
                <AdminCategoriesPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 
            Additional routes to be added in future modules:
            - /orders/:orderid - Order details (Future module, PROTECTED)
          */}
          
          {/* Catch-all route for 404 - must be last */}
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
