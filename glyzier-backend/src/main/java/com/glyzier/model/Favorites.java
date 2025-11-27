package com.glyzier.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Favorites Entity
 * 
 * Represents a user's favorited/wishlisted product.
 * Many-to-many relationship between users and products.
 * Tracks when a product was added to favorites.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
@Entity
@Table(name = "favorites", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"uid", "pid"}))
public class Favorites {
    
    /**
     * Primary key - auto-generated favorite ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favid;
    
    /**
     * User who favorited the product
     * Many favorites belong to one user
     */
    @ManyToOne
    @JoinColumn(name = "uid", nullable = false)
    private Users user;
    
    /**
     * Favorited product
     * Many favorites can reference one product
     */
    @ManyToOne
    @JoinColumn(name = "pid", nullable = false)
    private Products product;
    
    /**
     * Timestamp when product was favorited
     */
    @Column(name = "favorited_at", nullable = false)
    private LocalDateTime favoritedAt;
    
    /**
     * Default constructor
     * Sets favoritedAt to current timestamp
     */
    public Favorites() {
        this.favoritedAt = LocalDateTime.now();
    }
    
    /**
     * Constructor with user and product
     * @param user The user favoriting the product
     * @param product The product being favorited
     */
    public Favorites(Users user, Products product) {
        this.user = user;
        this.product = product;
        this.favoritedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    
    public Long getFavid() {
        return favid;
    }
    
    public void setFavid(Long favid) {
        this.favid = favid;
    }
    
    public Users getUser() {
        return user;
    }
    
    public void setUser(Users user) {
        this.user = user;
    }
    
    public Products getProduct() {
        return product;
    }
    
    public void setProduct(Products product) {
        this.product = product;
    }
    
    public LocalDateTime getFavoritedAt() {
        return favoritedAt;
    }
    
    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
