package com.glyzier.controller;

import com.glyzier.dto.SellerRegistrationRequest;
import com.glyzier.dto.SellerResponse;
import com.glyzier.model.Seller;
import com.glyzier.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * SellerController - REST API endpoints for seller operations
 * 
 * This controller handles HTTP requests related to sellers in the Glyzier platform.
 * It provides endpoints for:
 * - User registration as a seller ("Become a Seller")
 * - Retrieving seller information
 * 
 * All endpoints that modify data require authentication.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    /**
     * Become a Seller - Register as a seller
     * 
     * Endpoint: POST /api/sellers/register
     * Access: Authenticated users only
     * 
     * This endpoint allows an authenticated user to become a seller.
     * The user's email is extracted from the JWT token via the Authentication object.
     * 
     * Request body should contain:
     * - sellername: Name of the seller's store (required, 3-100 chars)
     * - storebio: Biography/description of the store (optional, max 1000 chars)
     * 
     * @param request The seller registration details
     * @param authentication The Spring Security authentication object (auto-injected)
     * @return ResponseEntity with the created Seller and HTTP 201 (Created)
     * @throws IllegalArgumentException if user not found or already a seller
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerAsSeller(
            @Valid @RequestBody SellerRegistrationRequest request,
            Authentication authentication) {
        
        try {
            // Extract the email from the authenticated user
            // The email is stored as the "username" in the JWT token
            String email = authentication.getName();

            // Call the service to register the user as a seller
            Seller seller = sellerService.registerAsSeller(email, request);

            // Create a success response with DTO (prevents circular references)
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully registered as a seller");
            response.put("seller", new SellerResponse(seller));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors (user not found, already a seller, etc.)
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get seller information by ID
     * 
     * Endpoint: GET /api/sellers/{sid}
     * Access: Public (anyone can view seller profiles)
     * 
     * This endpoint returns information about a specific seller.
     * Useful for displaying seller profile pages.
     * 
     * @param sid The seller ID
     * @return ResponseEntity with the Seller entity and HTTP 200 (OK)
     * @throws IllegalArgumentException if seller not found
     */
    @GetMapping("/{sid}")
    public ResponseEntity<?> getSellerById(@PathVariable Long sid) {
        try {
            Seller seller = sellerService.getSellerById(sid);
            // Return DTO to prevent circular references
            return ResponseEntity.ok(new SellerResponse(seller));
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get current user's seller profile
     * 
     * Endpoint: GET /api/sellers/me
     * Access: Authenticated users only
     * 
     * This endpoint returns the seller profile of the currently authenticated user.
     * Useful for the seller dashboard to load the seller's own information.
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with the Seller entity and HTTP 200 (OK)
     * @throws IllegalArgumentException if user is not a seller
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMySellerProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            Seller seller = sellerService.getSellerByUserEmail(email);
            // Return DTO to prevent circular references
            return ResponseEntity.ok(new SellerResponse(seller));
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Check if current user is a seller
     * 
     * Endpoint: GET /api/sellers/check
     * Access: Authenticated users only
     * 
     * This endpoint checks if the currently authenticated user has a seller account.
     * Useful for the frontend to determine whether to show seller-specific UI elements.
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with seller status and ID (if seller)
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkSellerStatus(Authentication authentication) {
        String email = authentication.getName();
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Seller seller = sellerService.getSellerByUserEmail(email);
            response.put("isSeller", true);
            response.put("sid", seller.getSid());
        } catch (IllegalArgumentException e) {
            // User is not a seller
            response.put("isSeller", false);
            response.put("sid", null);
        }
        
        return ResponseEntity.ok(response);
    }
}
