package com.glyzier.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Create Conversation Request DTO
 * 
 * Data Transfer Object for creating a new conversation with another user.
 * Contains only the ID of the user to start a conversation with.
 * 
 * The current user (sender) is determined from the JWT token,
 * so only the recipient's user ID needs to be provided.
 * 
 * This is used when:
 * - Clicking "Contact Seller" button on a product
 * - Manually starting a conversation with a user
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class CreateConversationRequest {

    /**
     * ID of the user to start a conversation with
     * 
     * This is typically a seller's user ID when a buyer
     * wants to inquire about a product.
     */
    @NotNull(message = "Recipient user ID is required")
    private Long recipientUserId;

    /**
     * Default constructor
     */
    public CreateConversationRequest() {
    }

    /**
     * Constructor with recipient user ID
     * 
     * @param recipientUserId ID of the user to chat with
     */
    public CreateConversationRequest(Long recipientUserId) {
        this.recipientUserId = recipientUserId;
    }

    // Getters and Setters

    public Long getRecipientUserId() {
        return recipientUserId;
    }

    public void setRecipientUserId(Long recipientUserId) {
        this.recipientUserId = recipientUserId;
    }
}
