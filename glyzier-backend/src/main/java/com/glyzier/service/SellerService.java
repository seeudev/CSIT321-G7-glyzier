package com.glyzier.service;

import com.glyzier.dto.SellerRegistrationRequest;
import com.glyzier.model.Seller;
import com.glyzier.model.Users;
import com.glyzier.repository.SellerRepository;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * SellerService - Business logic for seller-related operations
 * 
 * This service handles all seller-related functionality in the Glyzier platform.
 * It manages the process of users becoming sellers and provides seller information.
 * 
 * Key responsibilities:
 * - Register a user as a seller
 * - Retrieve seller information
 * - Validate seller eligibility
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class SellerService {

    /**
     * Repository for Seller entity operations
     */
    @Autowired
    private SellerRepository sellerRepository;

    /**
     * Repository for Users entity operations
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Register a user as a seller
     * 
     * This method converts an existing user account into a seller account.
     * The user can then list and sell products on the platform.
     * 
     * Process:
     * 1. Retrieve the user by email (from authentication context)
     * 2. Check if the user already has a seller account
     * 3. Create a new Seller entity and link it to the user
     * 4. Save and return the seller entity
     * 
     * @param email The email of the authenticated user
     * @param request The seller registration details (sellername, storebio)
     * @return The newly created Seller entity
     * @throws IllegalArgumentException if user not found or already a seller
     */
    @Transactional
    public Seller registerAsSeller(String email, SellerRegistrationRequest request) {
        // Find the user by email
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Check if user is already a seller
        if (sellerRepository.existsByUserUserid(user.getUserid())) {
            throw new IllegalArgumentException("User is already registered as a seller");
        }

        // Create new Seller entity without checking sellername uniqueness
        // This allows multiple sellers with same name (which is fine for a marketplace)
        Seller seller = new Seller(
                request.getSellername(),
                request.getStorebio(),
                user
        );

        // Save and return
        return sellerRepository.save(seller);
    }

    /**
     * Get seller information by seller ID
     * 
     * @param sid The seller ID
     * @return The Seller entity
     * @throws IllegalArgumentException if seller not found
     */
    public Seller getSellerById(Long sid) {
        return sellerRepository.findById(sid)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found with ID: " + sid));
    }

    /**
     * Get seller information by user email
     * 
     * This is useful for retrieving the seller profile of the currently authenticated user.
     * 
     * @param email The user's email
     * @return The Seller entity
     * @throws IllegalArgumentException if user not found or is not a seller
     */
    public Seller getSellerByUserEmail(String email) {
        // Find the user by email
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Find the seller by user ID
        return sellerRepository.findByUserUserid(user.getUserid())
                .orElseThrow(() -> new IllegalArgumentException("User is not registered as a seller"));
    }

    /**
     * Check if a user is a seller
     * 
     * @param email The user's email
     * @return true if the user is a seller, false otherwise
     */
    public boolean isUserSeller(String email) {
        Users user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }
        return sellerRepository.existsByUserUserid(user.getUserid());
    }

    /**
     * Get all sellers (Module 15 - Public Shop Pages)
     * 
     * This method retrieves all registered sellers for the public shops page.
     * Returns a list of all seller accounts with their basic information.
     * 
     * @return List of all Seller entities
     */
    public java.util.List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }
}
