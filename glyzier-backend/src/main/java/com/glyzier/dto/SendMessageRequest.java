package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Send Message Request DTO
 * 
 * Data Transfer Object for sending a new message in a conversation.
 * Contains the conversation ID and the message content.
 * 
 * Validation rules:
 * - conversationId must not be null
 * - content must not be blank
 * - content must be between 1 and 2000 characters
 * 
 * This is used when a user submits a message in the message thread view.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class SendMessageRequest {

    /**
     * ID of the conversation to send the message to
     */
    @NotNull(message = "Conversation ID is required")
    private Long conversationId;

    /**
     * Text content of the message
     * 
     * Limited to 2000 characters to prevent excessively long messages
     * and ensure reasonable database storage.
     */
    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 2000, message = "Message must be between 1 and 2000 characters")
    private String content;

    /**
     * Default constructor
     */
    public SendMessageRequest() {
    }

    /**
     * Constructor with fields
     * 
     * @param conversationId ID of the conversation
     * @param content Message text content
     */
    public SendMessageRequest(Long conversationId, String content) {
        this.conversationId = conversationId;
        this.content = content;
    }

    // Getters and Setters

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
