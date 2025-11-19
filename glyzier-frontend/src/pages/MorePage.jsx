/**
 * MorePage Component (Placeholder)
 * 
 * This page will display additional features and information.
 * Currently a placeholder for future implementation.
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import styles from './HomePage.module.css'; // Reuse HomePage styles

function MorePage() {
  return (
    <div className={styles.page}>
      <Navigation />
      
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '1rem' }}>
          ⚙️ More
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '2rem' }}>
          Additional features and settings
        </p>
        <p style={{ color: '#95a5a6' }}>
          This feature is coming soon. More options and settings will be available here!
        </p>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-block',
            marginTop: '2rem',
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #8b7fc4, #7c6fb8)',
            color: 'white',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default MorePage;
