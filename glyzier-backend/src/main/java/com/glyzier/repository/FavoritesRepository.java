package com.glyzier.repository;

import com.glyzier.model.Favorites;
import com.glyzier.model.Users;
import com.glyzier.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * FavoritesRepository
 * 
 * Spring Data JPA repository for Favorites entity.
 * Provides CRUD operations and custom queries for favorites/wishlist functionality.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
@Repository
public interface FavoritesRepository extends JpaRepository<Favorites, Long> {
    
    /**
     * Find all favorites for a specific user
     * @param user The user whose favorites to retrieve
     * @return List of user's favorited products
     */
    List<Favorites> findByUser(Users user);
    
    /**
     * Find a specific favorite by user and product
     * Used to check if a product is already favorited
     * @param user The user
     * @param product The product
     * @return Optional containing the favorite if exists
     */
    Optional<Favorites> findByUserAndProduct(Users user, Products product);
    
    /**
     * Check if a user has favorited a specific product
     * @param user The user
     * @param product The product
     * @return true if favorited, false otherwise
     */
    boolean existsByUserAndProduct(Users user, Products product);
    
    /**
     * Delete a favorite by user and product
     * @param user The user
     * @param product The product
     */
    void deleteByUserAndProduct(Users user, Products product);
    
    /**
     * Count total favorites for a user
     * @param user The user
     * @return Count of favorited products
     */
    long countByUser(Users user);
}
