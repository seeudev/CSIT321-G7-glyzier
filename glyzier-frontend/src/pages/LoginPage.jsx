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
 * Design:
 * - Split-screen layout following Figma wireframe
 * - Form on left, decorative art background on right
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 3.0 (Figma wireframe implementation with CSS modules)
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css';

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
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // State for remember me checkbox
  const [rememberMe, setRememberMe] = useState(false);
  
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
    <div className={styles.container}>
      {/* Left side - Login form */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>Glyzier</div>
          
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.subtitle}>Your journey starts here.</p>
          
          {/* Error message display */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email input */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="your.email.here@gmail.com"
              />
            </div>
            
            {/* Password input */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="••••••••••••••"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            {/* Keep me logged in checkbox */}
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Keep me logged in</label>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          {/* Link to register page */}
          <div className={styles.footer}>
            <p>
              Need an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Decorative art background */}
      <div className={styles.artSection}>
        <div className={styles.artContent}>
          <p className={styles.artTitle}>(Artwork carousel - coming soon)</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
