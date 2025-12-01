/**
 * OrderHistoryPage Component
 * 
 * Dedicated page for viewing complete order history with:
 * - List of all orders with status badges
 * - Product details with links for each order
 * - Download access for digital products in completed orders
 * - Responsive design with better organization than dashboard
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 20 Enhancement)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyHistory } from '../services/orderService';
import { showError } from '../components/NotificationManager';
import { PackageIcon, ChevronRightIcon } from '../components/Icons';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/OrderHistoryPage.module.css';

function OrderHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load order history on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyHistory();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load order history:', err);
        setError('Failed to load order history');
        showError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /**
   * Format date to readable string
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status badge style
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return styles.statusCompleted;
      case 'Processing':
        return styles.statusProcessing;
      case 'Cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  /**
   * Check if order contains digital products
   */
  const hasDigitalProducts = (order) => {
    return order.items && order.items.some(item => item.productType === 'Digital');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.container}>
          <div className={styles.loading}>Loading order history...</div>
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
          <div className={styles.headerContent}>
            <PackageIcon size={40} color="#8b7fc4" />
            <div className={styles.headerText}>
              <h1 className={styles.title}>Order History</h1>
              <p className={styles.subtitle}>
                View all your orders and download digital products
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageIcon size={64} color="#cbd5e0" />
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptyText}>
              Start shopping to see your orders here
            </p>
            <Link to="/shops" className={styles.shopButton}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.orderid} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>Order #{order.orderid}</h3>
                    <p className={styles.orderDate}>{formatDate(order.placedAt)}</p>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={styles.orderTotal}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className={styles.orderItems}>
                  {order.items && order.items.length > 0 ? (
                    <>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.orderItem}>
                          <div className={styles.itemInfo}>
                            <Link 
                              to={`/product/${item.pid}`}
                              className={styles.itemName}
                            >
                              {item.productName || item.productNameSnapshot}
                            </Link>
                            <div className={styles.itemMeta}>
                              <span className={styles.itemQuantity}>
                                Qty: {item.quantity}
                              </span>
                              {item.productType === 'Digital' && (
                                <span className={styles.digitalBadge}>
                                  Digital
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.itemPrice}>
                            ${item.lineTotal.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className={styles.noItems}>No items in this order</p>
                  )}
                </div>

                {/* Order Actions */}
                <div className={styles.orderActions}>
                  <Link 
                    to={`/order-confirmation/${order.orderid}`}
                    className={styles.viewDetailsButton}
                  >
                    View Details
                    <ChevronRightIcon size={16} />
                  </Link>
                  
                  {/* Show download message for completed digital orders */}
                  {order.status === 'Completed' && hasDigitalProducts(order) && (
                    <span className={styles.downloadNotice}>
                      Digital products available for download in order details
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
