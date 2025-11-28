package com.glyzier.controller;

import com.glyzier.dto.FavoriteProductResponse;
import com.glyzier.dto.FavoriteStatusResponse;
import com.glyzier.service.FavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * FavoritesController
 * 
 * REST API endpoints for favorites/wishlist functionality.
 * All endpoints require authentication (JWT token).
 * 
 * Endpoints:
 * - GET /api/favorites - Get all user's favorites
 * - POST /api/favorites/{pid} - Add product to favorites
 * - DELETE /api/favorites/{pid} - Remove product from favorites
 * - GET /api/favorites/check/{pid} - Check if product is favorited
 * - GET /api/favorites/count - Get count of favorites
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {
    
    @Autowired
    private FavoritesService favoritesService;
    
    /**
     * Get All Favorites Endpoint
     * 
     * Retrieves all products favorited by the authenticated user.
     * Returns complete product information including seller details.
     * 
     * @param authentication Spring Security authentication object
     * @return List of favorited products with HTTP 200
     */
    @GetMapping
    public ResponseEntity<List<FavoriteProductResponse>> getUserFavorites(
            Authentication authentication) {
        String email = authentication.getName();
        List<FavoriteProductResponse> favorites = favoritesService.getUserFavorites(email);
        return ResponseEntity.ok(favorites);
    }
    
    /**
     * Add to Favorites Endpoint
     * 
     * Adds a product to user's favorites.
     * If already favorited, returns existing favorite (idempotent operation).
     * 
     * @param pid Product ID to favorite
     * @param authentication Spring Security authentication object
     * @return Created favorite with HTTP 201 (or 200 if already exists)
     */
    @PostMapping("/{pid}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long pid,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            FavoriteProductResponse favorite = favoritesService.addFavorite(email, pid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product added to favorites");
            response.put("favorite", favorite);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Remove from Favorites Endpoint
     * 
     * Removes a product from user's favorites.
     * 
     * @param pid Product ID to unfavorite
     * @param authentication Spring Security authentication object
     * @return Success message with HTTP 200
     */
    @DeleteMapping("/{pid}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long pid,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            favoritesService.removeFavorite(email, pid);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product removed from favorites");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Check Favorite Status Endpoint
     * 
     * Checks if a specific product is favorited by the user.
     * Useful for displaying heart icon state on product cards.
     * 
     * @param pid Product ID to check
     * @param authentication Spring Security authentication object
     * @return Favorite status (true/false) with HTTP 200
     */
    @GetMapping("/check/{pid}")
    public ResponseEntity<FavoriteStatusResponse> checkFavoriteStatus(
            @PathVariable Long pid,
            Authentication authentication) {
        String email = authentication.getName();
        boolean isFavorited = favoritesService.isFavorited(email, pid);
        
        FavoriteStatusResponse response = new FavoriteStatusResponse(isFavorited, pid);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get Favorites Count Endpoint
     * 
     * Returns total count of user's favorited products.
     * Can be used for navbar badge display.
     * 
     * @param authentication Spring Security authentication object
     * @return Count of favorites with HTTP 200
     */
    @GetMapping("/count")
    public ResponseEntity<?> getFavoritesCount(Authentication authentication) {
        String email = authentication.getName();
        long count = favoritesService.getFavoritesCount(email);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }
}
