package com.glyzier.repository;

import com.glyzier.model.Post;
import com.glyzier.model.PostLike;
import com.glyzier.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PostLike Repository - Module 18: Community Feed
 * 
 * Spring Data JPA repository for managing post likes in the database.
 * Provides methods to create, read, and delete likes on posts.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    /**
     * Find a like by post and user
     * Used to check if a user has already liked a post
     * 
     * @param post The post
     * @param user The user
     * @return Optional containing the like if it exists
     */
    Optional<PostLike> findByPostAndUser(Post post, Users user);

    /**
     * Count likes for a specific post
     * 
     * @param post The post to count likes for
     * @return Number of likes
     */
    long countByPost(Post post);

    /**
     * Check if a user has liked a post
     * 
     * @param post The post
     * @param user The user
     * @return true if the user has liked the post
     */
    boolean existsByPostAndUser(Post post, Users user);
}
