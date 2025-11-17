import api from './api';

/**
 * Cart Service - API integration for shopping cart operations
 * 
 * This service provides functions to interact with the cart endpoints.
 * All functions automatically include authentication via the axios interceptor.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */

/**
 * Get the current user's cart
 * 
 * Retrieves the shopping cart with all items, quantities, and totals.
 * 
 * @returns {Promise} Resolves with cart data
 * @throws {Error} If request fails
 */
export const getCart = async () => {
  try {
    const response = await api.get('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Add a product to the cart
 * 
 * Adds a product with the specified quantity to the cart.
 * If the product already exists, the quantity is increased.
 * 
 * @param {number} pid - Product ID
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise} Resolves with success message and updated cart
 * @throws {Error} If product not found or insufficient stock
 */
export const addToCart = async (pid, quantity = 1) => {
  try {
    const response = await api.post('/api/cart/add', { pid, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update cart item quantity
 * 
 * Updates the quantity of a product already in the cart.
 * 
 * @param {number} pid - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Resolves with success message and updated cart
 * @throws {Error} If product not in cart or insufficient stock
 */
export const updateCartItem = async (pid, quantity) => {
  try {
    const response = await api.put(`/api/cart/update/${pid}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Remove a product from the cart
 * 
 * Removes a specific product from the cart.
 * 
 * @param {number} pid - Product ID to remove
 * @returns {Promise} Resolves with success message and updated cart
 * @throws {Error} If product not in cart
 */
export const removeFromCart = async (pid) => {
  try {
    const response = await api.delete(`/api/cart/remove/${pid}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Clear the entire cart
 * 
 * Removes all products from the cart.
 * 
 * @returns {Promise} Resolves with success message and empty cart
 * @throws {Error} If request fails
 */
export const clearCart = async () => {
  try {
    const response = await api.delete('/api/cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get cart item count
 * 
 * Returns the total number of items in the cart (sum of quantities).
 * Used for displaying the badge count in the navbar.
 * 
 * @returns {Promise<number>} Resolves with item count
 */
export const getCartItemCount = async () => {
  try {
    const response = await api.get('/api/cart/count');
    return response.data.count || 0;
  } catch (error) {
    console.error('Error fetching cart count:', error.response?.data || error.message);
    return 0; // Return 0 on error to prevent UI issues
  }
};

/**
 * Place order from cart
 * 
 * Converts all cart items to an order and clears the cart.
 * 
 * @returns {Promise} Resolves with order details
 * @throws {Error} If cart is empty or validation fails
 */
export const placeOrderFromCart = async () => {
  try {
    const response = await api.post('/api/orders/place-from-cart');
    return response.data;
  } catch (error) {
    console.error('Error placing order from cart:', error.response?.data || error.message);
    throw error;
  }
};
