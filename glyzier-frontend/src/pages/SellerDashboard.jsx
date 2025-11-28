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
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.title}>Seller Dashboard</h1>
              <p className={styles.subtitle}>
                {sellerProfile?.sellername || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      
      {/* Main Content */}
      <div className={styles.content}>
        {/* Seller Info Card */}
          <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}><StoreIcon size={32} color="#8b7fc4" /></span>
            <h2 className={styles.cardTitle}>Seller Information</h2>
          </div>
          <div className={styles.cardContent}>
            {sellerProfile ? (
              <>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Seller ID</span>
                  <span className={styles.infoValue}>{sellerProfile.sid || sellerId || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Shop Name</span>
                  <span className={styles.infoValue}>{sellerProfile.sellername || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Bio</span>
                  <span className={styles.infoValue}>
                    {sellerProfile.storebio || 'No bio provided'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Total Products</span>
                  <span className={styles.infoValue}>{products.length}</span>
                </div>
              </>
            ) : (
              <div className={styles.infoRow}>
                <span className={styles.infoValue}>Loading seller information...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Management Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}><PackageIcon size={32} color="#8b7fc4" /></span>
            <h2 className={styles.cardTitle}>Product Management</h2>
          </div>
          
          <div className={styles.cardContent}>
            <p className={styles.sectionDescription}>
              Create, edit, and manage your product catalog in one place.
            </p>
            <div className={styles.manageProductsSection}>
              <Link to="/seller/manage-products" className={styles.manageProductsButton}>
                <LayersIcon size={24} color="white" />
                <div>
                  <div className={styles.buttonTitle}>Manage Products</div>
                  <div className={styles.buttonSubtitle}>
                    View and edit your catalog ({products.length} product{products.length !== 1 ? 's' : ''})
                  </div>
                </div>
              </Link>
              
              <Link to="/seller/orders" className={styles.manageProductsButton}>
                <PackageIcon size={24} color="white" />
                <div>
                  <div className={styles.buttonTitle}>Manage Orders</div>
                  <div className={styles.buttonSubtitle}>
                    View and update order status
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SellerDashboard;
