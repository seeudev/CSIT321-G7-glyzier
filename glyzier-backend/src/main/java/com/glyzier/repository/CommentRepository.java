package com.glyzier.repository;

import com.glyzier.model.Comment;
import com.glyzier.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Comment Repository - Module 18: Community Feed
 * 
 * Spring Data JPA repository for managing comments in the database.
 * Provides methods to create, read, and delete comments on posts.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Find all comments for a specific post, ordered by creation date (oldest first)
     * 
     * @param post The post to find comments for
     * @return List of comments for the post
     */
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);

    /**
     * Count comments for a specific post
     * 
     * @param post The post to count comments for
     * @return Number of comments
     */
    long countByPost(Post post);
}
