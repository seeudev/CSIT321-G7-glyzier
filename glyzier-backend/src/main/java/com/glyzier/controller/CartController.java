package com.glyzier.controller;

import com.glyzier.dto.AddToCartRequest;
import com.glyzier.dto.CartResponse;
import com.glyzier.dto.UpdateCartItemRequest;
import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import com.glyzier.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * CartController - REST API endpoints for shopping cart operations
 * 
 * This controller handles HTTP requests related to shopping carts in the Glyzier platform.
 * All endpoints in this controller are SECURED - they require authentication.
 * 
 * This implements a database-backed shopping cart system for Module 9.
 * - Multi-product cart with persistent storage
 * - Stock validation before adding and at checkout
 * - Quantity updates via dropdown selector
 * - Cart badge count for navbar
 * 
 * Endpoints provided:
 * 1. GET /api/cart - Get current user's cart
 * 2. POST /api/cart/add - Add product to cart
 * 3. PUT /api/cart/update/{pid} - Update cart item quantity
 * 4. DELETE /api/cart/remove/{pid} - Remove product from cart
 * 5. DELETE /api/cart/clear - Clear entire cart
 * 6. GET /api/cart/count - Get cart item count (for badge)
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get the current user's cart
     * 
     * Endpoint: GET /api/cart
     * Access: Authenticated users only
     * 
     * Returns the user's shopping cart with all items, quantities,
     * and calculated totals. Creates a cart if the user doesn't have one yet.
     * 
     * Response includes:
     * - Cart ID
     * - List of cart items with:
     *   - Product details (name, price, seller, etc.)
     *   - Quantity
     *   - Price snapshot (at time of adding)
     *   - Line total
     *   - Available stock
     * - Total item count
     * - Total price
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with CartResponse and HTTP 200 (OK)
     */
    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Get cart from the service
            CartResponse cart = cartService.getCart(user.getUserid());
            
            return ResponseEntity.ok(cart);
            
        } catch (IllegalArgumentException e) {
            // Handle user not found
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while fetching cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Add a product to the cart
     * 
     * Endpoint: POST /api/cart/add
     * Access: Authenticated users only
     * 
     * Adds a product to the user's cart with the specified quantity.
     * 
     * Process:
     * 1. Validates product exists and is available
     * 2. Checks stock availability
     * 3. If product already in cart, increases quantity
     * 4. If new product, creates new cart item
     * 5. Snapshots the price at time of adding
     * 
     * Request body should contain:
     * {
     *   "pid": 1,
     *   "quantity": 2
     * }
     * 
     * Response includes:
     * - Success message
     * - Updated cart details
     * 
     * @param request The add to cart request containing product ID and quantity
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with success message and CartResponse, HTTP 200 (OK)
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Add to cart through the service
            CartResponse cart = cartService.addToCart(user.getUserid(), request.getPid(), request.getQuantity());
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product added to cart successfully");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors (e.g., product not found, insufficient stock)
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while adding to cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update cart item quantity
     * 
     * Endpoint: PUT /api/cart/update/{pid}
     * Access: Authenticated users only
     * 
     * Updates the quantity of a product already in the cart.
     * This is used by the quantity dropdown selector in the UI.
     * 
     * Request body should contain:
     * {
     *   "quantity": 3
     * }
     * 
     * Response includes:
     * - Success message
     * - Updated cart details
     * 
     * @param pid The product ID to update
     * @param request The update request containing new quantity
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with success message and CartResponse, HTTP 200 (OK)
     */
    @PutMapping("/update/{pid}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long pid,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Update cart item through the service
            CartResponse cart = cartService.updateCartItemQuantity(user.getUserid(), pid, request.getQuantity());
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart item updated successfully");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while updating cart item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Remove a product from the cart
     * 
     * Endpoint: DELETE /api/cart/remove/{pid}
     * Access: Authenticated users only
     * 
     * Removes a specific product from the user's cart.
     * 
     * Response includes:
     * - Success message
     * - Updated cart details
     * 
     * @param pid The product ID to remove
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with success message and CartResponse, HTTP 200 (OK)
     */
    @DeleteMapping("/remove/{pid}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long pid,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Remove from cart through the service
            CartResponse cart = cartService.removeFromCart(user.getUserid(), pid);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product removed from cart successfully");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle not found errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while removing from cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Clear the entire cart
     * 
     * Endpoint: DELETE /api/cart/clear
     * Access: Authenticated users only
     * 
     * Removes all products from the user's cart.
     * 
     * Response includes:
     * - Success message
     * - Empty cart details
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with success message and empty CartResponse, HTTP 200 (OK)
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Clear cart through the service
            CartResponse cart = cartService.clearCart(user.getUserid());
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            response.put("cart", cart);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle not found errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while clearing cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get cart item count for badge
     * 
     * Endpoint: GET /api/cart/count
     * Access: Authenticated users only
     * 
     * Returns the total number of items in the cart (sum of quantities).
     * This is used to display the badge count in the navbar.
     * 
     * Response:
     * {
     *   "count": 5
     * }
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with cart item count, HTTP 200 (OK)
     */
    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Get cart item count from the service
            Integer count = cartService.getCartItemCount(user.getUserid());
            
            // Return count
            Map<String, Integer> response = new HashMap<>();
            response.put("count", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Handle errors - return 0 on error
            Map<String, Integer> response = new HashMap<>();
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }
    }
}
