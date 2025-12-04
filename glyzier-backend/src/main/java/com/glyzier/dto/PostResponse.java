package com.glyzier.dto;

import com.glyzier.model.Post;

import java.sql.Timestamp;

/**
 * Post Response DTO - Module 18: Community Feed
 * 
 * Data Transfer Object for post responses.
 * Contains post data along with interaction counts and user info.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class PostResponse {

    private Long id;
    private String content;
    private Timestamp createdAt;
    
    // User information
    private Long userId;
    private String userDisplayName;
    
    // Interaction counts
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;

    // Constructors

    public PostResponse() {
    }

    /**
     * Constructor from Post entity
     * 
     * @param post The post entity
     * @param likeCount Number of likes
     * @param commentCount Number of comments
     * @param likedByCurrentUser Whether current user has liked the post
     */
    public PostResponse(Post post, long likeCount, long commentCount, boolean likedByCurrentUser) {
        this.id = post.getId();
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        
        if (post.getUser() != null) {
            this.userId = post.getUser().getUserid();
            this.userDisplayName = post.getUser().getDisplayname();
        }
        
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.likedByCurrentUser = likedByCurrentUser;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(long commentCount) {
        this.commentCount = commentCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }
}
