package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Create Post Request DTO - Module 18: Community Feed
 * 
 * Data Transfer Object for creating a new post.
 * Contains validation rules for post content.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class CreatePostRequest {

    /**
     * Content of the post
     * Must be between 1 and 500 characters
     */
    @NotBlank(message = "Post content is required")
    @Size(min = 1, max = 500, message = "Post content must be between 1 and 500 characters")
    private String content;

    // Constructors

    public CreatePostRequest() {
    }

    public CreatePostRequest(String content) {
        this.content = content;
    }

    // Getters and Setters

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
