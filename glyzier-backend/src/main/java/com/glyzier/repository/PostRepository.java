package com.glyzier.repository;

import com.glyzier.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Post Repository - Module 18: Community Feed
 * 
 * Spring Data JPA repository for managing posts in the database.
 * Provides methods to create, read, update, and delete posts.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Find all posts ordered by creation date (newest first)
     * 
     * @return List of posts in chronological order
     */
    List<Post> findAllByOrderByCreatedAtDesc();
}
