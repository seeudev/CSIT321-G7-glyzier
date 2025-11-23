import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { updateCartItem, removeFromCart, clearCart, placeOrderFromCart } from '../services/cartService';
import { showSuccess, showError, showConfirm } from '../components/NotificationManager';
import { CartIcon, ImageIcon, AlertIcon, TrashIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/CartPage.module.css';

/**
 * CartPage Component - Shopping cart with checkout
 * 
 * This page displays the user's shopping cart with:
 * - List of cart items with product details
 * - Quantity selectors (dropdown)
 * - Remove item buttons
 * - Clear cart button
 * - Order summary with totals
 * - Checkout button
 * 
 * Features:
 * - Real-time price comparison (snapshot vs current)
 * - Stock warnings
 * - Cart validation before checkout
 * - Auto-redirect to dashboard after order
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
const CartPage = () => {
  const { cart, refreshCart, updateCartCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState('');

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await refreshCart();
      setLoading(false);
    };
    loadCart();
  }, []);

  /**
   * Handle quantity change
   * 
   * Updates the quantity of a cart item via dropdown selector.
   */
  const handleQuantityChange = async (pid, newQuantity) => {
    try {
      setError('');
      await updateCartItem(pid, parseInt(newQuantity));
      await refreshCart();
      await updateCartCount();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  /**
   * Handle remove item
   * 
   * Removes a product from the cart.
   */
  const handleRemoveItem = async (pid) => {
    try {
      setError('');
      await removeFromCart(pid);
      await refreshCart();
      await updateCartCount();
      showSuccess('Item removed from cart');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to remove item');
    }
  };

  /**
   * Handle clear cart
   * 
   * Removes all items from the cart with confirmation.
   */
  const handleClearCart = async () => {
    const confirmed = await showConfirm('Are you sure you want to clear your cart?');
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await clearCart();
      await refreshCart();
      await updateCartCount();
      showSuccess('Cart cleared successfully');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to clear cart');
    }
  };

  /**
   * Handle checkout
   * 
   * Places an order from the cart and redirects to dashboard.
   */
  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    // Check for stock issues
    const outOfStock = cart.items.find(item => item.availableStock < item.quantity);
    if (outOfStock) {
      setError(`Insufficient stock for ${outOfStock.productname}`);
      return;
    }

    try {
      setProcessingCheckout(true);
      setError('');
      
      const result = await placeOrderFromCart();
      
      // Show success message
      showSuccess(`Order placed successfully! Order ID: ${result.order.orderid}`);
      
      // Update cart count and refresh
      await updateCartCount();
      await refreshCart();
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setProcessingCheckout(false);
    }
  };

  /**
   * Render price change indicator
   * 
   * Shows if the current price differs from the snapshot price.
   */
  const renderPriceChange = (item) => {
    if (!item.currentPrice || !item.priceSnapshot) return null;
    
    const diff = item.currentPrice - item.priceSnapshot;
    if (Math.abs(diff) < 0.01) return null; // No significant change

    if (diff > 0) {
      return (
        <span className={`${styles.priceChange} ${styles.priceIncreased}`}>
          +${diff.toFixed(2)}
        </span>
      );
    } else {
      return (
        <span className={`${styles.priceChange} ${styles.priceDecreased}`}>
          ${diff.toFixed(2)}
        </span>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>
            Loading your cart...
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}><CartIcon size={80} color="#95a5a6" /></div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/" className={styles.shopButton}>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.errorBanner}>
            <AlertIcon size={20} color="#d32f2f" style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className={styles.cartItems}>
          {cart.items.map((item) => (
            <div key={item.cartItemid} className={styles.cartItem}>
              {/* Product image */}
              <div className={styles.itemImage}>
                {item.screenshotPreviewUrl ? (
                  <img src={item.screenshotPreviewUrl} alt={item.productname} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <ImageIcon size={48} color="#8b7fc4" />
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.productname}</h3>
                
                {item.availableStock < item.quantity && (
                  <div className={styles.stockWarning}>
                    <AlertIcon size={14} color="#ff9800" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Only {item.availableStock} available
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              <div className={styles.itemQuantity}>
                <label htmlFor={`qty-${item.pid}`} className={styles.qtyLabel}>Item Qty</label>
                <select
                  id={`qty-${item.pid}`}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.pid, e.target.value)}
                  className={styles.qtySelect}
                >
                  {[...Array(Math.min(item.availableStock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className={styles.itemPrice}>
                ₱{item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemoveItem(item.pid)}
                className={styles.removeButton}
                aria-label="Remove item"
              >
                <TrashIcon size={20} color="#d32f2f" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom bar with total and checkout */}
        <div className={styles.bottomBar}>
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalPrice}>
              ₱{cart.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processingCheckout}
            className={styles.checkoutButton}
          >
            {processingCheckout ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
