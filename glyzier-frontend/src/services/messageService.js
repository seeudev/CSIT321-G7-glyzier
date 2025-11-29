/**
 * Message Service
 * 
 * API service module for messaging functionality in Glyzier.
 * Handles all HTTP requests related to conversations and messages.
 * 
 * Features:
 * - Get user's inbox (list of conversations)
 * - Get messages in a conversation
 * - Create or get conversation with another user
 * - Send messages
 * 
 * Uses the pre-configured axios instance from api.js which automatically:
 * - Adds JWT token to requests
 * - Handles base URL
 * - Manages error responses
 * 
 * @module services/messageService
 * @author Glyzier Team
 * @version 1.0
 */

import api from './api';

/**
 * Get all conversations for the current user
 * 
 * Retrieves the inbox - a list of all conversations the user is part of,
 * sorted by most recent activity. Used for the inbox page.
 * 
 * @returns {Promise<Array>} Array of conversation objects
 * @throws {Error} If the request fails
 * 
 * Example response:
 * [
 *   {
 *     id: 1,
 *     otherUserId: 5,
 *     otherUserName: "John Doe",
 *     otherUserEmail: "john@example.com",
 *     updatedAt: "2024-11-29T15:30:00",
 *     createdAt: "2024-11-20T10:00:00"
 *   },
 *   ...
 * ]
 */
export const getConversations = async () => {
  const response = await api.get('/api/conversations');
  return response.data;
};

/**
 * Get specific conversation details
 * 
 * Retrieves details about a specific conversation by ID.
 * Used for displaying conversation header information.
 * 
 * @param {number} conversationId - ID of the conversation
 * @returns {Promise<Object>} Conversation details object
 * @throws {Error} If conversation not found or user not authorized
 * 
 * Example response:
 * {
 *   id: 1,
 *   otherUserId: 5,
 *   otherUserName: "John Doe",
 *   otherUserEmail: "john@example.com",
 *   updatedAt: "2024-11-29T15:30:00",
 *   createdAt: "2024-11-20T10:00:00"
 * }
 */
export const getConversation = async (conversationId) => {
  const response = await api.get(`/api/conversations/${conversationId}`);
  return response.data;
};

/**
 * Create or get conversation with another user
 * 
 * Creates a new conversation with the specified user, or returns
 * the existing conversation if one already exists. This prevents
 * duplicate conversations between the same two users.
 * 
 * Used when clicking "Contact Seller" on a product.
 * 
 * @param {number} recipientUserId - ID of the user to chat with
 * @returns {Promise<Object>} Conversation object
 * @throws {Error} If recipient not found or user tries to message themselves
 * 
 * Example response:
 * {
 *   id: 1,
 *   otherUserId: 5,
 *   otherUserName: "John Doe",
 *   otherUserEmail: "john@example.com",
 *   updatedAt: "2024-11-29T15:30:00",
 *   createdAt: "2024-11-29T15:30:00"
 * }
 */
export const createOrGetConversation = async (recipientUserId) => {
  const response = await api.post('/api/conversations', { recipientUserId });
  return response.data;
};

/**
 * Get all messages in a conversation
 * 
 * Retrieves all messages for a specific conversation in chronological order.
 * 
 * SHORT POLLING USAGE:
 * Call this function every 3 seconds from the message thread page
 * to check for new messages. This provides a simulated real-time
 * messaging experience.
 * 
 * @param {number} conversationId - ID of the conversation
 * @returns {Promise<Array>} Array of message objects
 * @throws {Error} If conversation not found or user not authorized
 * 
 * Example response:
 * [
 *   {
 *     id: 1,
 *     conversationId: 1,
 *     senderId: 3,
 *     senderName: "Alice Smith",
 *     content: "Hi, I'm interested in your product!",
 *     sentAt: "2024-11-29T15:30:00"
 *   },
 *   {
 *     id: 2,
 *     conversationId: 1,
 *     senderId: 5,
 *     senderName: "John Doe",
 *     content: "Thank you for your interest!",
 *     sentAt: "2024-11-29T15:32:00"
 *   }
 * ]
 */
export const getMessages = async (conversationId) => {
  const response = await api.get(`/api/messages/${conversationId}`);
  return response.data;
};

/**
 * Send a message in a conversation
 * 
 * Creates a new message in the specified conversation.
 * The message will appear in the next polling cycle for the other user.
 * 
 * @param {number} conversationId - ID of the conversation
 * @param {string} content - Text content of the message (1-2000 characters)
 * @returns {Promise<Object>} Response containing success message and message data
 * @throws {Error} If validation fails or user not authorized
 * 
 * Example response:
 * {
 *   message: "Message sent successfully",
 *   data: {
 *     id: 3,
 *     conversationId: 1,
 *     senderId: 3,
 *     senderName: "Alice Smith",
 *     content: "Hello! How are you?",
 *     sentAt: "2024-11-29T15:35:00"
 *   }
 * }
 */
export const sendMessage = async (conversationId, content) => {
  const response = await api.post('/api/messages', {
    conversationId,
    content
  });
  return response.data;
};

export default {
  getConversations,
  getConversation,
  createOrGetConversation,
  getMessages,
  sendMessage
};
