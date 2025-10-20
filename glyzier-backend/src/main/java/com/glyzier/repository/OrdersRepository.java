package com.glyzier.repository;

import com.glyzier.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrdersRepository - Spring Data JPA repository for Orders entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the Orders entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    /**
     * Find all orders placed by a specific user
     * This is useful for displaying a user's order history
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM orders WHERE userid = ?
     * Orders by placed_at timestamp in descending order (newest first)
     * 
     * @param userid The user ID
     * @return List of orders belonging to this user, ordered by date (newest first)
     */
    List<Orders> findByUserUseridOrderByPlacedAtDesc(Long userid);

    /**
     * Find orders by status
     * Useful for admin/seller views to see pending or completed orders
     * 
     * @param status The order status to search for
     * @return List of orders with the specified status
     */
    List<Orders> findByStatus(String status);

    /**
     * Find orders by user ID and status
     * Useful for filtering a user's orders (e.g., only show pending orders)
     * 
     * @param userid The user ID
     * @param status The order status
     * @return List of orders matching both criteria
     */
    List<Orders> findByUserUseridAndStatus(Long userid, String status);

    /**
     * Count orders by user ID
     * Useful for statistics (e.g., "You have placed 10 orders")
     * 
     * @param userid The user ID
     * @return Number of orders placed by this user
     */
    long countByUserUserid(Long userid);
}
