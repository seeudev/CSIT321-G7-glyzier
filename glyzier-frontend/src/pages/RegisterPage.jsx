/**
 * RegisterPage Component
 * 
 * This page provides a registration form for new users.
 * 
 * Functionality:
 * - Display name, email, and password input fields
 * - Form validation
 * - Calls the backend API to create a new user account
 * - Redirects to login page after successful registration
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
 * RegisterPage functional component
 * 
 * @returns {JSX.Element} The register page component
 */
function RegisterPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    displayname: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    setLoading(true);
    
    // Placeholder - will be implemented in Module 6
    console.log('Registration attempt with:', {
      displayname: formData.displayname,
      email: formData.email,
      password: formData.password,
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setError('Registration functionality will be implemented in Module 6');
    }, 1000);
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Create Your Account</h1>
        <p style={styles.subtitle}>Join Glyzier to start buying or selling artwork</p>
        
        {/* Error message display */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        {/* Registration form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Display name input */}
          <div style={styles.formGroup}>
            <label htmlFor="displayname" style={styles.label}>Display Name</label>
            <input
              type="text"
              id="displayname"
              name="displayname"
              value={formData.displayname}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
              style={styles.input}
              placeholder="Enter your display name"
            />
            <small style={styles.hint}>This name will be visible to other users</small>
          </div>
          
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
              minLength={6}
              style={styles.input}
              placeholder="Enter your password"
            />
            <small style={styles.hint}>Minimum 6 characters</small>
          </div>
          
          {/* Confirm password input */}
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Re-enter your password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        {/* Link to login page */}
        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Login here
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
    maxWidth: '500px',
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
    gap: '18px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
  hint: {
    color: '#888',
    fontSize: '0.85em',
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

export default RegisterPage;
