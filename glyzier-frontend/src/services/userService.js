/**
 * User Service - Frontend API calls for user profile management
 * 
 * This service provides functions for user-related operations:
 * - Get current user information
 * - Update user profile (display name, phone number)
 * - Change password
 * 
 * All functions use the pre-configured api instance which automatically
 * adds the JWT token to requests.
 * 
 * Module 14 - Basic User Profile implementation
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import api from './api';

/**
 * Get current authenticated user's information
 * 
 * Fetches the profile data of the currently logged-in user.
 * JWT token is automatically added from localStorage by api interceptor.
 * 
 * Endpoint: GET /api/users/me
 * 
 * @returns {Promise<Object>} User data including:
 *   - userid: User's unique ID
 *   - email: User's email address
 *   - displayname: User's display name
 *   - phonenumber: User's phone number (optional)
 *   - isSeller: Whether user is a seller
 *   - createdAt: Account creation timestamp
 * 
 * @throws {Error} If request fails (network error, unauthorized, etc.)
 * 
 * @example
 * const user = await getCurrentUser();
 * console.log(user.displayname); // "John Doe"
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

/**
 * Update user profile information
 * 
 * Updates the current user's display name and/or phone number.
 * Email cannot be changed through this endpoint.
 * 
 * Endpoint: PUT /api/users/profile
 * 
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.displayname - New display name (required, 2-100 chars)
 * @param {string} [profileData.phonenumber] - New phone number (optional, 10-20 chars)
 * 
 * @returns {Promise<Object>} Response containing:
 *   - message: Success message
 *   - user: Updated user object
 * 
 * @throws {Error} If validation fails or request fails
 * 
 * @example
 * const result = await updateProfile({
 *   displayname: "Jane Doe",
 *   phonenumber: "+1 234 567 8900"
 * });
 * console.log(result.message); // "Profile updated successfully"
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/api/users/profile', profileData);
  return response.data;
};

/**
 * Change user password
 * 
 * Changes the current user's password. Requires verification of the
 * current password before allowing the change. New password must match
 * confirmation.
 * 
 * Endpoint: PUT /api/users/change-password
 * 
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password for verification
 * @param {string} passwordData.newPassword - New password (min 8 chars)
 * @param {string} passwordData.confirmPassword - Confirmation of new password
 * 
 * @returns {Promise<Object>} Response containing:
 *   - message: Success message
 * 
 * @throws {Error} If current password is incorrect, passwords don't match, or validation fails
 * 
 * @example
 * await changePassword({
 *   currentPassword: "oldpass123",
 *   newPassword: "newpass456",
 *   confirmPassword: "newpass456"
 * });
 * // Password changed successfully
 */
export const changePassword = async (passwordData) => {
  const response = await api.put('/api/users/change-password', passwordData);
  return response.data;
};

// Export as default object for convenience
export default {
  getCurrentUser,
  updateProfile,
  changePassword
};
