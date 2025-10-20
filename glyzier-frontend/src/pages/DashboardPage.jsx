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
 * @author Glyzier Team
 * @version 2.0 (Module 6 - Added real user info and logout)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>User Dashboard</h1>
        <p style={styles.subtitle}>Welcome to your Glyzier dashboard, {user.displayname}!</p>
        
        {/* User info section - now with real data from AuthContext */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👤 Your Information</h2>
          <div style={styles.card}>
            <p><strong>User ID:</strong> {user.uid}</p>
            <p><strong>Display Name:</strong> {user.displayname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <div style={{ marginTop: '15px' }}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Order history section - placeholder */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📦 Order History</h2>
          <div style={styles.card}>
            <p>Your order history will be displayed here (Module 8)</p>
            <ul style={styles.list}>
              <li>Order #1 - Total: $99.99 - Status: Pending</li>
              <li>Order #2 - Total: $149.99 - Status: Completed</li>
              <li style={styles.muted}>(Sample data - real orders in Module 8)</li>
            </ul>
          </div>
        </div>
        
        {/* Seller section - placeholder */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎨 Seller Features</h2>
          <div style={styles.card}>
            <p>Want to sell your artwork on Glyzier?</p>
            <button style={styles.button} disabled>
              Become a Seller (Module 8)
            </button>
            <p style={styles.muted}>
              Seller registration and dashboard will be available in Module 8
            </p>
          </div>
        </div>
        
        {/* Navigation links */}
        <div style={styles.section}>
          <Link to="/" style={styles.link}>← Back to Home</Link>
        </div>
        
        {/* Module note */}
        <div style={styles.note}>
          <p>📝 Note: This is a placeholder. Full dashboard functionality will be implemented in Module 8</p>
        </div>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1em',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5em',
    marginBottom: '15px',
    color: '#667eea',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  list: {
    marginTop: '15px',
    marginLeft: '20px',
  },
  muted: {
    color: '#888',
    fontSize: '0.9em',
    marginTop: '10px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1em',
    fontWeight: 'bold',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    marginTop: '10px',
    opacity: 0.6,
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '0.95em',
    fontWeight: 'bold',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
  note: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default DashboardPage;
