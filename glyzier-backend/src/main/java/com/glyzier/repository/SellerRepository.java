package com.glyzier.repository;

import com.glyzier.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * SellerRepository - Spring Data JPA repository for Seller entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the Seller entity. Spring Data JPA automatically implements
 * this interface at runtime.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {

    /**
     * Find a seller by the associated user ID
     * This is useful for retrieving a seller's store information
     * based on the logged-in user
     * 
     * Spring Data JPA automatically navigates the relationship:
     * SELECT * FROM seller WHERE userid = ?
     * 
     * @param userid The user ID to search for
     * @return Optional containing the seller if found, empty otherwise
     */
    Optional<Seller> findByUserUserid(Long userid);

    /**
     * Find a seller by store name
     * Useful for searching sellers or checking store name uniqueness
     * 
     * @param sellername The seller name to search for
     * @return Optional containing the seller if found, empty otherwise
     */
    Optional<Seller> findBySellername(String sellername);

    /**
     * Check if a seller exists for a given user ID
     * Useful for determining if a user already has a seller account
     * 
     * @param userid The user ID to check
     * @return true if a seller exists for this user, false otherwise
     */
    boolean existsByUserUserid(Long userid);
}
