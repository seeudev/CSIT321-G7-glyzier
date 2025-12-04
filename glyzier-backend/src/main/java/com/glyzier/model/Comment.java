package com.glyzier.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

/**
 * Comment Entity - Module 18: Community Feed
 * 
 * Represents a comment on a post.
 * Users can comment on posts to engage with content.
 * 
 * Features:
 * - Text-only content (max 200 characters)
 * - Associated with a post and user
 * - Timestamps for tracking creation time
 * - No nested comments (flat structure)
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "comments")
public class Comment {

    /**
     * Primary key - auto-generated comment ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Post this comment belongs to
     * Many comments can belong to one post
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    /**
     * User who created the comment
     * Many comments can belong to one user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    /**
     * Content of the comment
     * Limited to 200 characters
     */
    @Column(name = "content", nullable = false, length = 200)
    private String content;

    /**
     * Timestamp when the comment was created
     * Automatically set on creation
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    /**
     * Pre-persist callback to set creation timestamp
     */
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    // Constructors

    /**
     * Default constructor (required by JPA)
     */
    public Comment() {
    }

    /**
     * Constructor with post, user, and content
     * 
     * @param post Post being commented on
     * @param user User creating the comment
     * @param content Content of the comment
     */
    public Comment(Post post, Users user, String content) {
        this.post = post;
        this.user = user;
        this.content = content;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
