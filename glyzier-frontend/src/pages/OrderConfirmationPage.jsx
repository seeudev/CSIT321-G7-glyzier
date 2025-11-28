import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { CheckCircleIcon, AlertIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/OrderConfirmationPage.module.css';

/**
 * OrderConfirmationPage Component - Order confirmation and summary
 * 
 * This page displays order confirmation details after successful checkout:
 * - Order number
 * - Items purchased with quantities and prices
 * - Total amount
 * - Delivery address
 * - Order status
 * - Back to home button
 * 
 * Features:
 * - Fetches order details by ID from URL params
 * - Displays complete order summary
 * - Shows success confirmation
 * - Provides navigation back to home
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 12)
 */
const OrderConfirmationPage = () => {
  const { orderid } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load order details on mount
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderid);
        setOrder(data);
      } catch (err) {
        console.error('Error loading order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderid) {
      loadOrder();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [orderid]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Loading order details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <AlertIcon size={48} color="#f44336" />
            <h2 className={styles.errorTitle}>Error</h2>
            <p className={styles.errorMessage}>{error}</p>
            <Link to="/" className={styles.homeButton}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className={styles.page}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Success header */}
        <div className={styles.successHeader}>
          <CheckCircleIcon size={64} color="#4caf50" />
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successSubtitle}>
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order details card */}
        <div className={styles.orderCard}>
          {/* Order info */}
          <div className={styles.orderHeader}>
            <div className={styles.orderInfo}>
              <span className={styles.orderLabel}>Order Number:</span>
              <span className={styles.orderNumber}>#{order.orderid}</span>
            </div>
            <div className={styles.orderInfo}>
              <span className={styles.orderLabel}>Status:</span>
              <span className={styles.orderStatus}>{order.status}</span>
            </div>
            <div className={styles.orderInfo}>
              <span className={styles.orderLabel}>Order Date:</span>
              <span className={styles.orderDate}>
                {new Date(order.placedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Items section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Items Purchased</h2>
            <div className={styles.itemsList}>
              {order.items && order.items.map((item) => (
                <div key={item.orderProductid} className={styles.orderItem}>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>{item.productNameSnapshot}</span>
                    <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                  </div>
                  <div className={styles.itemPricing}>
                    <span className={styles.itemUnitPrice}>
                      ₱{item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                    </span>
                    <span className={styles.itemLineTotal}>
                      ₱{item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address section */}
          {order.deliveryAddress && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Delivery Address</h2>
              <div className={styles.addressBox}>
                <pre className={styles.addressText}>{order.deliveryAddress}</pre>
              </div>
            </div>
          )}

          {/* Order total */}
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Order Total:</span>
            <span className={styles.totalAmount}>
              ₱{order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            Back to Home
          </Link>
          <Link to="/dashboard" className={styles.dashboardButton}>
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
