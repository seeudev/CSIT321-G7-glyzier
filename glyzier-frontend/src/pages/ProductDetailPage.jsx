/**
 * ProductDetailPage Component
 * 
 * Product detail page with elegant animations and real database data.
 * Features:
 * - Modern glassmorphism design with fade-in animations
 * - Seller name and shop name display
 * - Product description
 * - Real stock information from database
 * - Beautiful notification system instead of alerts
 * - Smooth transitions and loading states
 * 
 * @author Glyzier Team
 * @version 3.0 (Module 9 - Enhanced UX)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { createOrGetConversation } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { showSuccess, showError, showInfo, showConfirm } from '../components/NotificationManager';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import FavoriteButton from '../components/FavoriteButton';
import { extractColorsFromImage, enhanceColorsForAurora } from '../utils/colorExtractor';
import styles from '../styles/pages/ProductDetailPage.module.css';

function ProductDetailPage() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { updateCartCount } = useCart();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [contactingLoading, setContactingLoading] = useState(false);
  const [auroraColors, setAuroraColors] = useState(['#c9bfe8', '#b8afe8', '#9b8dd4']);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  /**
   * Fetch product details on component mount
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setImageLoaded(false);
        const data = await getProductById(pid);
        console.log('Product data received:', data);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. The product may not exist.');
        showError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [pid]);

  /**
   * Update Aurora colors when product image loads
   */
  useEffect(() => {
    const updateAuroraColors = async () => {
      if (product?.screenshotPreviewUrl && imageLoaded) {
        const extractedColors = await extractColorsFromImage(product.screenshotPreviewUrl);
        const enhancedColors = enhanceColorsForAurora(extractedColors);
        setAuroraColors(enhancedColors);
      }
    };
    
    updateAuroraColors();
  }, [product, imageLoaded]);
  
  /**
   * Handle Add to Cart button click
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to add items to your cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (cartLoading) return;
    
    try {
      setCartLoading(true);
      await addToCart(product.pid, 1);
      await updateCartCount();
      
      showSuccess(`${product.productname} added to cart!`);
      
      // Ask if user wants to go to cart
      const goToCart = await showConfirm('Would you like to view your cart?');
      if (goToCart) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      showError(errorMessage);
    } finally {
      setCartLoading(false);
    }
  };

  /**
   * Handle Buy Now button click (Module 12: Updated for checkout flow)
   * Adds product to cart and redirects to checkout page
   */
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to purchase products');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (orderLoading) return;
    
    try {
      setOrderLoading(true);
      
      // Add product to cart
      await addToCart(product.pid, 1);
      await updateCartCount();
      
      showSuccess('Added to cart! Redirecting to checkout...');
      
      // Redirect to checkout page
      setTimeout(() => navigate('/checkout'), 1000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      showError(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  /**
   * Handle Contact Seller button click (Module 16: Messaging)
   * 
   * Creates or gets an existing conversation with the seller,
   * then redirects to the message thread page.
   * 
   * Logic:
   * - Check if user is authenticated
   * - Get seller's user ID from product data
   * - Call API to create/get conversation
   * - Redirect to message thread
   */
  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to contact the seller');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (contactingLoading) return;

    // Get seller's user ID from the product data
    const sellerUserId = product.sellerUserId;
    if (!sellerUserId) {
      showError('Unable to contact seller. Seller information not available.');
      return;
    }

    try {
      setContactingLoading(true);
      
      // Create or get conversation with the seller
      const conversation = await createOrGetConversation(sellerUserId);
      
      showSuccess('Opening conversation...');
      
      // Redirect to the message thread
      setTimeout(() => navigate(`/messages/${conversation.id}`), 500);
    } catch (err) {
      console.error('Error contacting seller:', err);
      const errorMessage = err.response?.data?.error || 'Failed to start conversation. Please try again.';
      showError(errorMessage);
    } finally {
      setContactingLoading(false);
    }
  };
  
  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>⏳ Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  /**
   * Render error state
   */
  if (error || !product) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Product not found'}</p>
            <a href="/" className={styles.backButton}>
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Backend sends 'unlimited' field (Jackson removes 'is' prefix from boolean fields)
  const isUnlimited = product.unlimited === true || product.isUnlimited === true;
  const isOutOfStock = !isUnlimited && (!product.availableQuantity || product.availableQuantity <= 0);
  
  return (
    <div className={styles.page}>
      <Aurora 
        colorStops={auroraColors}
        amplitude={1.0}
        blend={0.5}
        speed={0.3}
      />
      <Navigation />
      
      <div className={styles.container}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButtonTop}
          aria-label="Go back to previous page"
        >
          <span className={styles.backArrow}>←</span>
          <span className={styles.backText}>Back</span>
        </button>
        
        <div className={styles.productLayout}>
          {/* Left Side - Product Image */}
          <div className={styles.imageSection}>
            <div className={`${styles.productImage} ${imageLoaded ? styles.imageLoaded : ''}`}>
              {product.screenshotPreviewUrl ? (
                <img 
                  src={product.screenshotPreviewUrl} 
                  alt={product.productname}
                  onLoad={() => setImageLoaded(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span style={{ fontSize: '4rem' }}>🖼️</span>
                  <p>No Image Available</p>
                </div>
              )}
              
              {/* Favorite Button - Module 10 */}
              <FavoriteButton 
                productId={product.pid} 
                className={styles.favoriteButtonOverlay}
              />
            </div>
          </div>
          
          {/* Right Side - Product Information */}
          <div className={styles.infoSection}>
            {/* Seller & Shop Name */}
            <div className={styles.sellerInfo}>
              <div className={styles.sellerLabel}>
                {product.sellerDisplayName || 'Unknown Seller'}
              </div>
              <div className={styles.shopName}>{product.sellerName || 'Unknown Shop'}</div>
            </div>
            
            {/* Product Name */}
            <h1 className={styles.productName}>{product.productname}</h1>
            
            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.price}>$ {product.price ? product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
              <span className={styles.productType}>{product.type}</span>
            </div>
            
            {/* Product Description */}
            <div className={styles.descriptionSection}>
              <div className={styles.descriptionTitle}>Product Description:</div>
              <div className={styles.descriptionText}>
                {product.productdesc || 'No description available for this product.'}
              </div>
            </div>
            
            {/* Stock Status */}
            <div className={styles.stockSection}>
              <span className={`${styles.stockBadge} ${isOutOfStock ? styles.outOfStock : styles.inStock}`}>
                {isOutOfStock ? '❌ Out of Stock' : isUnlimited ? '✓ Unlimited' : `✓ In Stock (${product.availableQuantity} available)`}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className={styles.actionSection}>
              <button 
                onClick={handleAddToCart}
                className={styles.addToCartButton}
                disabled={cartLoading || isOutOfStock}
              >
                {cartLoading ? '⏳ Adding...' : 'Add to Cart'}
              </button>

              <button 
                onClick={handleBuyNow}
                className={styles.buyNowButton}
                disabled={orderLoading || isOutOfStock}
              >
                {orderLoading ? '⏳ Processing...' : 'Buy Now'}
              </button>
            </div>
            
            {!isAuthenticated && (
              <p className={styles.loginNote}>
                * You must be logged in to add to cart or purchase
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Contact Seller Button - Module 16 */}
      {product && product.sellerUserId && (
        <button
          className={styles.floatingContactButton}
          onClick={handleContactSeller}
          disabled={contactingLoading}
          title="Contact Seller"
        >
          {contactingLoading ? (
            <span>⏳</span>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>
              </svg>
              <span className={styles.floatingButtonText}>Contact Seller</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default ProductDetailPage;
