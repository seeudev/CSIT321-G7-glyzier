package com.glyzier.dto;

import java.time.LocalDateTime;

/**
 * Message Response DTO
 * 
 * Data Transfer Object for returning message information to the frontend.
 * This is used in the message thread view to display individual messages.
 * 
 * Contains:
 * - Message ID and content
 * - Sender information (to determine left/right alignment in UI)
 * - Timestamp (for chronological ordering)
 * 
 * The frontend uses the senderId to determine whether to display
 * the message on the left (other user) or right (current user).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class MessageResponse {

    /**
     * Unique message ID
     */
    private Long id;

    /**
     * ID of the conversation this message belongs to
     */
    private Long conversationId;

    /**
     * ID of the user who sent this message
     * 
     * Used by frontend to determine message alignment:
     * - If senderId matches current user: align right
     * - If senderId doesn't match: align left
     */
    private Long senderId;

    /**
     * Display name of the sender
     */
    private String senderName;

    /**
     * Text content of the message
     */
    private String content;

    /**
     * Timestamp of when the message was sent
     * 
     * Used for displaying time and sorting messages chronologically.
     */
    private LocalDateTime sentAt;

    /**
     * Default constructor
     */
    public MessageResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param id Message ID
     * @param conversationId Conversation ID
     * @param senderId Sender's user ID
     * @param senderName Sender's display name
     * @param content Message text content
     * @param sentAt Timestamp when sent
     */
    public MessageResponse(Long id, Long conversationId, Long senderId, 
                          String senderName, String content, LocalDateTime sentAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.sentAt = sentAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
