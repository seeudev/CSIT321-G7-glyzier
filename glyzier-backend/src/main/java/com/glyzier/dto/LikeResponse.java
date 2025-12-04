package com.glyzier.dto;

/**
 * Like Response DTO - Module 18: Community Feed
 * 
 * Data Transfer Object for like toggle responses.
 * Returns the updated like count and whether the current user has liked the post.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class LikeResponse {

    private long likeCount;
    private boolean liked;

    // Constructors

    public LikeResponse() {
    }

    public LikeResponse(long likeCount, boolean liked) {
        this.likeCount = likeCount;
        this.liked = liked;
    }

    // Getters and Setters

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }
}
