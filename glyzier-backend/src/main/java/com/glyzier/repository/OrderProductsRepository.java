package com.glyzier.repository;

import com.glyzier.model.OrderProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * OrderProductsRepository - Spring Data JPA repository for OrderProducts entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the OrderProducts (join table) entity. Spring Data JPA automatically
 * implements this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface OrderProductsRepository extends JpaRepository<OrderProducts, Long> {

    /**
     * Find all order items for a specific order
     * This is useful for retrieving the complete order details
     * (what products were included in an order)
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM order_products WHERE orderid = ?
     * 
     * @param orderid The order ID
     * @return List of order items belonging to this order
     */
    List<OrderProducts> findByOrderOrderid(Long orderid);

    /**
     * Find all order items containing a specific product
     * Useful for tracking which orders included a particular product
     * (e.g., for product analytics or fulfillment)
     * 
     * @param pid The product ID
     * @return List of order items containing this product
     */
    List<OrderProducts> findByProductPid(Long pid);

    /**
     * Delete all order items for a specific order
     * Used when cancelling an order (though cascade should handle this)
     * 
     * @param orderid The order ID
     */
    void deleteByOrderOrderid(Long orderid);
    
    /**
     * Check if User Purchased Product
     * 
     * Verifies if a user has purchased a specific product in any order.
     * Used for purchase verification before allowing digital product downloads.
     * 
     * Query: Check if OrderProducts record exists where:
     * - order.user.userid = userId
     * - product.pid = productId
     * 
     * @param userId User ID to check
     * @param productId Product ID to check
     * @return true if user purchased this product, false otherwise
     */
    boolean existsByOrderUserUseridAndProductPid(Long userId, Long productId);
}
