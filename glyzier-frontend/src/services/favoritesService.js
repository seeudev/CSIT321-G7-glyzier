import api from './api';

/**
 * Favorites Service
 * 
 * API integration for favorites/wishlist functionality.
 * Handles communication with /api/favorites endpoints.
 * All requests require authentication (JWT token auto-attached by axios interceptor).
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */

/**
 * Get All User Favorites
 * 
 * Fetches all products favorited by the authenticated user.
 * Returns complete product information including seller details.
 * 
 * @returns {Promise<Array>} Array of favorite product objects
 * @throws {Error} If request fails or user not authenticated
 */
export const getAllFavorites = async () => {
  try {
    const response = await api.get('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

/**
 * Add Product to Favorites
 * 
 * Adds a product to user's favorites/wishlist.
 * Idempotent - returns existing favorite if already favorited.
 * 
 * @param {number} productId - ID of the product to favorite
 * @returns {Promise<Object>} Response with message and favorite details
 * @throws {Error} If request fails or product not found
 */
export const addToFavorites = async (productId) => {
  try {
    const response = await api.post(`/api/favorites/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Remove Product from Favorites
 * 
 * Removes a product from user's favorites/wishlist.
 * 
 * @param {number} productId - ID of the product to unfavorite
 * @returns {Promise<Object>} Success message
 * @throws {Error} If request fails
 */
export const removeFromFavorites = async (productId) => {
  try {
    const response = await api.delete(`/api/favorites/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Check if Product is Favorited
 * 
 * Checks if a specific product is in user's favorites.
 * Useful for displaying heart icon state on product cards.
 * 
 * @param {number} productId - ID of the product to check
 * @returns {Promise<boolean>} True if favorited, false otherwise
 * @throws {Error} If request fails
 */
export const checkFavoriteStatus = async (productId) => {
  try {
    const response = await api.get(`/api/favorites/check/${productId}`);
    console.log(`Favorite status response for product ${productId}:`, response.data);
    // Handle both boolean and object response formats
    if (typeof response.data === 'boolean') {
      return response.data;
    }
    // Check for 'favorited' field (what backend actually sends)
    if (response.data && typeof response.data.favorited === 'boolean') {
      return response.data.favorited;
    }
    // Fallback to 'isFavorited' for backwards compatibility
    if (response.data && typeof response.data.isFavorited === 'boolean') {
      return response.data.isFavorited;
    }
    return false;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false; // Default to not favorited on error
  }
};

/**
 * Get Favorites Count
 * 
 * Returns total count of user's favorited products.
 * Can be used for navbar badge display.
 * 
 * @returns {Promise<number>} Count of favorites
 * @throws {Error} If request fails
 */
export const getFavoritesCount = async () => {
  try {
    const response = await api.get('/api/favorites/count');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    return 0; // Default to 0 on error
  }
};

/**
 * Toggle Favorite Status
 * 
 * Helper function to toggle favorite status (add if not favorited, remove if favorited).
 * Useful for heart icon click handlers.
 * 
 * @param {number} productId - ID of the product to toggle
 * @param {boolean} currentStatus - Current favorite status
 * @returns {Promise<Object>} Response from add or remove operation
 */
export const toggleFavorite = async (productId, currentStatus) => {
  if (currentStatus) {
    return await removeFromFavorites(productId);
  } else {
    return await addToFavorites(productId);
  }
};
