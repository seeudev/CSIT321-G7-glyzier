/**
 * LoginPage Component
 * 
 * This page provides a login form for users to authenticate.
 * 
 * Functionality:
 * - Email and password input fields
 * - Form validation
 * - Calls the backend API to authenticate user
 * - Stores JWT token on successful login
 * - Redirects to dashboard after login
 * 
 * This is a placeholder for Module 5. Full functionality will be
 * implemented in Module 6 when AuthService and AuthContext are created.
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * LoginPage functional component
 * 
 * @returns {JSX.Element} The login page component
 */
function LoginPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // State for error messages
  const [error, setError] = useState('');
  
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  
  /**
   * Handle input changes
   * Updates the form data state when user types
   * 
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError('');
  };
  
  /**
   * Handle form submission
   * This will be fully implemented in Module 6 with AuthService
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Placeholder - will be implemented in Module 6
    console.log('Login attempt with:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setError('Login functionality will be implemented in Module 6');
    }, 1000);
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Login to Glyzier</h1>
        <p style={styles.subtitle}>Access your account to browse and purchase artwork</p>
        
        {/* Error message display */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        {/* Login form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email input */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          
          {/* Password input */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Link to register page */}
        <div style={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
          <Link to="/" style={styles.link}>
            ← Back to Home
          </Link>
        </div>
        
        {/* Module note */}
        <div style={styles.note}>
          <p>📝 Note: Full authentication will be implemented in Module 6</p>
        </div>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%',
  },
  title: {
    fontSize: '2em',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #fcc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.95em',
  },
  input: {
    padding: '12px',
    fontSize: '1em',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '14px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '25px',
    textAlign: 'center',
    color: '#666',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  note: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.9em',
  },
};

export default LoginPage;
