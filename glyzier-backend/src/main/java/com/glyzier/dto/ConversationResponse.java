package com.glyzier.dto;

import java.time.LocalDateTime;

/**
 * Conversation Response DTO
 * 
 * Data Transfer Object for returning conversation information to the frontend.
 * This is used in the inbox view to display the list of conversations.
 * 
 * Contains:
 * - Conversation ID (for navigation to message thread)
 * - Other user's information (who the current user is chatting with)
 * - Last activity timestamp (for sorting by recency)
 * 
 * The "other user" is determined based on the current authenticated user:
 * - If current user is user1, other user is user2
 * - If current user is user2, other user is user1
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class ConversationResponse {

    /**
     * Unique conversation ID
     */
    private Long id;

    /**
     * ID of the other user in the conversation
     */
    private Long otherUserId;

    /**
     * Display name of the other user in the conversation
     */
    private String otherUserName;

    /**
     * Email of the other user in the conversation
     */
    private String otherUserEmail;

    /**
     * Seller shop name if the other user is a seller
     */
    private String sellerShopName;

    /**
     * Timestamp of the last activity in this conversation
     * 
     * Updated whenever a new message is sent.
     * Used for sorting conversations (most recent first).
     */
    private LocalDateTime updatedAt;

    /**
     * Timestamp of when the conversation was created
     */
    private LocalDateTime createdAt;

    /**
     * Default constructor
     */
    public ConversationResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param id Conversation ID
     * @param otherUserId Other user's ID
     * @param otherUserName Other user's display name
     * @param otherUserEmail Other user's email
     * @param sellerShopName Seller shop name (null if not a seller)
     * @param updatedAt Last activity timestamp
     * @param createdAt Creation timestamp
     */
    public ConversationResponse(Long id, Long otherUserId, String otherUserName, 
                               String otherUserEmail, String sellerShopName,
                               LocalDateTime updatedAt, LocalDateTime createdAt) {
        this.id = id;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.otherUserEmail = otherUserEmail;
        this.sellerShopName = sellerShopName;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getOtherUserEmail() {
        return otherUserEmail;
    }

    public void setOtherUserEmail(String otherUserEmail) {
        this.otherUserEmail = otherUserEmail;
    }

    public String getSellerShopName() {
        return sellerShopName;
    }

    public void setSellerShopName(String sellerShopName) {
        this.sellerShopName = sellerShopName;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
