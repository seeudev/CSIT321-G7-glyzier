package com.glyzier.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Post Entity - Module 18: Community Feed
 * 
 * Represents a text post in the community feed.
 * Users can create posts to share content with the community.
 * 
 * Features:
 * - Text-only content (max 500 characters)
 * - Timestamps for tracking creation time
 * - Associated with a user (author)
 * - Can have likes and comments
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "posts")
public class Post {

    /**
     * Primary key - auto-generated post ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Author of the post
     * Many posts can belong to one user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    /**
     * Content of the post
     * Limited to 500 characters for simplicity
     */
    @Column(name = "content", nullable = false, length = 500)
    private String content;

    /**
     * Timestamp when the post was created
     * Automatically set on creation
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;

    /**
     * Comments on this post
     * Cascade delete - when post is deleted, all comments are deleted
     */
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    /**
     * Likes on this post
     * Cascade delete - when post is deleted, all likes are deleted
     */
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostLike> likes = new ArrayList<>();

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
    public Post() {
    }

    /**
     * Constructor with user and content
     * 
     * @param user User who created the post
     * @param content Content of the post
     */
    public Post(Users user, String content) {
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

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<PostLike> getLikes() {
        return likes;
    }

    public void setLikes(List<PostLike> likes) {
        this.likes = likes;
    }
}
