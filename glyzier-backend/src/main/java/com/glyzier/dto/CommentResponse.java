package com.glyzier.dto;

import com.glyzier.model.Comment;

import java.sql.Timestamp;

/**
 * Comment Response DTO - Module 18: Community Feed
 * 
 * Data Transfer Object for comment responses.
 * Contains comment data along with user information.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class CommentResponse {

    private Long id;
    private Long postId;
    private String content;
    private Timestamp createdAt;
    
    // User information
    private Long userId;
    private String userDisplayName;

    // Constructors

    public CommentResponse() {
    }

    /**
     * Constructor from Comment entity
     * 
     * @param comment The comment entity
     */
    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.postId = comment.getPost().getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        
        if (comment.getUser() != null) {
            this.userId = comment.getUser().getUserid();
            this.userDisplayName = comment.getUser().getDisplayname();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
    }
}
