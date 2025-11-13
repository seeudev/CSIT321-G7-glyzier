package com.glyzier.controller;

import com.glyzier.dto.OrderResponse;
import com.glyzier.dto.PlaceOrderRequest;
import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import com.glyzier.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * OrderController - REST API endpoints for order operations
 * 
 * This controller handles HTTP requests related to orders in the Glyzier platform.
 * All endpoints in this controller are SECURED - they require authentication.
 * 
 * IMPORTANT: This implements a SIMULATED order system for a university project.
 * - No real payment processing
 * - Simplified inventory management
 * - Basic order workflow
 * 
 * Endpoints provided:
 * 1. POST /api/orders/place - Place a new order (authenticated users)
 * 2. GET /api/orders/my-history - Get current user's order history
 * 3. GET /api/orders/{orderid} - Get details of a specific order (ownership verified)
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Place a new order (SIMULATED)
     * 
     * Endpoint: POST /api/orders/place
     * Access: Authenticated users only
     * 
     * This endpoint allows a logged-in user to place an order.
     * The order contains a list of products with quantities.
     * 
     * Process:
     * 1. Authenticates the user
     * 2. Validates product availability and stock
     * 3. Decrements inventory (simulated)
     * 4. Creates order and order items with snapshot data
     * 5. Calculates and sets the total price
     * 6. Returns the created order details
     * 
     * Request body should contain:
     * {
     *   "items": [
     *     { "pid": 1, "quantity": 2 },
     *     { "pid": 3, "quantity": 1 }
     *   ]
     * }
     * 
     * Response includes:
     * - Order ID
     * - Total amount
     * - Status
     * - Timestamp
     * - List of items with snapshot data
     * 
     * @param request The order request containing items and quantities
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with OrderResponse and HTTP 201 (Created)
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Place the order through the service
            OrderResponse order = orderService.placeOrder(user.getUserid(), request);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order placed successfully");
            response.put("order", order);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors (e.g., product not found, insufficient stock)
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while placing the order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get order history for the current user
     * 
     * Endpoint: GET /api/orders/my-history
     * Access: Authenticated users only
     * 
     * This endpoint returns a list of all orders placed by the currently
     * authenticated user, ordered by most recent first.
     * 
     * The response includes basic order information without detailed items
     * for performance (to get full details, use GET /api/orders/{orderid}).
     * 
     * Each order in the response includes:
     * - Order ID
     * - Total amount
     * - Status
     * - Timestamp when placed
     * - User information
     * - (Items are NOT included in this list view)
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with List<OrderResponse> and HTTP 200 (OK)
     */
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyOrderHistory(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Get order history from the service
            List<OrderResponse> orders = orderService.getMyOrderHistory(user.getUserid());
            
            return ResponseEntity.ok(orders);
            
        } catch (IllegalArgumentException e) {
            // Handle user not found
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while fetching order history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get details of a specific order
     * 
     * Endpoint: GET /api/orders/{orderid}
     * Access: Authenticated users only (must own the order)
     * 
     * This endpoint returns complete details of a specific order,
     * including all order items with their snapshot data.
     * 
     * The system verifies that the requesting user owns the order.
     * Users can only view their own orders.
     * 
     * The response includes:
     * - Order ID
     * - Total amount
     * - Status
     * - Timestamp when placed
     * - User information
     * - Complete list of order items with:
     *   - Product ID
     *   - Product name (snapshot from order time)
     *   - Unit price (snapshot from order time)
     *   - Quantity
     *   - Line total
     * 
     * @param orderid The order ID to retrieve
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with OrderResponse and HTTP 200 (OK)
     */
    @GetMapping("/{orderid}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long orderid,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Get order details from the service
            // The service will verify that the user owns this order
            OrderResponse order = orderService.getOrderById(user.getUserid(), orderid);
            
            return ResponseEntity.ok(order);
            
        } catch (IllegalArgumentException e) {
            // Handle order not found or permission errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            // Determine appropriate status code
            HttpStatus status = e.getMessage().contains("permission") 
                    ? HttpStatus.FORBIDDEN 
                    : HttpStatus.NOT_FOUND;
            
            return ResponseEntity.status(status).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while fetching order details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Place an order from the shopping cart (Module 9)
     * 
     * Endpoint: POST /api/orders/place-from-cart
     * Access: Authenticated users only
     * 
     * This endpoint allows a logged-in user to place an order from their shopping cart.
     * All items in the cart are converted to an order, and the cart is cleared afterward.
     * 
     * Process:
     * 1. Validates the cart (not empty, products available, stock sufficient)
     * 2. Converts cart items to order items
     * 3. Places the order
     * 4. Clears the cart
     * 
     * No request body needed - the cart is automatically retrieved.
     * 
     * Response includes:
     * - Order ID
     * - Total amount
     * - Status
     * - Timestamp
     * - List of items with snapshot data
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with OrderResponse and HTTP 201 (Created)
     */
    @PostMapping("/place-from-cart")
    public ResponseEntity<?> placeOrderFromCart(Authentication authentication) {
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Find the user by email
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            
            // Place order from cart through the service
            OrderResponse order = orderService.placeOrderFromCart(user.getUserid());
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order placed successfully from cart");
            response.put("order", order);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors (e.g., empty cart, product not found, insufficient stock)
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            
        } catch (Exception e) {
            // Handle unexpected errors
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred while placing order from cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ==================== OPTIONAL: ADMIN/FUTURE ENDPOINTS ====================
    // These endpoints are not required for Module 4 but are included for potential future use

    /**
     * Get all orders (ADMIN functionality - optional)
     * 
     * Endpoint: GET /api/orders/all
     * Access: Should be restricted to admin users (not implemented in current version)
     * 
     * This endpoint could be used by administrators to view all orders in the system.
     * In a production system, this would require additional role-based access control.
     * 
     * Note: This is commented out as it's not part of the current requirements.
     * Uncomment and add admin role checking if needed in the future.
     */
    /*
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders(Authentication authentication) {
        // TODO: Add admin role check here
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    */

    /**
     * Update order status (ADMIN/SELLER functionality - optional)
     * 
     * Endpoint: PUT /api/orders/{orderid}/status
     * Access: Should be restricted to admin/seller users
     * 
     * This endpoint could be used to update order status (e.g., Pending -> Shipped -> Delivered).
     * In a production system, this would require proper role-based access control.
     * 
     * Note: This is commented out as it's not part of the current requirements.
     * Uncomment and add proper authorization if needed in the future.
     */
    /*
    @PutMapping("/{orderid}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderid,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        
        try {
            // TODO: Add admin/seller role check here
            String newStatus = request.get("status");
            OrderResponse order = orderService.updateOrderStatus(orderid, newStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order status updated successfully");
            response.put("order", order);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    */
}
