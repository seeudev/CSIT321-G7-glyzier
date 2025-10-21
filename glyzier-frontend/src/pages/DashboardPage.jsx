/**
 * DashboardPage Component
 * 
 * This page serves as the main dashboard for authenticated users.
 * 
 * Functionality:
 * - Display user information from AuthContext (Module 6)
 * - Show order history (to be implemented in Module 8)
 * - Provide "Become a Seller" option (to be implemented in Module 8)
 * - Link to seller dashboard if user is a seller (to be implemented in Module 8)
 * - Logout functionality (Module 6)
 * 
 * Design:
 * - Modern card-based layout with gradient header
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 3.0 (CSS Module implementation)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
  
  /**
   * Handle logout
   * Logs out the user and redirects to home page
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>User Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user.displayname}!</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/" className={styles.homeLink}>
              ← Home
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.grid}>
          {/* User info card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>👤</span>
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
              <span className={styles.cardIcon}>📦</span>
              <h2 className={styles.cardTitle}>Recent Orders</h2>
            </div>
            <div className={styles.cardContent}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <div>
                    <div className={styles.orderNumber}>Order #1</div>
                    <div className={styles.orderAmount}>$99.99</div>
                  </div>
                  <span className={`${styles.orderStatus} ${styles.statusPending}`}>
                    Pending
                  </span>
                </li>
                <li className={styles.listItem}>
                  <div>
                    <div className={styles.orderNumber}>Order #2</div>
                    <div className={styles.orderAmount}>$149.99</div>
                  </div>
                  <span className={`${styles.orderStatus} ${styles.statusCompleted}`}>
                    Completed
                  </span>
                </li>
              </ul>
              <p className={styles.muted}>(Sample data - real orders in Module 8)</p>
            </div>
          </div>
        </div>
        
        {/* Seller features card - full width */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🎨</span>
            <h2 className={styles.cardTitle}>Seller Features</h2>
          </div>
          <div className={styles.cardContent}>
            <p>Want to sell your artwork on Glyzier?</p>
            <button className={styles.button} disabled>
              Become a Seller (Module 8)
            </button>
            <p className={styles.muted}>
              Seller registration and dashboard will be available in Module 8
            </p>
          </div>
        </div>
        
        {/* Module note */}
        <div className={styles.note}>
          <p>📝 Note: This is a placeholder. Full dashboard functionality will be implemented in Module 8</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
