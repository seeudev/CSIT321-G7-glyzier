/**
 * HomePage Component
 * 
 * This is the landing page of the Glyzier application.
 * It will display:
 * - A welcome message
 * - Featured products (to be implemented in Module 7)
 * - Navigation to login/register for guests or dashboard for logged-in users
 * 
 * In Module 7, this page will be updated to show a grid of products
 * fetched from the backend API.
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 6 - Added authentication awareness)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * HomePage functional component
 * 
 * @returns {JSX.Element} The home page component
 */
function HomePage() {
  // Get authentication state and functions from context
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  /**
   * Handle logout
   * Logs out the user and stays on the home page
   */
  const handleLogout = () => {
    logout();
    // Optional: You could show a success message here
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          {isAuthenticated ? `Welcome back, ${user.displayname}!` : 'Welcome to Glyzier'}
        </h1>
        <p style={styles.subtitle}>
          Discover and purchase amazing artwork from talented artists
        </p>
        
        <div style={styles.buttonGroup}>
          {isAuthenticated ? (
            // Buttons for authenticated users
            <>
              <Link to="/dashboard" style={styles.button}>
                My Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Logout
              </button>
            </>
          ) : (
            // Buttons for guests
            <>
              <Link to="/login" style={styles.button}>
                Login
              </Link>
              <Link to="/register" style={{...styles.button, ...styles.buttonSecondary}}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div style={styles.info}>
        <h2>About Glyzier</h2>
        <p>
          Glyzier is an artist portfolio and store platform where artists can
          showcase and sell their work, and art enthusiasts can discover and
          purchase unique pieces.
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <h3>🎨 For Artists</h3>
            <p>Create your seller account, upload your artwork, and manage your inventory</p>
          </div>
          
          <div style={styles.feature}>
            <h3>🛒 For Buyers</h3>
            <p>Browse artwork, place orders, and track your purchase history</p>
          </div>
          
          <div style={styles.feature}>
            <h3>📦 Simple & Secure</h3>
            <p>Easy-to-use interface with simulated payment for educational purposes</p>
          </div>
        </div>
      </div>
      
      <div style={styles.comingSoon}>
        <p>🎨 Product catalog coming soon (Module 7)...</p>
      </div>
    </div>
  );
}

// Inline styles for simplicity (in a real app, you'd use CSS modules or styled-components)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3em',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.3em',
    marginBottom: '30px',
    opacity: 0.9,
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 30px',
    fontSize: '1.1em',
    backgroundColor: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
  },
  info: {
    padding: '20px',
    marginBottom: '40px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  feature: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  comingSoon: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '5px',
    fontSize: '1.1em',
  },
};

export default HomePage;
