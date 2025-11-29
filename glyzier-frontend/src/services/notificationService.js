/**
 * Notification Service
 * 
 * Handles checking for new/unread messages to display notification badges.
 * Uses localStorage to track last seen message timestamp.
 * 
 * Module 16 - Message Notifications
 * 
 * @author Glyzier Team
 * @version 1.0
 */

import api from './api';

const LAST_SEEN_KEY = 'glyzier_messages_last_seen';

/**
 * Get the last seen timestamp from localStorage
 * 
 * @returns {string|null} ISO timestamp of last seen or null
 */
export const getLastSeenTimestamp = () => {
  return localStorage.getItem(LAST_SEEN_KEY);
};

/**
 * Update the last seen timestamp to now
 * Call this when user opens the messages page
 */
export const markMessagesAsSeen = () => {
  const now = new Date().toISOString();
  localStorage.setItem(LAST_SEEN_KEY, now);
};

/**
 * Check if there are new messages since last seen
 * 
 * @returns {Promise<boolean>} True if there are new messages
 */
export const hasNewMessages = async () => {
  try {
    const lastSeen = getLastSeenTimestamp();
    
    // Get all conversations
    const response = await api.get('/api/conversations');
    const conversations = response.data;
    
    if (!conversations || conversations.length === 0) {
      return false;
    }
    
    // If no lastSeen timestamp, show notification if there are any conversations
    if (!lastSeen) {
      return conversations.length > 0;
    }
    
    // Check if any conversation has been updated after lastSeen
    const lastSeenDate = new Date(lastSeen);
    const hasNew = conversations.some(conv => {
      const updatedAt = new Date(conv.updatedAt);
      return updatedAt > lastSeenDate;
    });
    
    return hasNew;
  } catch (error) {
    console.error('Error checking for new messages:', error);
    return false;
  }
};
