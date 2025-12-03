import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import authService from '../services/authService';
import styles from '../styles/pages/ForgotPasswordPage.module.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setCarouselProducts(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch carousel products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (carouselProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselProducts.length]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess('A 6-digit code has been sent to your email');
      setCooldown(90);
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logo}>Glyzier</div>
          
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>Enter your email to receive a reset code</p>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className={styles.submitButton}
            >
              {loading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Reset Code'}
            </button>
          </form>
          
          <div className={styles.footer}>
            <p>
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      
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

export default ForgotPasswordPage;

