package com.glyzier.controller;

import com.glyzier.dto.*;
import com.glyzier.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Post Controller - Module 18: Community Feed
 * 
 * REST controller for managing community posts, likes, and comments.
 * Handles all endpoints related to the community feed feature.
 * 
 * Endpoints:
 * - POST /api/posts - Create a new post
 * - GET /api/posts - Get all posts
 * - DELETE /api/posts/{id} - Delete a post (admin/owner)
 * - POST /api/posts/{id}/like - Toggle like on a post
 * - POST /api/posts/{id}/comments - Add a comment to a post
 * - GET /api/posts/{id}/comments - Get comments for a post
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    /**
     * Create a new post
     * 
     * POST /api/posts
     * 
     * Request Body:
     * {
     *   "content": "Post content here (max 500 chars)"
     * }
     * 
     * Success Response (201 Created):
     * {
     *   "id": 1,
     *   "content": "Post content",
     *   "createdAt": "2025-12-04T10:00:00",
     *   "userId": 5,
     *   "userDisplayName": "John Doe",
     *   "likeCount": 0,
     *   "commentCount": 0,
     *   "likedByCurrentUser": false
     * }
     * 
     * @param request Post creation request
     * @return Created post response
     */
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest request) {
        try {
            PostResponse post = postService.createPost(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all posts
     * 
     * GET /api/posts
     * 
     * Returns all posts ordered by newest first.
     * Public endpoint - authentication optional (liked status only for authenticated users).
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "id": 2,
     *     "content": "Latest post",
     *     "createdAt": "2025-12-04T11:00:00",
     *     "userId": 3,
     *     "userDisplayName": "Jane Smith",
     *     "likeCount": 5,
     *     "commentCount": 3,
     *     "likedByCurrentUser": true
     *   },
     *   ...
     * ]
     * 
     * @return List of all posts
     */
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<PostResponse> posts = postService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete a post
     * 
     * DELETE /api/posts/{id}
     * 
     * Only the post owner or an admin can delete a post.
     * 
     * Success Response (200 OK):
     * {
     *   "message": "Post deleted successfully"
     * }
     * 
     * Error Response (403 Forbidden):
     * {
     *   "error": "You are not authorized to delete this post"
     * }
     * 
     * Error Response (404 Not Found):
     * {
     *   "error": "Post not found"
     * }
     * 
     * @param id Post ID
     * @return Success or error message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Toggle like on a post
     * 
     * POST /api/posts/{id}/like
     * 
     * If the user has already liked the post, this will unlike it.
     * If the user hasn't liked the post, this will like it.
     * 
     * Success Response (200 OK):
     * {
     *   "likeCount": 6,
     *   "liked": true
     * }
     * 
     * Error Response (404 Not Found):
     * {
     *   "error": "Post not found"
     * }
     * 
     * @param id Post ID
     * @return Updated like count and status
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        try {
            LikeResponse response = postService.toggleLike(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Add a comment to a post
     * 
     * POST /api/posts/{id}/comments
     * 
     * Request Body:
     * {
     *   "content": "Comment text here (max 200 chars)"
     * }
     * 
     * Success Response (201 Created):
     * {
     *   "id": 10,
     *   "postId": 5,
     *   "content": "Great post!",
     *   "createdAt": "2025-12-04T12:00:00",
     *   "userId": 7,
     *   "userDisplayName": "Bob Wilson"
     * }
     * 
     * Error Response (404 Not Found):
     * {
     *   "error": "Post not found"
     * }
     * 
     * @param id Post ID
     * @param request Comment creation request
     * @return Created comment response
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request) {
        try {
            CommentResponse comment = postService.addComment(id, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get comments for a post
     * 
     * GET /api/posts/{id}/comments
     * 
     * Returns all comments for a specific post, ordered by oldest first.
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "id": 10,
     *     "postId": 5,
     *     "content": "Great post!",
     *     "createdAt": "2025-12-04T12:00:00",
     *     "userId": 7,
     *     "userDisplayName": "Bob Wilson"
     *   },
     *   ...
     * ]
     * 
     * Error Response (404 Not Found):
     * {
     *   "error": "Post not found"
     * }
     * 
     * @param id Post ID
     * @return List of comments
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        try {
            List<CommentResponse> comments = postService.getComments(id);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
