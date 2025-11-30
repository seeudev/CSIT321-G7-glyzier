/**
 * SellerDashboard Component
 * 
 * This page serves as the main dashboard for sellers to manage their products.
 * Only accessible to users who are registered as sellers.
 * 
 * Features:
 * - Create new products with form validation
 * - View all products owned by the seller
 * - Edit existing products (inline editing)
 * - Delete products with confirmation
 * - View product inventory status
 * 
 * Design:
 * - Modern card-based layout with gradient header
 * - Product creation form with proper validation
 * - Product list with action buttons
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 8)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkIfSeller, getMySellerProfile } from '../services/sellerService';
import { getProductsBySeller } from '../services/productService';
import { showError, showInfo } from '../components/NotificationManager';
import { StoreIcon, PackageIcon, LayersIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import styles from '../styles/pages/SellerDashboard.module.css';

/**
 * SellerDashboard functional component
 * 
 * @returns {JSX.Element} The seller dashboard page component
 */
function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Seller verification state
  const [isSeller, setIsSeller] = useState(false);
  const [sellerId, setSellerId] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [verifying, setVerifying] = useState(true);
  
  // Products state (used only for displaying product count)
  const [products, setProducts] = useState([]);
  
  /**
   * Verify seller status on component mount
   * Redirect to dashboard if user is not a seller
   */
  useEffect(() => {
    const verifySeller = async () => {
      try {
        setVerifying(true);
        
        // Check if user is a seller
        const sellerStatus = await checkIfSeller();
        
        if (!sellerStatus.isSeller) {
          showInfo('You must be a seller to access this page. Please register as a seller first.');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        
        setIsSeller(true);
        setSellerId(sellerStatus.sid);
        
        // Fetch seller profile
        const profile = await getMySellerProfile();
        console.log('Seller profile received:', profile);
        setSellerProfile(profile);
        
      } catch (err) {
        console.error('Failed to verify seller status:', err);
        showError('Failed to verify seller status. Redirecting to dashboard.');
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setVerifying(false);
      }
    };
    
    verifySeller();
  }, [navigate]);
  
  /**
   * Fetch seller's products (for displaying count only)
   */
  useEffect(() => {
    if (!sellerId) return;
    
    const fetchProducts = async () => {
      try {
        const data = await getProductsBySeller(sellerId);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    };
    
    fetchProducts();
  }, [sellerId]);
  
  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  /**
   * Show loading screen while verifying seller status
   */
  if (verifying) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Verifying seller status...</p>
        </div>
      </div>
    );
  }
  
  /**
   * Main render
   */
  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <Aurora 
            colorStops={['#667eea', '#764ba2', '#f093fb']}
            amplitude={1.2}
            blend={0.6}
            speed={0.4}
          />
          <div className={styles.headerCard}>
            <div className={styles.headerContent}>
              <div className={styles.welcomeSection}>
                <h1 className={styles.title}>Seller Dashboard</h1>
                <p className={styles.subtitle}>
                  {sellerProfile?.sellername || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      
      {/* Main Content */}
      <div className={styles.content}>
        {/* Stats Grid - Quick Overview */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <StoreIcon size={28} color="#667eea" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Shop Name</div>
              <div className={styles.statValue}>{sellerProfile?.sellername || 'Loading...'}</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <PackageIcon size={28} color="#764ba2" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Total Products</div>
              <div className={styles.statValue}>{products.length}</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <LayersIcon size={28} color="#f093fb" />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Seller ID</div>
              <div className={styles.statValue}>#{sellerProfile?.sid || sellerId || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className={styles.dashboardGrid}>
          {/* Seller Info Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><StoreIcon size={32} color="#8b7fc4" /></span>
              <h2 className={styles.cardTitle}>Shop Information</h2>
            </div>
            <div className={styles.cardContent}>
              {sellerProfile ? (
                <>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Shop Name</span>
                    <span className={styles.infoValue}>{sellerProfile.sellername || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>About Your Shop</span>
                    <span className={styles.infoValue}>
                      {sellerProfile.storebio || 'No bio provided'}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <Link to="/profile" className={styles.buttonSecondary}>
                      Edit Shop Profile
                    </Link>
                  </div>
                </>
              ) : (
                <div className={styles.infoRow}>
                  <span className={styles.infoValue}>Loading seller information...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}><PackageIcon size={32} color="#8b7fc4" /></span>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.quickActionsGrid}>
                <Link to="/seller/manage-products" className={styles.actionCard}>
                  <div className={styles.actionIconWrapper}>
                    <LayersIcon size={32} color="#667eea" />
                  </div>
                  <div className={styles.actionInfo}>
                    <div className={styles.actionTitle}>Manage Products</div>
                    <div className={styles.actionSubtitle}>
                      {products.length} product{products.length !== 1 ? 's' : ''} in catalog
                    </div>
                  </div>
                </Link>
                
                <Link to="/seller/orders" className={styles.actionCard}>
                  <div className={styles.actionIconWrapper}>
                    <PackageIcon size={32} color="#764ba2" />
                  </div>
                  <div className={styles.actionInfo}>
                    <div className={styles.actionTitle}>View Orders</div>
                    <div className={styles.actionSubtitle}>
                      Manage customer orders
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SellerDashboard;
