/**
 * Admin Service
 * 
 * Handles all API calls for admin operations.
 * These endpoints are protected and require ADMIN role.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import api from './api';

/**
 * Get dashboard statistics
 * 
 * Fetches aggregated statistics for the admin dashboard:
 * - Total users
 * - Total products
 * - Total orders
 * - Total revenue
 * 
 * @returns {Promise} Promise resolving to dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get('/api/admin/dashboard/stats');
  return response.data;
};

/**
 * Get all users
 * 
 * Fetches all users with their role, status, and seller information.
 * Used in the admin user management page.
 * 
 * @returns {Promise} Promise resolving to array of users
 */
export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

/**
 * Ban a user
 * 
 * Changes user status to BANNED, preventing login.
 * 
 * @param {number} userid - The ID of the user to ban
 * @returns {Promise} Promise resolving to success message
 */
export const banUser = async (userid) => {
  const response = await api.post(`/api/admin/users/${userid}/ban`);
  return response.data;
};

/**
 * Unban a user
 * 
 * Changes user status back to ACTIVE, allowing login.
 * 
 * @param {number} userid - The ID of the user to unban
 * @returns {Promise} Promise resolving to success message
 */
export const unbanUser = async (userid) => {
  const response = await api.post(`/api/admin/users/${userid}/unban`);
  return response.data;
};

/**
 * Get all products
 * 
 * Fetches all products (including soft-deleted) with seller information.
 * Used in the admin product moderation page.
 * 
 * @returns {Promise} Promise resolving to array of products
 */
export const getAllProducts = async () => {
  const response = await api.get('/api/admin/products');
  return response.data;
};

/**
 * Remove (soft delete) a product
 * 
 * Changes product status to DELETED, hiding it from public view.
 * 
 * @param {number} pid - The ID of the product to remove
 * @returns {Promise} Promise resolving to success message
 */
export const removeProduct = async (pid) => {
  const response = await api.delete(`/api/admin/products/${pid}`);
  return response.data;
};

/**
 * Restore a soft-deleted product
 * 
 * Changes product status back to ACTIVE, making it visible again.
 * 
 * @param {number} pid - The ID of the product to restore
 * @returns {Promise} Promise resolving to success message
 */
export const restoreProduct = async (pid) => {
  const response = await api.post(`/api/admin/products/${pid}/restore`);
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  banUser,
  unbanUser,
  getAllProducts,
  removeProduct,
  restoreProduct,
};
