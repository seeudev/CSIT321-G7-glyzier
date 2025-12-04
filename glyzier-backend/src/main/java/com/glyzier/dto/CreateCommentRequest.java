package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Create Comment Request DTO - Module 18: Community Feed
 * 
 * Data Transfer Object for creating a new comment on a post.
 * Contains validation rules for comment content.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class CreateCommentRequest {

    /**
     * Content of the comment
     * Must be between 1 and 200 characters
     */
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 200, message = "Comment content must be between 1 and 200 characters")
    private String content;

    // Constructors

    public CreateCommentRequest() {
    }

    public CreateCommentRequest(String content) {
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
