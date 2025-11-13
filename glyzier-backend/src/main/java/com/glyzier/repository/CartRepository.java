package com.glyzier.repository;

import com.glyzier.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * CartRepository - Data access layer for Cart entities
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * and custom query methods for the Cart entity.
 * 
 * Spring Data JPA automatically implements these methods at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Find a cart by user ID
     * 
     * Since each user has exactly one cart (1:1 relationship),
     * this method returns an Optional<Cart>.
     * 
     * Query equivalent:
     * SELECT * FROM cart WHERE userid = ?
     * 
     * @param userid The user's ID
     * @return Optional containing the cart if found, empty otherwise
     */
    Optional<Cart> findByUserUserid(Long userid);

    /**
     * Check if a cart exists for a user
     * 
     * This is a convenience method to check cart existence
     * without loading the entire cart entity.
     * 
     * Query equivalent:
     * SELECT EXISTS(SELECT 1 FROM cart WHERE userid = ?)
     * 
     * @param userid The user's ID
     * @return true if cart exists, false otherwise
     */
    boolean existsByUserUserid(Long userid);

    /**
     * Delete a cart by user ID
     * 
     * This can be used to clear a user's cart entirely.
     * 
     * Query equivalent:
     * DELETE FROM cart WHERE userid = ?
     * 
     * @param userid The user's ID
     */
    void deleteByUserUserid(Long userid);
}
