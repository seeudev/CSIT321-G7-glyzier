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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllProducts } from '../services/productService';
import styles from '../styles/pages/LoginPage.module.css';

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
  const from = location.state?.from?.pathname || '/';
  
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
  
  // State for carousel products
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Fetch products for carousel
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setCarouselProducts(data.slice(0, 5)); // Get first 5 products for carousel
      } catch (err) {
        console.error('Failed to fetch carousel products:', err);
      }
    };
    fetchProducts();
  }, []);
  
  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (carouselProducts.length <= 1) return;
    
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [carouselProducts.length]);
  
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
          
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue your creative journey</p>
          
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
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Keep me logged in checkbox and forgot password link */}
            <div className={styles.checkboxRow}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Keep me signed in</label>
              </div>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
      
      {/* Right side - Full-screen cycling showcase with zoom effect */}
      <div className={styles.artSection}>
        {carouselProducts.length > 0 && carouselProducts[carouselIndex]?.screenshotPreviewUrl ? (
          <div className={styles.fullscreenCarousel}>
            <img 
              key={carouselIndex}
              src={carouselProducts[carouselIndex].screenshotPreviewUrl} 
              alt={carouselProducts[carouselIndex].productname}
              className={styles.fullscreenImage}
            />
            <div className={styles.carouselOverlay}>
              <h3>{carouselProducts[carouselIndex].productname}</h3>
            </div>
          </div>
        ) : (
          <div className={styles.fullscreenCarousel}>
            <div className={styles.loadingText}>Loading featured artworks...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
