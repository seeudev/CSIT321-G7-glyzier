/**
 * SellerOrdersPage Component (Module 13)
 * 
 * This page allows sellers to view and manage orders containing their products.
 * 
 * Functionality:
 * - Display list of orders containing seller's products
 * - Show order details: Order ID, Buyer Name, Total, Status, Date
 * - Expand/collapse order details (items, quantities, delivery address)
 * - Update order status via dropdown (Pending -> Processing -> Shipped -> Delivered)
 * - Simple table layout with accordion-style expansion
 * 
 * Design:
 * - Clean table layout with status badges
 * - Expandable rows showing order items
 * - Status dropdown with valid transitions only
 * - Uses CSS modules for styling
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 13 - Seller Order Management)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { 
    getSellerOrders, 
    updateOrderStatus, 
    getStatusBadgeColor,
    getValidNextStatuses 
} from '../services/sellerOrderService';
import { showSuccess, showError } from '../components/NotificationManager';
import { PackageIcon, ChevronDownIcon, ChevronUpIcon } from '../components/Icons';
import styles from '../styles/pages/SellerOrdersPage.module.css';

/**
 * SellerOrdersPage functional component
 * 
 * @returns {JSX.Element} The seller orders page component
 */
function SellerOrdersPage() {
    const navigate = useNavigate();
    
    // State for orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for expanded orders (accordion)
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    
    // State for status updates
    const [updatingStatus, setUpdatingStatus] = useState(new Map());

    /**
     * Fetch seller orders on component mount
     */
    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Fetch orders from API
     */
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getSellerOrders();
            setOrders(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch seller orders:', err);
            setError(err.message || 'Failed to load orders');
            
            // If user is not a seller, redirect to dashboard
            if (err.message.includes('not a seller')) {
                showError('You must be a seller to access this page');
                navigate('/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle order expansion (show/hide details)
     */
    const toggleOrderExpansion = (orderid) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderid)) {
                newSet.delete(orderid);
            } else {
                newSet.add(orderid);
            }
            return newSet;
        });
    };

    /**
     * Handle status update
     */
    const handleStatusUpdate = async (orderid, newStatus) => {
        try {
            // Mark this order as updating
            setUpdatingStatus(prev => new Map(prev).set(orderid, true));
            
            // Update status via API
            await updateOrderStatus(orderid, newStatus);
            
            // Refresh orders to get updated data
            await fetchOrders();
            
            showSuccess(`Order #${orderid} status updated to ${newStatus}`);
        } catch (err) {
            console.error('Failed to update order status:', err);
            showError(err.message || 'Failed to update order status');
        } finally {
            // Clear updating state
            setUpdatingStatus(prev => {
                const newMap = new Map(prev);
                newMap.delete(orderid);
                return newMap;
            });
        }
    };

    /**
     * Format date for display
     */
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
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
     * Format currency for display
     */
    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className={styles.pageContainer}>
            <Navigation />
            
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <PackageIcon />
                        </div>
                        <div>
                            <h1 className={styles.title}>My Orders</h1>
                            <p className={styles.subtitle}>
                                Manage orders containing your products
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading orders...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>{error}</p>
                        <button 
                            onClick={fetchOrders}
                            className={styles.retryButton}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                    <div className={styles.emptyContainer}>
                        <PackageIcon />
                        <h2>No Orders Yet</h2>
                        <p>Orders containing your products will appear here</p>
                    </div>
                )}

                {/* Orders Table */}
                {!loading && !error && orders.length > 0 && (
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>
                            <div className={styles.orderCount}>
                                {orders.length} order{orders.length !== 1 ? 's' : ''} found
                            </div>
                        </div>

                        <table className={styles.ordersTable}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Buyer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <React.Fragment key={order.orderid}>
                                        {/* Main Row */}
                                        <tr className={styles.orderRow}>
                                            <td className={styles.orderId}>
                                                #{order.orderid}
                                            </td>
                                            <td>{formatDate(order.placedAt)}</td>
                                            <td>{order.userDisplayName || 'Unknown'}</td>
                                            <td className={styles.total}>
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td>
                                                <span 
                                                    className={`${styles.statusBadge} ${styles[getStatusBadgeColor(order.status)]}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                {/* Status Update Dropdown */}
                                                {getValidNextStatuses(order.status).length > 0 ? (
                                                    <select
                                                        className={styles.statusSelect}
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.orderid, e.target.value)}
                                                        disabled={updatingStatus.get(order.orderid)}
                                                    >
                                                        <option value={order.status}>
                                                            {order.status}
                                                        </option>
                                                        {getValidNextStatuses(order.status).map(status => (
                                                            <option key={status} value={status}>
                                                                → {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={styles.noActions}>—</span>
                                                )}
                                            </td>
                                            <td>
                                                {/* Expand/Collapse Button */}
                                                <button
                                                    className={styles.expandButton}
                                                    onClick={() => toggleOrderExpansion(order.orderid)}
                                                    aria-label="Toggle order details"
                                                >
                                                    {expandedOrders.has(order.orderid) ? (
                                                        <ChevronUpIcon />
                                                    ) : (
                                                        <ChevronDownIcon />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded Details Row */}
                                        {expandedOrders.has(order.orderid) && (
                                            <tr className={styles.expandedRow}>
                                                <td colSpan="7">
                                                    <div className={styles.orderDetails}>
                                                        <div className={styles.detailsSection}>
                                                            <h4>Order Items (Your Products)</h4>
                                                            <table className={styles.itemsTable}>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Product</th>
                                                                        <th>Quantity</th>
                                                                        <th>Unit Price</th>
                                                                        <th>Subtotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {order.items && order.items.length > 0 ? (
                                                                        order.items.map(item => (
                                                                            <tr key={item.opid}>
                                                                                <td>{item.productNameSnapshot}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{formatCurrency(item.unitPrice)}</td>
                                                                                <td>{formatCurrency(item.lineTotal)}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="4" className={styles.noItems}>
                                                                                No items found
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {/* Delivery Address */}
                                                        {order.deliveryAddress && (
                                                            <div className={styles.detailsSection}>
                                                                <h4>Delivery Address</h4>
                                                                <p className={styles.address}>
                                                                    {order.deliveryAddress}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SellerOrdersPage;
