/**
 * Order Service
 * 
 * This service handles all order-related API calls to the backend.
 * It provides functions to:
 * - Place new orders (protected endpoint - requires authentication)
 * - Fetch user's order history (protected endpoint - requires authentication)
 * - Fetch specific order details (protected endpoint - requires authentication)
 * 
 * All functions use the pre-configured axios instance from api.js
 * which automatically handles base URL and authentication tokens.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 8)
 */

import api from './api';

/**
 * Place Order
 * 
 * Creates a new order with the specified items.
 * This is a protected endpoint - requires JWT authentication.
 * 
 * The backend will:
 * 1. Validate all product IDs exist
 * 2. Check inventory availability for each item
 * 3. Calculate total price (snapshots current prices)
 * 4. Create order and order_products records
 * 5. Decrement inventory quantities
 * 
 * @param {Object} orderData - Order details
 * @param {Array<{pid: number, quantity: number}>} orderData.items - Array of items to order
 * @returns {Promise<Object>} Order confirmation with order details
 * @throws {Error} If validation fails or inventory insufficient
 * 
 * @example
 * const orderData = {
 *   items: [
 *     { pid: 1, quantity: 2 },
 *     { pid: 3, quantity: 1 }
 *   ]
 * };
 * const result = await placeOrder(orderData);
 * // Returns: { message: "Order placed successfully", order: {...} }
 */
export const placeOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/place', orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    
    // Extract error message from backend response
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || error.response.data.message || 'Failed to place order';
      throw new Error(errorMessage);
    }
    
    throw error;
  }
};

/**
 * Get My Order History
 * 
 * Retrieves the complete order history for the authenticated user.
 * This is a protected endpoint - requires JWT authentication.
 * 
 * Returns a list of orders with basic details. For full order information
 * including items, use getOrderById().
 * 
 * @returns {Promise<Array>} Array of order summary objects
 * @throws {Error} If the API request fails
 * 
 * @example
 * const orders = await getMyHistory();
 * // Returns: [
 * //   {
 * //     orderid: 1,
 * //     total: 94.98,
 * //     status: "Completed",
 * //     placedAt: "2025-10-20T16:00:00.000+00:00",
 * //     itemCount: 2
 * //   },
 * //   ...
 * // ]
 */
export const getMyHistory = async () => {
  try {
    const response = await api.get('/orders/my-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

/**
 * Get Order By ID
 * 
 * Retrieves detailed information about a specific order.
 * This is a protected endpoint - requires JWT authentication.
 * Only the order owner can view the order details (enforced by backend).
 * 
 * @param {number|string} orderid - The order ID
 * @returns {Promise<Object>} Detailed order object with items and user info
 * @throws {Error} If the API request fails or user doesn't own the order
 * 
 * @example
 * const order = await getOrderById(1);
 * // Returns: {
 * //   orderid: 1,
 * //   total: 94.98,
 * //   status: "Completed",
 * //   placedAt: "2025-10-20T16:00:00.000+00:00",
 * //   user: {...},
 * //   items: [...]
 * // }
 */
export const getOrderById = async (orderid) => {
  try {
    const response = await api.get(`/orders/${orderid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderid}:`, error);
    
    // Handle 403 Forbidden (user doesn't own this order)
    if (error.response && error.response.status === 403) {
      throw new Error('You do not have permission to view this order');
    }
    
    throw error;
  }
};
