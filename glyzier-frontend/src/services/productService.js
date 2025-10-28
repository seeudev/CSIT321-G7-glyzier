/**
 * Product Service
 * 
 * This service handles all product-related API calls to the backend.
 * It provides functions to:
 * - Fetch all products (public endpoint)
 * - Fetch a single product by ID (public endpoint)
 * - Fetch products by seller ID (public endpoint)
 * 
 * All functions use the pre-configured axios instance from api.js
 * which automatically handles base URL and authentication tokens.
 */

import api from './api';

/**
 * Fetch All Products
 * 
 * Retrieves the complete list of products from the backend.
 * This is a public endpoint - no authentication required.
 * 
 * @returns {Promise<Array>} Array of product objects
 * @throws {Error} If the API request fails
 */
export const getAllProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

/**
 * Fetch Product by ID
 * 
 * Retrieves detailed information about a specific product.
 * This is a public endpoint - no authentication required.
 * 
 * @param {number|string} pid - The product ID
 * @returns {Promise<Object>} Product object with all details
 * @throws {Error} If the API request fails or product not found
 */
export const getProductById = async (pid) => {
  try {
    const response = await api.get(`/products/${pid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${pid}:`, error);
    throw error;
  }
};

/**
 * Fetch Products by Seller
 * 
 * Retrieves all products belonging to a specific seller.
 * This is a public endpoint - no authentication required.
 * Useful for displaying a seller's shop/portfolio.
 * 
 * @param {number|string} sid - The seller ID
 * @returns {Promise<Array>} Array of product objects from this seller
 * @throws {Error} If the API request fails
 */
export const getProductsBySeller = async (sid) => {
  try {
    const response = await api.get(`/products/seller/${sid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for seller ${sid}:`, error);
    throw error;
  }
};

/**
 * Create a New Product
 * 
 * Allows authenticated sellers to create a new product.
 * This is a protected endpoint - requires JWT authentication.
 * The product will be automatically linked to the authenticated seller.
 * 
 * @param {Object} productData - Product details (name, description, price, etc.)
 * @returns {Promise<Object>} The created product object
 * @throws {Error} If the API request fails or user is not a seller
 */
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an Existing Product
 * 
 * Allows authenticated sellers to update their own products.
 * This is a protected endpoint - requires JWT authentication.
 * Only the product owner (seller) can update it.
 * 
 * @param {number|string} pid - The product ID to update
 * @param {Object} productData - Updated product details
 * @returns {Promise<Object>} The updated product object
 * @throws {Error} If the API request fails or user doesn't own the product
 */
export const updateProduct = async (pid, productData) => {
  try {
    const response = await api.put(`/products/${pid}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${pid}:`, error);
    throw error;
  }
};

/**
 * Delete a Product
 * 
 * Allows authenticated sellers to delete their own products.
 * This is a protected endpoint - requires JWT authentication.
 * Only the product owner (seller) can delete it.
 * 
 * @param {number|string} pid - The product ID to delete
 * @returns {Promise<void>} Resolves when deletion is successful
 * @throws {Error} If the API request fails or user doesn't own the product
 */
export const deleteProduct = async (pid) => {
  try {
    await api.delete(`/products/${pid}`);
  } catch (error) {
    console.error(`Error deleting product ${pid}:`, error);
    throw error;
  }
};
