/**
 * DashboardPage Component
 * 
 * This page serves as the main dashboard for authenticated users.
 * 
 * Functionality (to be implemented in Module 8):
 * - Display user information
 * - Show order history
 * - Provide "Become a Seller" option
 * - Link to seller dashboard if user is a seller
 * 
 * This is a placeholder for Module 5. Full functionality will be
 * implemented in Module 8 with order history and seller features.
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DashboardPage functional component
 * 
 * @returns {JSX.Element} The dashboard page component
 */
function DashboardPage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>User Dashboard</h1>
        <p style={styles.subtitle}>Welcome to your Glyzier dashboard</p>
        
        {/* User info section - placeholder */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👤 Your Information</h2>
          <div style={styles.card}>
            <p><strong>Display Name:</strong> Will be loaded from AuthContext (Module 6)</p>
            <p><strong>Email:</strong> Will be loaded from AuthContext (Module 6)</p>
            <p><strong>Member Since:</strong> To be implemented</p>
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
