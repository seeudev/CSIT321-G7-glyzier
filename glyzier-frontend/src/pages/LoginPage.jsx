/**
 * LoginPage Component
 * 
 * This page provides a login form for users to authenticate.
 * 
 * Functionality:
 * - Email and password input fields
 * - Form validation
 * - Calls the backend API to authenticate user via AuthContext
 * - Stores JWT token on successful login
 * - Redirects to dashboard (or previous location) after login
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 6 - Full Implementation)
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * LoginPage functional component
 * 
 * @returns {JSX.Element} The login page component
 */
function LoginPage() {
  // Get login function from AuthContext
  const { login } = useAuth();
  
  // Navigation hook for redirecting after successful login
  const navigate = useNavigate();
  
  // Get location to redirect back to where user was trying to go
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
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
   * 
   * Calls the login function from AuthContext which:
   * 1. Sends credentials to backend
   * 2. Stores JWT token in localStorage
   * 3. Updates global auth state
   * 4. Redirects to dashboard or previous page
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the login function from AuthContext
      await login(formData.email, formData.password);
      
      // Login successful - redirect to dashboard or previous location
      navigate(from, { replace: true });
    } catch (error) {
      // Login failed - show error message
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      // Always stop loading indicator
      setLoading(false);
    }
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
};

export default LoginPage;
