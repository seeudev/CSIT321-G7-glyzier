/**
 * Messages Page Component (Module 16 - Enhanced 2-Column Layout)
 * 
 * This is the main messages interface with a 2-column desktop layout:
 * - Left sidebar: List of conversations
 * - Right panel: Selected conversation messages
 * 
 * Features:
 * - Responsive 2-column design (stacks on mobile)
 * - Real-time message updates via short polling (3 seconds)
 * - Conversation selection and navigation
 * - Send messages and see them appear instantly
 * - Auto-scroll to latest messages
 * 
 * Routes:
 * - /messages - Shows inbox with first conversation selected (if any)
 * - /messages/:id - Shows inbox with specific conversation selected
 * 
 * @component
 * @author Glyzier Team
 * @version 2.0 (Enhanced with 2-column layout)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { getConversations, getMessages, sendMessage } from '../services/messageService';
import { markMessagesAsSeen } from '../services/notificationService';
import { showError } from '../components/NotificationManager';
import styles from '../styles/pages/MessagesPage.module.css';

/**
 * Format timestamp for conversation list
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
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format timestamp for message bubbles
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
 * Get initials from name for avatar
 */
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function MessagesPage() {
  const { id } = useParams(); // Selected conversation ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Refs
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Fetch all conversations
   */
  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      
      // If no conversation is selected but we have conversations, select the first one
      if (!selectedConversationId && data.length > 0 && !id) {
        const firstId = data[0].id;
        setSelectedConversationId(firstId);
        navigate(`/messages/${firstId}`, { replace: true });
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.response?.data?.error || 'Failed to load conversations');
    }
  };

  /**
   * Fetch messages for selected conversation
   */
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Error loading messages:', err);
      if (loading) {
        setError(err.response?.data?.error || 'Failed to load messages');
      }
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchConversations();
      
      // If URL has conversation ID, select it and load messages
      if (id) {
        setSelectedConversationId(parseInt(id));
        await fetchMessages(parseInt(id));
      }
      
      setLoading(false);
      
      // Mark messages as seen when page loads
      markMessagesAsSeen();
    };

    loadData();
  }, []);

  /**
   * Update selected conversation when URL changes
   */
  useEffect(() => {
    if (id) {
      const conversationId = parseInt(id);
      setSelectedConversationId(conversationId);
      fetchMessages(conversationId);
    }
  }, [id]);

  /**
   * Set up polling for new messages
   */
  useEffect(() => {
    if (!selectedConversationId || loading) return;

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      if (!sending) {
        fetchMessages(selectedConversationId);
      }
    }, 3000);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [selectedConversationId, loading, sending]);

  /**
   * Auto-scroll when messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversationId) return;
    if (newMessage.length > 2000) {
      showError('Message is too long (max 2000 characters)');
      return;
    }

    try {
      setSending(true);
      await sendMessage(selectedConversationId, newMessage.trim());
      setNewMessage('');
      await fetchMessages(selectedConversationId);
      await fetchConversations(); // Update conversation list with new timestamp
    } catch (err) {
      console.error('Error sending message:', err);
      showError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  /**
   * Handle Enter key in textarea
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Get current conversation details
  const currentConversation = conversations.find(c => c.id === selectedConversationId);

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
      <Navigation />
      
      <div className={styles.container}>
        {/* Left Sidebar - Conversations List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Messages</h2>
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
                  className={`${styles.conversationItem} ${
                    conversation.id === selectedConversationId ? styles.active : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className={styles.conversationAvatar}>
                    {getInitials(conversation.otherUserName)}
                  </div>
                  <div className={styles.conversationInfo}>
                    <div className={styles.conversationName}>
                      {conversation.otherUserName}
                    </div>
                    <div className={styles.conversationTime}>
                      {formatTimestamp(conversation.updatedAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Messages */}
        <div className={styles.messagesPanel}>
          {!selectedConversationId ? (
            <div className={styles.noSelection}>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the left to view messages</p>
            </div>
          ) : (
            <>
              {/* Messages Header */}
              <div className={styles.messagesHeader}>
                {currentConversation && (
                  <div className={styles.headerInfo}>
                    <div className={styles.headerAvatar}>
                      {getInitials(currentConversation.otherUserName)}
                    </div>
                    <div>
                      <div className={styles.headerName}>
                        {currentConversation.otherUserName}
                      </div>
                      <div className={styles.headerEmail}>
                        {currentConversation.otherUserEmail}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className={styles.error}>{error}</div>
              )}

              {/* Messages Container */}
              <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div className={styles.emptyMessages}>
                    <h3>No messages yet</h3>
                    <p>Start the conversation by sending a message below</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isOwnMessage = message.senderId === user?.userid;
                      
                      return (
                        <div
                          key={message.id}
                          className={`${styles.messageWrapper} ${
                            isOwnMessage ? styles.own : styles.other
                          }`}
                        >
                          <div className={`${styles.messageBubble} ${
                            isOwnMessage ? styles.own : styles.other
                          }`}>
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
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
