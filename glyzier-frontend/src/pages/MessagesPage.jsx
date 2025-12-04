/**
 * Messages Page Component - Simple Conversation List
 * 
 * Displays a list of message conversations in a clean, single-column layout.
 * Users can click on conversations to view messages (navigates to conversation detail).
 * 
 * @component
 * @author Glyzier Team
 * @version 3.0 (Simplified Layout)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import { getConversations } from '../services/messageService';
import styles from '../styles/pages/MessagesPage.module.css';

/**
 * Get initials from name for avatar
 */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load conversations on mount
   */
  useEffect(() => {
    loadConversations();
  }, []);

  /**
   * Fetch conversations from API
   */
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle conversation selection - navigate to conversation detail
   */
  const handleSelectConversation = (conversationId) => {
    console.log('Navigating to conversation:', conversationId);
    navigate(`/messages/${conversationId}`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Aurora 
        colorStops={['#c9bfe8', '#b8afe8', '#9b8dd4']}
        amplitude={1.0}
        blend={0.5}
        speed={0.3}
      />
      <Navigation />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            onClick={() => navigate(-1)} 
            className={styles.backButton}
            title="Go back"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className={styles.titleCard}>
            <h1 className={styles.pageTitle}>Messages</h1>
          </div>
        </div>
        
        <div className={styles.conversationsList}>
          {conversations.length === 0 ? (
            <div className={styles.emptyConversations}>
              <p>No conversations yet</p>
              <span>Start by contacting a seller</span>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={styles.conversationCard}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className={styles.conversationAvatar}>
                  {getInitials(conversation.otherUserName)}
                </div>
                <div className={styles.conversationInfo}>
                  <div className={styles.conversationName}>
                    {conversation.otherUserName}
                  </div>
                  {conversation.sellerShopName && (
                    <div className={styles.shopName}>
                      {conversation.sellerShopName}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
