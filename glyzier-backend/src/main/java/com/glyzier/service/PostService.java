package com.glyzier.service;

import com.glyzier.dto.*;
import com.glyzier.model.*;
import com.glyzier.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Post Service - Module 18: Community Feed
 * 
 * Business logic for managing posts, likes, and comments.
 * Handles creating posts, toggling likes, and managing comments.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new post
     * 
     * @param request Post creation request
     * @return Created post response
     */
    public PostResponse createPost(CreatePostRequest request) {
        // Get current authenticated user
        Users currentUser = getCurrentUser();
        
        // Create and save post
        Post post = new Post(currentUser, request.getContent());
        post = postRepository.save(post);
        
        // Return response with zero counts (new post)
        return new PostResponse(post, 0, 0, false);
    }

    /**
     * Get all posts ordered by newest first
     * 
     * @return List of post responses
     */
    public List<PostResponse> getAllPosts() {
        Users currentUser = getCurrentUserOrNull();
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        
        return posts.stream()
                .map(post -> {
                    long likeCount = postLikeRepository.countByPost(post);
                    long commentCount = commentRepository.countByPost(post);
                    boolean liked = currentUser != null && 
                                  postLikeRepository.existsByPostAndUser(post, currentUser);
                    return new PostResponse(post, likeCount, commentCount, liked);
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete a post (admin or owner only)
     * 
     * @param postId ID of post to delete
     */
    public void deletePost(Long postId) {
        Users currentUser = getCurrentUser();
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if user is admin or post owner
        if (!currentUser.isAdmin() && !post.getUser().getUserid().equals(currentUser.getUserid())) {
            throw new RuntimeException("You are not authorized to delete this post");
        }
        
        postRepository.delete(post);
    }

    /**
     * Toggle like on a post
     * If user has already liked, unlike it. If not, like it.
     * 
     * @param postId ID of post to like/unlike
     * @return Updated like status
     */
    public LikeResponse toggleLike(Long postId) {
        Users currentUser = getCurrentUser();
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if user has already liked this post
        Optional<PostLike> existingLike = postLikeRepository.findByPostAndUser(post, currentUser);
        
        boolean liked;
        if (existingLike.isPresent()) {
            // Unlike - delete the like
            postLikeRepository.delete(existingLike.get());
            liked = false;
        } else {
            // Like - create new like
            PostLike newLike = new PostLike(post, currentUser);
            postLikeRepository.save(newLike);
            liked = true;
        }
        
        // Get updated like count
        long likeCount = postLikeRepository.countByPost(post);
        
        return new LikeResponse(likeCount, liked);
    }

    /**
     * Add a comment to a post
     * 
     * @param postId ID of post to comment on
     * @param request Comment creation request
     * @return Created comment response
     */
    public CommentResponse addComment(Long postId, CreateCommentRequest request) {
        Users currentUser = getCurrentUser();
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Create and save comment
        Comment comment = new Comment(post, currentUser, request.getContent());
        comment = commentRepository.save(comment);
        
        return new CommentResponse(comment);
    }

    /**
     * Get all comments for a post
     * 
     * @param postId ID of post to get comments for
     * @return List of comment responses
     */
    public List<CommentResponse> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        List<Comment> comments = commentRepository.findByPostOrderByCreatedAtAsc(post);
        
        return comments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get current authenticated user
     * 
     * @return Current user
     * @throws RuntimeException if user not found or not authenticated
     */
    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get current authenticated user or null if not authenticated
     * Used for public endpoints where authentication is optional
     * 
     * @return Current user or null
     */
    private Users getCurrentUserOrNull() {
        try {
            return getCurrentUser();
        } catch (RuntimeException e) {
            return null;
        }
    }
}
