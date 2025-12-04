package com.glyzier.model;

import jakarta.persistence.*;

/**
 * PostLike Entity - Module 18: Community Feed
 * 
 * Represents a like on a post.
 * Each user can only like a post once (enforced by composite unique constraint).
 * 
 * Features:
 * - Links a user to a post they liked
 * - Composite unique constraint prevents duplicate likes
 * - No timestamp needed (simple like/unlike toggle)
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(
    name = "post_likes",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"post_id", "user_id"},
        name = "uk_post_likes_post_user"
    )
)
public class PostLike {

    /**
     * Primary key - auto-generated like ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Post that was liked
     * Many likes can belong to one post
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    /**
     * User who liked the post
     * Many likes can belong to one user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // Constructors

    /**
     * Default constructor (required by JPA)
     */
    public PostLike() {
    }

    /**
     * Constructor with post and user
     * 
     * @param post Post being liked
     * @param user User liking the post
     */
    public PostLike(Post post, Users user) {
        this.post = post;
        this.user = user;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}
