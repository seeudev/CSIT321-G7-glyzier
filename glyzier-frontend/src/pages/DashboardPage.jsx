/**
 * DashboardPage Component
 * 
 * This page serves as the main dashboard for authenticated users.
 * 
 * Functionality:
 * - Display user information from AuthContext
 * - Show real order history using orderService (Module 8)
 * - Provide "Become a Seller" functionality with registration form (Module 8)
 * - Link to seller dashboard if user is a seller (Module 8)
 * - Logout functionality
 * 
 * Design:
 * - Modern card-based layout with gradient header
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 4.0 (Module 8 - Real order history and seller registration)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyHistory } from '../services/orderService';
import { registerAsSeller, checkIfSeller } from '../services/sellerService';
import Navigation from '../components/Navigation';
import { UserIcon, PackageIcon, ArtIcon } from '../components/Icons';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage functional component
 * 
 * @returns {JSX.Element} The dashboard page component
 */
function DashboardPage() {
  // Get authentication state and functions from context
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for order history
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  
  // State for seller status
  const [isSeller, setIsSeller] = useState(false);
  const [sellerId, setSellerId] = useState(null);
  const [sellerCheckLoading, setSellerCheckLoading] = useState(true);
  
  // State for seller registration
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerFormData, setSellerFormData] = useState({
    sellername: '',
    storebio: ''
  });
  const [sellerFormLoading, setSellerFormLoading] = useState(false);
  
  /**
   * Fetch order history on component mount
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await getMyHistory();
        // Ensure data is an array
        setOrders(Array.isArray(data) ? data : []);
        setOrdersError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrdersError('Failed to load order history');
        setOrders([]); // Set empty array on error
      } finally {
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, []); // Run once on mount
  
  /**
   * Check seller status on component mount
   */
  useEffect(() => {
    const checkSeller = async () => {
      try {
        setSellerCheckLoading(true);
        const data = await checkIfSeller();
        setIsSeller(data.isSeller);
        setSellerId(data.sid || null);
      } catch (err) {
        console.error('Failed to check seller status:', err);
        setIsSeller(false);
        setSellerId(null);
      } finally {
        setSellerCheckLoading(false);
      }
    };
    
    checkSeller();
  }, []); // Run once on mount
  
  /**
   * Handle logout
   * Logs out the user and redirects to home page
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  /**
   * Handle seller form input changes
   */
  const handleSellerFormChange = (e) => {
    const { name, value } = e.target;
    setSellerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handle seller registration form submission
   */
  const handleSellerRegistration = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!sellerFormData.sellername.trim()) {
      alert('Seller name is required');
      return;
    }
    
    if (sellerFormData.sellername.trim().length < 3) {
      alert('Seller name must be at least 3 characters');
      return;
    }
    
    try {
      setSellerFormLoading(true);
      
      // Call the sellerService to register
      const result = await registerAsSeller(sellerFormData);
      
      // Show success message
      alert(`Successfully registered as a seller!\nSeller ID: ${result.seller.sid}\n\nYou can now access your seller dashboard.`);
      
      // Update seller status
      setIsSeller(true);
      setSellerId(result.seller.sid);
      setShowSellerForm(false);
      
      // Reset form
      setSellerFormData({ sellername: '', storebio: '' });
      
    } catch (err) {
      console.error('Error registering as seller:', err);
      alert(`Failed to register as seller: ${err.message}`);
    } finally {
      setSellerFormLoading(false);
    }
  };
  
  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={styles.page}>
      <Navigation />
      
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>User Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user.displayname}!</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.grid}>
          {/* User info card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><UserIcon size={32} color="#8b7fc4" /></span>
              <h2 className={styles.cardTitle}>Your Information</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>User ID</span>
                <span className={styles.infoValue}>{user.uid}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Display Name</span>
                <span className={styles.infoValue}>{user.displayname}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
            </div>
          </div>
          
          {/* Order history card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><PackageIcon size={32} color="#8b7fc4" /></span>
              <h2 className={styles.cardTitle}>Order History</h2>
            </div>
            <div className={styles.cardContent}>
              {ordersLoading ? (
                <p className={styles.muted}>Loading orders...</p>
              ) : ordersError ? (
                <p style={{ color: '#d32f2f' }}>{ordersError}</p>
              ) : !Array.isArray(orders) || orders.length === 0 ? (
                <p className={styles.muted}>No orders yet. Start shopping to see your order history!</p>
              ) : (
                <ul className={styles.list}>
                  {orders.map((order) => (
                    <li key={order.orderid} className={styles.listItem}>
                      <div>
                        <div className={styles.orderNumber}>Order #{order.orderid}</div>
                        <div className={styles.orderDate}>{formatDate(order.placedAt)}</div>
                        <div className={styles.orderAmount}>₱{order.total.toFixed(2)}</div>
                        <div className={styles.orderItems}>{order.itemCount} item(s)</div>
                      </div>
                      <span className={`${styles.orderStatus} ${
                        order.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                      }`}>
                        {order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Seller features card - full width */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}><ArtIcon size={32} color="#8b7fc4" /></span>
            <h2 className={styles.cardTitle}>Seller Features</h2>
          </div>
          <div className={styles.cardContent}>
            {sellerCheckLoading ? (
              <p className={styles.muted}>Checking seller status...</p>
            ) : isSeller ? (
              <div>
                <p>✅ You are registered as a seller!</p>
                <Link to="/seller/dashboard" className={styles.button}>
                  Go to Seller Dashboard
                </Link>
              </div>
            ) : (
              <div>
                {!showSellerForm ? (
                  <div>
                    <p>Want to sell your artwork on Glyzier?</p>
                    <button 
                      className={styles.button} 
                      onClick={() => setShowSellerForm(true)}
                    >
                      Become a Seller
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSellerRegistration} className={styles.sellerForm}>
                    <h3>Seller Registration</h3>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="sellername" className={styles.formLabel}>
                        Seller Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="sellername"
                        name="sellername"
                        className={styles.formInput}
                        placeholder="e.g., Artisan Gallery"
                        value={sellerFormData.sellername}
                        onChange={handleSellerFormChange}
                        required
                        minLength={3}
                        maxLength={100}
                        disabled={sellerFormLoading}
                      />
                      <small className={styles.formHint}>
                        Your shop name (3-100 characters)
                      </small>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="storebio" className={styles.formLabel}>
                        Store Bio
                      </label>
                      <textarea
                        id="storebio"
                        name="storebio"
                        className={styles.formTextarea}
                        placeholder="Tell buyers about your art and experience..."
                        value={sellerFormData.storebio}
                        onChange={handleSellerFormChange}
                        maxLength={1000}
                        rows={4}
                        disabled={sellerFormLoading}
                      />
                      <small className={styles.formHint}>
                        Optional description (max 1000 characters)
                      </small>
                    </div>
                    
                    <div className={styles.formActions}>
                      <button 
                        type="submit" 
                        className={styles.button}
                        disabled={sellerFormLoading}
                      >
                        {sellerFormLoading ? 'Registering...' : 'Register as Seller'}
                      </button>
                      <button 
                        type="button" 
                        className={styles.buttonSecondary}
                        onClick={() => setShowSellerForm(false)}
                        disabled={sellerFormLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Remove the module note since functionality is now implemented */}
      </div>
    </div>
  );
}

export default DashboardPage;
