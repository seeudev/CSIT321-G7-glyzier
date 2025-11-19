/**
 * ProductDetailPage Component
 * 
 * Redesigned product detail page following UI wireframe with professional gradient theme.
 * Features:
 * - Modern glassmorphism design
 * - Seller name and shop name display
 * - Product description
 * - Rating and sold count
 * - Variant selection (simulated)
 * - Add to cart and buy now functionality
 * 
 * @author Glyzier Team
 * @version 2.0 (Module 9 - Wireframe Implementation)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { placeOrder } from '../services/orderService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  const [selectedVariant, setSelectedVariant] = useState(0); // For demo purposes
  
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
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    
    if (cartLoading) return;
    
    try {
      setCartLoading(true);
      await addToCart(product.pid, 1);
      await updateCartCount();
      
      const goToCart = window.confirm(
        `${product.productname} added to cart!\n\nWould you like to view your cart?`
      );
      
      if (goToCart) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add to cart. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setCartLoading(false);
    }
  };

  /**
   * Handle Buy Now button click
   */
  const handleBuyNow = async () {
    if (!isAuthenticated) {
      alert('Please login to purchase products.');
      navigate('/login');
      return;
    }
    
    if (orderLoading) return;
    
    try {
      setOrderLoading(true);
      
      const orderData = {
        items: [{
          pid: product.pid,
          quantity: 1
        }]
      };
      
      const result = await placeOrder(orderData);
      
      alert(`Order placed successfully! Order #${result.order.orderid}\n` +
            `Total: ₱${result.order.total.toFixed(2)}\n\n` +
            `You will be redirected to your dashboard.`);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.response?.data?.error || 'Failed to place order. Please try again.';
      alert(`Order failed: ${errorMessage}`);
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
  
  // Demo variants (simulated)
  const variants = [
    { name: 'White', color: '#ffffff' },
    { name: 'Red', color: '#ff0000' },
    { name: 'Blue', color: '#0000ff' },
  ];

  const isOutOfStock = !product.qtyonhand || product.qtyonhand <= 0;
  const soldCount = Math.floor(Math.random() * 200) + 50; // Simulated sold count
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // Simulated rating 3.5-5.0
  
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
                  <span>🎨</span>
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
            
            {/* Price, Sold Count & Rating */}
            <div className={styles.priceRatingRow}>
              <span className={styles.price}>₱ {product.price ? product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
              <span className={styles.soldCount}>{soldCount} sold</span>
              <div className={styles.rating}>
                <span className={styles.ratingStar}>★</span>
                <span>{rating}</span>
              </div>
            </div>
            
            {/* Product Description */}
            <div className={styles.descriptionSection}>
              <div className={styles.descriptionTitle}>Product Description:</div>
              <div className={styles.descriptionText}>
                {product.productdesc || 'This is a temporary product description. It is a great place to add more details about your product, such as its features, materials, and benefits.'}
              </div>
            </div>
            
            {/* Variant Selection (Simulated) */}
            <div className={styles.variantSection}>
              <div className={styles.variantLabel}>Variant: {variants[selectedVariant].name}</div>
              <div className={styles.variantOptions}>
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className={`${styles.variantOption} ${selectedVariant === index ? styles.active : ''}`}
                    style={{ 
                      backgroundColor: variant.color,
                      border: variant.color === '#ffffff' ? '2px solid #e0e0e0' : 'none'
                    }}
                    onClick={() => setSelectedVariant(index)}
                    title={variant.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Stock Status */}
            <div>
              <span className={`${styles.stockBadge} ${isOutOfStock ? styles.outOfStock : styles.inStock}`}>
                {isOutOfStock ? '❌ Out of Stock' : `✓ In Stock (${product.qtyonhand} available)`}
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
