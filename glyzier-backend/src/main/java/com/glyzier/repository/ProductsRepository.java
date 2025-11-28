package com.glyzier.repository;

import com.glyzier.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ProductsRepository - Spring Data JPA repository for Products entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the Products entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface ProductsRepository extends JpaRepository<Products, Long> {

    /**
     * Find all products offered by a specific seller
     * This is useful for displaying a seller's product catalog
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM products WHERE sid = ?
     * 
     * @param sid The seller ID
     * @return List of products belonging to this seller
     */
    List<Products> findBySellerSid(Long sid);

    /**
     * Find products by status
     * Useful for filtering products (e.g., only show "Available" products)
     * 
     * @param status The product status to search for
     * @return List of products with the specified status
     */
    List<Products> findByStatus(String status);

    /**
     * Find products by type
     * Useful for filtering by product category (e.g., "Print", "Digital")
     * 
     * @param type The product type to search for
     * @return List of products with the specified type
     */
    List<Products> findByType(String type);

    /**
     * Find products by seller ID and status
     * Useful for showing only available products from a specific seller
     * 
     * @param sid The seller ID
     * @param status The product status
     * @return List of products matching both criteria
     */
    List<Products> findBySellerSidAndStatus(Long sid, String status);

    /**
     * Find products by name containing a search string (case-insensitive)
     * Useful for product search functionality
     * 
     * @param productname The search string
     * @return List of products whose names contain the search string
     */
    List<Products> findByProductnameContainingIgnoreCase(String productname);

    /**
     * Find products by name and type (category)
     * Used for filtered search - search by name within a specific category
     * 
     * @param productname The search string (case-insensitive)
     * @param type The product type/category
     * @return List of products matching both name and type
     */
    List<Products> findByProductnameContainingIgnoreCaseAndType(String productname, String type);
}
