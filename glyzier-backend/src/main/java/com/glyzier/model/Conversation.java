package com.glyzier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Conversation Entity
 * 
 * Represents a messaging conversation between two users in the Glyzier platform.
 * This is a simple two-party conversation model where one user typically initiates
 * contact with another (e.g., buyer contacting seller about a product).
 * 
 * A conversation serves as a container for messages between two users.
 * The updated_at timestamp is used for sorting conversations in the inbox
 * (most recently active conversations appear first).
 * 
 * Database Table: conversations
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "conversations")
public class Conversation {

    /**
     * Primary key - auto-generated conversation ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * First user in the conversation
     * 
     * Typically the user who initiated the conversation (e.g., buyer).
     * We use LAZY fetching to reduce database connections and prevent
     * N+1 query problems. User details are fetched only when needed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    @JsonIgnore
    private Users user1;

    /**
     * Second user in the conversation
     * 
     * Typically the user who received the initial contact (e.g., seller).
     * We use LAZY fetching to reduce database connections and prevent
     * N+1 query problems. User details are fetched only when needed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    @JsonIgnore
    private Users user2;

    /**
     * Timestamp of when the conversation was last updated
     * 
     * This is updated every time a new message is sent in the conversation.
     * Used for sorting conversations by most recent activity.
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Timestamp of when the conversation was created
     * 
     * Set automatically when the conversation is first created.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA callback - automatically set timestamps before persisting
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Default constructor required by JPA
     */
    public Conversation() {
    }

    /**
     * Constructor for creating a new conversation between two users
     * 
     * @param user1 First user (typically the initiator)
     * @param user2 Second user (typically the recipient)
     */
    public Conversation(Users user1, Users user2) {
        this.user1 = user1;
        this.user2 = user2;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser1() {
        return user1;
    }

    public void setUser1(Users user1) {
        this.user1 = user1;
    }

    public Users getUser2() {
        return user2;
    }

    public void setUser2(Users user2) {
        this.user2 = user2;
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
