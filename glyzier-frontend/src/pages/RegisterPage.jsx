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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './RegisterPage.module.css';

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
          
          <h1 className={styles.title}>Sign up</h1>
          <p className={styles.subtitle}>Sign up to enjoy the feature of Revolutie</p>
          
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
              <label htmlFor="displayname" className={styles.label}>Your Name</label>
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
                placeholder="Juan Dela Cruz"
              />
            </div>
            
            {/* Date of Birth input */}
            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            
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
                placeholder="juan.delacruz@cit.edu"
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
                  placeholder="Password"
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
              <small className={styles.hint}>Minimum 6 characters</small>
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
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Creating Account...' : 'Sign up'}
            </button>
            
            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>
            
            {/* Google Sign Up */}
            <button type="button" className={styles.googleButton}>
              <span className={styles.googleIcon}>G</span>
              Continue with Google
            </button>
          </form>
          
          {/* Link to login page */}
          <div className={styles.footer}>
            <p>
              Already have an account?? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Decorative art background */}
      <div className={styles.artSection}>
        <div className={styles.artContent}>
          <h2 className={styles.artTitle}>Random Arts Here</h2>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
