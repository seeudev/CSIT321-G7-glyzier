/**
 * Seller Service
 * 
 * This service handles all seller-related API calls to the backend.
 * It provides functions to:
 * - Register as a seller (protected endpoint - requires authentication)
 * - Check if user is a seller (protected endpoint - requires authentication)
 * - Get seller profile information (both public and protected endpoints)
 * 
 * All functions use the pre-configured axios instance from api.js
 * which automatically handles base URL and authentication tokens.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 8)
 */

import api from './api';

/**
 * Register As Seller
 * 
 * Converts the authenticated user into a seller account.
 * This is a protected endpoint - requires JWT authentication.
 * User cannot be a seller already.
 * 
 * @param {Object} sellerData - Seller registration details
 * @param {string} sellerData.sellername - Seller's shop name (3-100 chars, unique, required)
 * @param {string} sellerData.storebio - Seller's bio/description (max 1000 chars, optional)
 * @returns {Promise<Object>} Registration confirmation with seller details
 * @throws {Error} If validation fails or user is already a seller
 * 
 * @example
 * const sellerData = {
 *   sellername: "Artisan Gallery",
 *   storebio: "Professional digital artist specializing in landscapes."
 * };
 * const result = await registerAsSeller(sellerData);
 * // Returns: { message: "Successfully registered as a seller", seller: {...} }
 */
export const registerAsSeller = async (sellerData) => {
  try {
    const response = await api.post('/api/sellers/register', sellerData);
    return response.data;
  } catch (error) {
    console.error('Error registering as seller:', error);
    
    // Extract error message from backend response
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || error.response.data.message || 'Failed to register as seller';
      throw new Error(errorMessage);
    }
    
    throw error;
  }
};

/**
 * Check If Seller
 * 
 * Checks if the authenticated user is a seller.
 * This is a protected endpoint - requires JWT authentication.
 * 
 * Useful for:
 * - Conditional rendering of seller features
 * - Route guards for seller-only pages
 * - Showing/hiding "Become a Seller" button
 * 
 * @returns {Promise<Object>} Seller status and ID if applicable
 * @throws {Error} If the API request fails
 * 
 * @example
 * const status = await checkIfSeller();
 * // Returns: { isSeller: true, sid: 1 } or { isSeller: false }
 */
export const checkIfSeller = async () => {
  try {
    const response = await api.get('/api/sellers/check');
    return response.data;
  } catch (error) {
    console.error('Error checking seller status:', error);
    throw error;
  }
};

/**
 * Get My Seller Profile
 * 
 * Retrieves the seller profile for the authenticated user.
 * This is a protected endpoint - requires JWT authentication.
 * User must be a seller.
 * 
 * @returns {Promise<Object>} Seller profile object
 * @throws {Error} If user is not a seller or API request fails
 * 
 * @example
 * const profile = await getMySellerProfile();
 * // Returns: {
 * //   sid: 1,
 * //   sellername: "Artisan Gallery",
 * //   storebio: "Professional digital artist",
 * //   createdAt: "2025-10-20T12:00:00.000+00:00"
 * // }
 */
export const getMySellerProfile = async () => {
  try {
    const response = await api.get('/api/sellers/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    
    // Handle 404 (user is not a seller)
    if (error.response && error.response.status === 404) {
      throw new Error('User is not a seller');
    }
    
    throw error;
  }
};

/**
 * Get Seller By ID
 * 
 * Retrieves public information about a specific seller.
 * This is a public endpoint - no authentication required.
 * 
 * @param {number|string} sid - The seller ID
 * @returns {Promise<Object>} Seller object with public information and products
 * @throws {Error} If the API request fails or seller not found
 * 
 * @example
 * const seller = await getSellerById(1);
 * // Returns: {
 * //   sid: 1,
 * //   sellername: "Artisan Gallery",
 * //   storebio: "Professional digital artist.",
 * //   createdAt: "2025-10-20T12:00:00.000+00:00",
 * //   user: {...},
 * //   products: [...]
 * // }
 */
export const getSellerById = async (sid) => {
  try {
    const response = await api.get(`/api/sellers/${sid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seller ${sid}:`, error);
    throw error;
  }
};

/**
 * Get All Sellers (Module 15 - Public Shop Pages)
 * 
 * Retrieves a list of all sellers for the public shops page.
 * This is a public endpoint - no authentication required.
 * 
 * @returns {Promise<Array>} Array of seller objects with basic information
 * @throws {Error} If the API request fails
 * 
 * @example
 * const sellers = await getAllSellers();
 * // Returns: [
 * //   {
 * //     sid: 1,
 * //     sellername: "Artisan Gallery",
 * //     storebio: "Professional digital artist.",
 * //     createdAt: "2025-10-20T12:00:00.000+00:00",
 * //     productCount: 5,
 * //     products: [...]
 * //   },
 * //   ...
 * // ]
 */
export const getAllSellers = async () => {
  try {
    const response = await api.get('/api/sellers');
    return response.data;
  } catch (error) {
    console.error('Error fetching all sellers:', error);
    throw error;
  }
};
