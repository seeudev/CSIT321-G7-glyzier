package com.glyzier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Message Entity
 * 
 * Represents a single message within a conversation in the Glyzier messaging system.
 * Each message has a sender, belongs to a conversation, contains text content,
 * and has a timestamp.
 * 
 * Messages are displayed in chronological order in the message thread view.
 * The sender information is used to determine whether to display the message
 * on the left (other user) or right (current user) in the UI.
 * 
 * Database Table: messages
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "messages")
public class Message {

    /**
     * Primary key - auto-generated message ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The conversation this message belongs to
     * 
     * We use LAZY fetching to reduce database connections.
     * Conversation details are only loaded when explicitly accessed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonIgnore
    private Conversation conversation;

    /**
     * The user who sent this message
     * 
     * We use LAZY fetching to reduce database connections.
     * Sender details are only loaded when explicitly accessed.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnore
    private Users sender;

    /**
     * The text content of the message
     * 
     * Using TEXT column type to support longer messages.
     * Frontend should enforce reasonable length limits (e.g., 2000 characters).
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Timestamp of when the message was sent
     * 
     * Used for displaying messages in chronological order.
     * Set automatically when the message is created.
     */
    @Column(name = "sent_at", nullable = false, updatable = false)
    private LocalDateTime sentAt;

    /**
     * JPA callback - automatically set timestamp before persisting
     */
    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }

    /**
     * Default constructor required by JPA
     */
    public Message() {
    }

    /**
     * Constructor for creating a new message
     * 
     * @param conversation The conversation this message belongs to
     * @param sender The user sending the message
     * @param content The text content of the message
     */
    public Message(Conversation conversation, Users sender, String content) {
        this.conversation = conversation;
        this.sender = sender;
        this.content = content;
        this.sentAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public Users getSender() {
        return sender;
    }

    public void setSender(Users sender) {
        this.sender = sender;
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
