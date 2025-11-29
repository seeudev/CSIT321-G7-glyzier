/**
 * Inbox Page Component
 * 
 * Displays a list of all conversations for the current user.
 * Conversations are sorted by most recent activity (updated_at DESC).
 * 
 * Features:
 * - Shows all active conversations
 * - Displays other user's name and last activity time
 * - Click on a conversation to view the message thread
 * - Empty state when no conversations exist
 * 
 * Module 16 Implementation - Inbox View
 * 
 * @component
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../services/messageService';
import styles from '../styles/pages/InboxPage.module.css';

/**
 * Format timestamp for display
 * 
 * Converts ISO datetime string to a human-readable format.
 * Shows relative time (e.g., "2 hours ago") for recent messages,
 * or full date for older messages.
 * 
 * @param {string} timestamp - ISO datetime string
 * @returns {string} Formatted timestamp
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // For older messages, show date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Get initials from a name
 * 
 * Extracts the first letter of each word in a name
 * for display in the avatar circle.
 * 
 * @param {string} name - User's display name
 * @returns {string} Initials (max 2 characters)
 */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function InboxPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Load conversations on component mount
   * 
   * Fetches all conversations for the current user from the API.
   * Conversations are already sorted by backend (updated_at DESC).
   */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError(err.response?.data?.error || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  /**
   * Handle clicking on a conversation
   * 
   * Navigates to the message thread page for the selected conversation.
   * 
   * @param {number} conversationId - ID of the conversation to open
   */
  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>Your conversations</p>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {/* Conversations list or empty state */}
      {conversations.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No conversations yet</h3>
          <p>
            Start a conversation by clicking "Contact Seller" on a product page.
          </p>
        </div>
      ) : (
        <div className={styles.conversationsList}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={styles.conversationCard}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className={styles.conversationHeader}>
                <div className={styles.userInfo}>
                  {/* Avatar with initials */}
                  <div className={styles.avatar}>
                    {getInitials(conversation.otherUserName)}
                  </div>
                  <div>
                    <div className={styles.userName}>
                      {conversation.otherUserName}
                    </div>
                    <div className={styles.userEmail}>
                      {conversation.otherUserEmail}
                    </div>
                  </div>
                </div>
                {/* Last activity timestamp */}
                <div className={styles.timestamp}>
                  {formatTimestamp(conversation.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InboxPage;
