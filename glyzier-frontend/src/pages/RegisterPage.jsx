/**
 * RegisterPage Component
 * 
 * Registration form for new users based on UI wireframes.
 * Features:
 * - Display name, email, date of birth, password fields
 * - Client-side validation
 * - Split-screen layout with form and decorative art section
 * - Google sign-in option (placeholder)
 * 
 * @author Glyzier Team
 * @version 4.0 (UI Wireframe implementation)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllProducts } from '../services/productService';
import styles from '../styles/pages/RegisterPage.module.css';

/**
 * RegisterPage functional component
 * 
 * @returns {JSX.Element} The register page component
 */
function RegisterPage() {
  // Get register function from AuthContext
  const { register } = useAuth();
  
  // Navigation hook for redirecting after successful registration
  const navigate = useNavigate();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    displayname: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // State for error messages
  const [error, setError] = useState('');
  
  // State for success message
  const [success, setSuccess] = useState('');
  
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
   * Performs client-side validation then calls the register function
   * from AuthContext which sends data to the backend.
   * On success, shows a message and redirects to login page.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Client-side validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Check password length (minimum 6 characters)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Check display name length
    if (formData.displayname.length < 3) {
      setError('Display name must be at least 3 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the register function from AuthContext
      await register(formData.displayname, formData.email, formData.password);
      
      // Registration successful - show success message
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Registration failed - show error message
      setError(error.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      {/* Left side - Registration form */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>Glyzier</div>
          
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Glyzier and discover amazing artworks</p>
          
          {/* Error message display */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          {/* Success message display */}
          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}
          
          {/* Registration form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Display name input */}
            <div className={styles.formGroup}>
              <label htmlFor="displayname" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="displayname"
                name="displayname"
                value={formData.displayname}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                className={styles.input}
                placeholder="Enter your full name"
              />
            </div>
            
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
                  minLength={6}
                  className={styles.input}
                  placeholder="Create a password"
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
              <small className={styles.hint}>Must be at least 6 characters</small>
            </div>
            
            {/* Confirm password input */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showConfirmPassword ? (
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
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          {/* Link to login page */}
          <div className={styles.footer}>
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
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

export default RegisterPage;
