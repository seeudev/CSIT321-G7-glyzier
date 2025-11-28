/**
 * Seller Order Service - API service for seller order management operations
 * 
 * This service provides methods for sellers to manage orders containing their products.
 * All endpoints require authentication via JWT token (automatically handled by api.js).
 * 
 * Module 13 implementation includes:
 * - Fetching orders containing seller's products
 * - Updating order status (Pending -> Processing -> Shipped -> Delivered)
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 13 - Seller Order Management)
 */

import api from './api';

/**
 * Get orders containing seller's products
 * 
 * Endpoint: GET /api/orders/seller/my-orders
 * Access: Authenticated sellers only
 * 
 * Returns all orders that contain at least one product belonging to the seller.
 * Each order includes:
 * - Order ID
 * - Buyer name
 * - Total amount
 * - Status
 * - Timestamp when placed
 * - Items (only seller's products shown)
 * - Delivery address
 * 
 * @returns {Promise<Array>} Promise resolving to array of order objects
 * @throws {Error} If request fails or user is not a seller
 * 
 * @example
 * try {
 *   const orders = await getSellerOrders();
 *   console.log(`You have ${orders.length} orders to fulfill`);
 * } catch (error) {
 *   console.error('Failed to fetch orders:', error.message);
 * }
 */
export const getSellerOrders = async () => {
    try {
        const response = await api.get('/api/orders/seller/my-orders');
        return response.data;
    } catch (error) {
        // Extract error message from response if available
        const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch seller orders';
        throw new Error(errorMessage);
    }
};

/**
 * Update order status
 * 
 * Endpoint: PUT /api/orders/{orderid}/status
 * Access: Authenticated sellers only (must own at least one product in the order)
 * 
 * Allows sellers to update the status of orders containing their products.
 * Valid status values:
 * - "Pending" - Order placed, awaiting processing
 * - "Processing" - Order is being prepared
 * - "Shipped" - Order has been shipped to customer
 * - "Delivered" - Order has been delivered
 * - "Cancelled" - Order was cancelled
 * 
 * @param {number} orderid - The order ID to update
 * @param {string} status - The new status value
 * @returns {Promise<Object>} Promise resolving to updated order object
 * @throws {Error} If request fails, user is not a seller, or seller doesn't own products in order
 * 
 * @example
 * try {
 *   const updatedOrder = await updateOrderStatus(123, 'Shipped');
 *   console.log('Order status updated:', updatedOrder.status);
 * } catch (error) {
 *   console.error('Failed to update status:', error.message);
 * }
 */
export const updateOrderStatus = async (orderid, status) => {
    try {
        const response = await api.put(`/api/orders/${orderid}/status`, { status });
        return response.data.order;
    } catch (error) {
        // Extract error message from response if available
        const errorMessage = error.response?.data?.error || error.message || 'Failed to update order status';
        throw new Error(errorMessage);
    }
};

/**
 * Helper function to get status badge color
 * 
 * Returns a CSS class name for styling status badges based on order status.
 * This is a frontend helper to maintain consistent status display across components.
 * 
 * @param {string} status - The order status
 * @returns {string} CSS class name for badge color
 * 
 * @example
 * const badgeColor = getStatusBadgeColor(order.status);
 * <span className={`badge ${badgeColor}`}>{order.status}</span>
 */
export const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'status-pending';
        case 'Processing':
            return 'status-processing';
        case 'Shipped':
            return 'status-shipped';
        case 'Delivered':
            return 'status-delivered';
        case 'Cancelled':
            return 'status-cancelled';
        default:
            return 'status-default';
    }
};

/**
 * Helper function to get valid next statuses
 * 
 * Returns an array of valid status transitions based on the current status.
 * This prevents invalid status changes (e.g., Delivered -> Pending).
 * 
 * @param {string} currentStatus - The current order status
 * @returns {Array<string>} Array of valid next status values
 * 
 * @example
 * const validStatuses = getValidNextStatuses('Pending');
 * // Returns: ['Processing', 'Cancelled']
 */
export const getValidNextStatuses = (currentStatus) => {
    // Define valid status transitions
    const statusTransitions = {
        'Pending': ['Processing', 'Cancelled'],
        'Processing': ['Shipped', 'Cancelled'],
        'Shipped': ['Delivered'],
        'Delivered': [], // Terminal state
        'Cancelled': [] // Terminal state
    };
    
    return statusTransitions[currentStatus] || [];
};

// Export all functions as default for convenience
export default {
    getSellerOrders,
    updateOrderStatus,
    getStatusBadgeColor,
    getValidNextStatuses
};
