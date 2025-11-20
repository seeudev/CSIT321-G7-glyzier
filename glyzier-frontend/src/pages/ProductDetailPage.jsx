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
import { placeOrder } from '../services/orderService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { showSuccess, showError, showInfo, showConfirm } from '../components/NotificationManager';
import Navigation from '../components/Navigation';
import styles from './ProductDetailPage.module.css';

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
  const [contentVisible, setContentVisible] = useState(true);
  
  /**
   * Fetch product details on component mount
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
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
   * Handle Buy Now button click
   */
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showInfo('Please login to purchase products');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    if (orderLoading) return;
    
    const confirmed = await showConfirm(`Purchase ${product.productname} for ₱${product.price?.toFixed(2)}?`);
    if (!confirmed) return;
    
    try {
      setOrderLoading(true);
      
      const orderData = {
        items: [{
          pid: product.pid,
          quantity: 1
        }]
      };
      
      const result = await placeOrder(orderData);
      
      showSuccess(`Order #${result.order.orderid} placed successfully! Total: ₱${result.order.total.toFixed(2)}`);
      
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.response?.data?.error || 'Failed to place order. Please try again.';
      showError(errorMessage);
    } finally {
      setOrderLoading(false);
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
      <Navigation />
      
      <div className={styles.container}>
        <div className={styles.productLayout}>
          {/* Left Side - Product Image */}
          <div className={styles.imageSection}>
            <div className={styles.productImage}>
              {product.screenshotPreviewUrl ? (
                <img 
                  src={product.screenshotPreviewUrl} 
                  alt={product.productname}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon size={64} color="#8b7fc4" />
                  <p>No Image Available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Product Information */}
          <div className={styles.infoSection}>
            {/* Seller & Shop Name */}
            <div className={styles.sellerInfo}>
              <div className={styles.sellerLabel}>seller's name</div>
              <div className={styles.shopName}>{product.sellerName || 'Unknown Shop'}</div>
            </div>
            
            {/* Product Name */}
            <h1 className={styles.productName}>{product.productname}</h1>
            
            {/* Price */}
            <div className={styles.priceSection}>
              <span className={styles.price}>₱ {product.price ? product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
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
    </div>
  );
}

export default ProductDetailPage;
