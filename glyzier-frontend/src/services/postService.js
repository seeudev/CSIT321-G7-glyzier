/**
 * Post Service - Module 18: Community Feed
 * 
 * API service for managing community posts, likes, and comments.
 * Handles all HTTP requests to the /api/posts endpoints.
 * 
 * Features:
 * - Create and fetch posts
 * - Toggle likes on posts
 * - Add and fetch comments
 * - Delete posts (admin/owner)
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import api from './api';

/**
 * Create a new post
 * 
 * @param {string} content - Post content (max 500 characters)
 * @returns {Promise<Object>} Created post object
 * @throws {Error} If request fails
 */
export const createPost = async (content) => {
    const response = await api.post('/api/posts', { content });
    return response.data;
};

/**
 * Get all posts
 * 
 * Fetches all posts ordered by newest first.
 * Public endpoint - works with or without authentication.
 * If authenticated, includes likedByCurrentUser status.
 * 
 * @returns {Promise<Array>} Array of post objects
 * @throws {Error} If request fails
 */
export const getAllPosts = async () => {
    const response = await api.get('/api/posts');
    return response.data;
};

/**
 * Delete a post
 * 
 * Only the post owner or an admin can delete a post.
 * 
 * @param {number} postId - Post ID to delete
 * @returns {Promise<Object>} Success message
 * @throws {Error} If unauthorized or request fails
 */
export const deletePost = async (postId) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
};

/**
 * Toggle like on a post
 * 
 * If the user has already liked the post, this will unlike it.
 * If the user hasn't liked the post, this will like it.
 * 
 * @param {number} postId - Post ID to like/unlike
 * @returns {Promise<Object>} Object with likeCount and liked status
 * @throws {Error} If request fails
 */
export const toggleLike = async (postId) => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
};

/**
 * Add a comment to a post
 * 
 * @param {number} postId - Post ID to comment on
 * @param {string} content - Comment content (max 200 characters)
 * @returns {Promise<Object>} Created comment object
 * @throws {Error} If request fails
 */
export const addComment = async (postId, content) => {
    const response = await api.post(`/api/posts/${postId}/comments`, { content });
    return response.data;
};

/**
 * Get comments for a post
 * 
 * Fetches all comments for a specific post, ordered by oldest first.
 * 
 * @param {number} postId - Post ID to get comments for
 * @returns {Promise<Array>} Array of comment objects
 * @throws {Error} If request fails
 */
export const getComments = async (postId) => {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
};
