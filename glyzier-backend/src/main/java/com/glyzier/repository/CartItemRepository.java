package com.glyzier.repository;

import com.glyzier.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CartItemRepository - Data access layer for CartItem entities
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * and custom query methods for the CartItem entity.
 * 
 * Spring Data JPA automatically implements these methods at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Find all cart items for a specific cart
     * 
     * Returns all items in a cart, ordered by when they were added (newest first).
     * 
     * Query equivalent:
     * SELECT * FROM cart_items WHERE cartid = ? ORDER BY added_at DESC
     * 
     * @param cartid The cart's ID
     * @return List of cart items (empty if cart has no items)
     */
    List<CartItem> findByCartCartidOrderByAddedAtDesc(Long cartid);

    /**
     * Find a specific cart item by cart ID and product ID
     * 
     * Due to the unique constraint on (cartid, pid), this will return
     * at most one cart item.
     * 
     * Useful for checking if a product is already in the cart
     * before adding it.
     * 
     * Query equivalent:
     * SELECT * FROM cart_items WHERE cartid = ? AND pid = ?
     * 
     * @param cartid The cart's ID
     * @param pid The product's ID
     * @return Optional containing the cart item if found, empty otherwise
     */
    Optional<CartItem> findByCartCartidAndProductPid(Long cartid, Long pid);

    /**
     * Delete all cart items for a specific cart
     * 
     * This is used when clearing the entire cart.
     * 
     * Query equivalent:
     * DELETE FROM cart_items WHERE cartid = ?
     * 
     * @param cartid The cart's ID
     */
    void deleteByCartCartid(Long cartid);

    /**
     * Delete a specific cart item by cart ID and product ID
     * 
     * This is used when removing a single product from the cart.
     * 
     * Query equivalent:
     * DELETE FROM cart_items WHERE cartid = ? AND pid = ?
     * 
     * @param cartid The cart's ID
     * @param pid The product's ID
     */
    void deleteByCartCartidAndProductPid(Long cartid, Long pid);

    /**
     * Check if a product exists in a cart
     * 
     * This is a convenience method to check existence
     * without loading the entire cart item entity.
     * 
     * Query equivalent:
     * SELECT EXISTS(SELECT 1 FROM cart_items WHERE cartid = ? AND pid = ?)
     * 
     * @param cartid The cart's ID
     * @param pid The product's ID
     * @return true if the product is in the cart, false otherwise
     */
    boolean existsByCartCartidAndProductPid(Long cartid, Long pid);

    /**
     * Count the total number of items in a cart
     * 
     * This sums up the quantities of all cart items.
     * 
     * Custom JPQL query:
     * SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.cartid = :cartid
     * 
     * @param cartid The cart's ID
     * @return Total item count (returns 0 if cart is empty)
     */
    @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart.cartid = :cartid")
    Integer countTotalItemsInCart(@Param("cartid") Long cartid);
}
