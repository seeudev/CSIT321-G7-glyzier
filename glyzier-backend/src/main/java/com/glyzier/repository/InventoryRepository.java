package com.glyzier.repository;

import com.glyzier.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * InventoryRepository - Spring Data JPA repository for Inventory entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the Inventory entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    /**
     * Find inventory record by product ID
     * This is the primary way to retrieve inventory information for a product
     * Since the relationship is one-to-one, this returns a single record
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM inventory WHERE pid = ?
     * 
     * @param pid The product ID
     * @return Optional containing the inventory record if found, empty otherwise
     */
    Optional<Inventory> findByProductPid(Long pid);

    /**
     * Delete inventory record by product ID
     * Useful when removing a product and its associated inventory
     * 
     * @param pid The product ID
     */
    void deleteByProductPid(Long pid);

    /**
     * Check if an inventory record exists for a product
     * Useful for validation before creating inventory records
     * 
     * @param pid The product ID
     * @return true if inventory exists for this product, false otherwise
     */
    boolean existsByProductPid(Long pid);
}
