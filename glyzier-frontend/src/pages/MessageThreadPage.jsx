/**
 * Message Thread Page Component
 * 
 * Displays a conversation thread between two users with real-time updates via short polling.
 * 
 * Features:
 * - Display messages in chronological order
 * - Auto-scroll to bottom on new messages
 * - Send new messages
 * - Short polling every 3 seconds to check for new messages
 * - Clean up polling interval on unmount
 * 
 * Module 16 Implementation - Short Polling Architecture
 * 
 * The useEffect hook sets up a polling interval that calls the API
 * every 3 seconds to fetch new messages. This provides a simulated
 * real-time experience without the complexity of WebSockets.
 * 
 * Critical: The interval is cleared on component unmount to prevent
 * memory leaks and unnecessary API calls.
 * 
 * @component
 * @author Glyzier Team
 * @version 1.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Aurora from '../components/Aurora';
import { getConversation, getMessages, sendMessage } from '../services/messageService';
import styles from '../styles/pages/MessageThreadPage.module.css';

/**
 * Format timestamp for message display
 * 
 * @param {string} timestamp - ISO datetime string
 * @returns {string} Formatted time (e.g., "3:45 PM")
 */
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Get initials from a name for avatar
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

function MessageThreadPage() {
  const { id } = useParams(); // Conversation ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Ref for the messages container to enable auto-scroll
  const messagesEndRef = useRef(null);
  
  // Ref to store the polling interval ID
  const pollingIntervalRef = useRef(null);

  /**
   * Scroll to the bottom of the messages container
   * 
   * Called when new messages are loaded or sent.
   * Uses smooth scrolling for better UX.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Fetch conversation details
   * 
   * Gets information about the conversation (other user's details)
   * for display in the header.
   */
  const fetchConversation = async () => {
    try {
      const data = await getConversation(id);
      setConversation(data);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError(err.response?.data?.error || 'Failed to load conversation');
    }
  };

  /**
   * Fetch messages for the conversation
   * 
   * Gets all messages in chronological order.
   * Used for both initial load and polling updates.
   */
  const fetchMessages = async () => {
    try {
      const data = await getMessages(id);
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Error loading messages:', err);
      // Don't show error for polling failures, only for initial load
      if (loading) {
        setError(err.response?.data?.error || 'Failed to load messages');
      }
    }
  };

  /**
   * Initial data load on component mount
   * 
   * Loads conversation details and messages,
   * then sets up the polling interval.
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConversation(), fetchMessages()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  /**
   * Set up short polling for new messages
   * 
   * CRITICAL IMPLEMENTATION:
   * - Polls every 3000ms (3 seconds) to check for new messages
   * - Interval is cleared on component unmount to prevent memory leaks
   * - Only polls if not currently loading to avoid duplicate requests
   * 
   * This provides a simulated real-time messaging experience without WebSockets.
   */
  useEffect(() => {
    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      if (!loading && !sending) {
        fetchMessages();
      }
    }, 3000); // Poll every 3 seconds

    // CRITICAL: Clean up interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [id, loading, sending]);

  /**
   * Auto-scroll to bottom when messages change
   * 
   * Scrolls to the latest message whenever the messages array updates.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle sending a new message
   * 
   * Sends the message via API, then immediately fetches updated messages
   * to show the sent message. Clears the input field on success.
   * 
   * @param {Event} e - Form submit event
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validate message content
    if (!newMessage.trim()) return;
    if (newMessage.length > 2000) {
      setError('Message is too long (max 2000 characters)');
      return;
    }

    try {
      setSending(true);
      setError('');
      
      // Send the message
      await sendMessage(id, newMessage.trim());
      
      // Clear input
      setNewMessage('');
      
      // Fetch updated messages to show the new message
      await fetchMessages();
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  /**
   * Handle textarea key press
   * 
   * Submit on Enter (without Shift), allow newline with Shift+Enter.
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  /**
   * Navigate back to previous page (inbox or wherever user came from)
   */
  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
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
          <div className={styles.loading}>Loading conversation...</div>
        </div>
      </div>
    );
  }

  // Error state (only for initial load failures)
  if (error && !conversation) {
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
          <div className={styles.error}>{error}</div>
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
      {/* Header with back button and user info */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Back to inbox"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {conversation && (
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>
              {getInitials(conversation.otherUserName)}
            </div>
            <div className={styles.userName}>
              {conversation.otherUserName}
            </div>
          </div>
        )}
      </div>

      {/* Safety Warning Banner */}
      <div className={styles.safetyBanner}>
        <svg className={styles.warningIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className={styles.warningText}>
          <strong>Safety Reminder:</strong> Keep conversations strictly about product inquiries. Never share personal information, payment details, or contact information outside the platform.
        </div>
      </div>

      {/* Error message (for send failures) */}
      {error && conversation && (
        <div className={styles.error}>{error}</div>
      )}

      {/* Messages container */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message below.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.userid;
              
              return (
                <div
                  key={message.id}
                  className={`${styles.messageWrapper} ${isOwnMessage ? styles.own : styles.other}`}
                >
                  <div className={`${styles.messageBubble} ${isOwnMessage ? styles.own : styles.other}`}>
                    <div className={styles.messageContent}>
                      {message.content}
                    </div>
                    <div className={styles.messageMeta}>
                      {!isOwnMessage && (
                        <span className={styles.senderName}>
                          {message.senderName}
                        </span>
                      )}
                      <span>{formatMessageTime(message.sentAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <textarea
          className={styles.messageInput}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          disabled={sending}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={sending || !newMessage.trim()}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      </div>
    </div>
  );
}

export default MessageThreadPage;
