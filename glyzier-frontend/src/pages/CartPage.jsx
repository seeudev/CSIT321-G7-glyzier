import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { updateCartItem, removeFromCart, clearCart, placeOrderFromCart } from '../services/cartService';
import styles from './CartPage.module.css';

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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove item');
    }
  };

  /**
   * Handle clear cart
   * 
   * Removes all items from the cart with confirmation.
   */
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      setError('');
      await clearCart();
      await refreshCart();
      await updateCartCount();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clear cart');
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
      alert(`Order placed successfully! Order ID: ${result.order.orderid}`);
      
      // Update cart count and refresh
      await updateCartCount();
      await refreshCart();
      
      // Redirect to dashboard
      navigate('/dashboard');
      
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
      <div className={styles.cartPage}>
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
      <div className={styles.cartPage}>
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛒</div>
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
    <div className={styles.cartPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>
            {cart.totalItemCount} {cart.totalItemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Cart content */}
        <div className={styles.cartContent}>
          {/* Cart items list */}
          <div className={styles.cartItems}>
            <div className={styles.itemsHeader}>
              <h2 className={styles.itemsTitle}>Cart Items</h2>
              <button 
                onClick={handleClearCart}
                className={styles.clearButton}
              >
                Clear Cart
              </button>
            </div>

            {cart.items.map((item) => (
              <div key={item.cartItemid} className={styles.cartItem}>
                {/* Product image placeholder */}
                <div className={styles.itemImage}>
                  🎨
                </div>

                {/* Product details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.productname}</h3>
                  
                  <div className={styles.itemMeta}>
                    <span className={styles.itemType}>{item.type}</span>
                    <span className={styles.itemSeller}>
                      by <Link to={`/sellers/${item.sellerId}`} className={styles.sellerLink}>
                        {item.sellerName}
                      </Link>
                    </span>
                  </div>

                  <div className={styles.priceInfo}>
                    <span className={styles.itemPrice}>
                      ${item.priceSnapshot.toFixed(2)} each
                    </span>
                    {renderPriceChange(item)}
                  </div>

                  {item.availableStock < item.quantity && (
                    <div className={styles.stockWarning}>
                      ⚠️ Only {item.availableStock} available
                    </div>
                  )}
                </div>

                {/* Item actions */}
                <div className={styles.itemActions}>
                  {/* Quantity selector */}
                  <div className={styles.quantitySelector}>
                    <label htmlFor={`qty-${item.pid}`} className={styles.quantityLabel}>
                      Qty:
                    </label>
                    <select
                      id={`qty-${item.pid}`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.pid, e.target.value)}
                      className={styles.quantitySelect}
                    >
                      {[...Array(Math.min(item.availableStock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveItem(item.pid)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>

                  {/* Line total */}
                  <div className={styles.lineTotal}>
                    ${item.lineTotal.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal:</span>
              <span className={styles.summaryValue}>
                ${cart.totalPrice.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Shipping:</span>
              <span className={styles.summaryValue}>
                Calculated at checkout
              </span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processingCheckout}
              className={styles.checkoutButton}
            >
              {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link to="/" className={styles.continueButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
