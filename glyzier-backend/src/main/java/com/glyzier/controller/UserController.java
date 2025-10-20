package com.glyzier.controller;

import com.glyzier.model.Users;
import com.glyzier.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * User Controller
 * 
 * This REST controller handles user-related HTTP requests.
 * It provides secured endpoints for authenticated users to access their own data.
 * 
 * All endpoints in this controller require authentication (valid JWT token).
 * 
 * Endpoints:
 * - GET /api/users/me - Get current user's information
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    /**
     * Service that handles user operations
     */
    @Autowired
    private UserService userService;

    /**
     * Get current authenticated user's information
     * 
     * This endpoint returns the profile information of the currently logged-in user.
     * The user is identified from the JWT token in the Authorization header.
     * 
     * This is useful for:
     * - Displaying user profile in the frontend
     * - Checking if the user is a seller
     * - Getting user ID for other operations
     * 
     * Request:
     * GET /api/users/me
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * 
     * Success response (200 OK):
     * {
     *   "userid": 1,
     *   "email": "user@example.com",
     *   "displayname": "John Doe",
     *   "isSeller": false,
     *   "createdAt": "2024-10-20T10:30:00"
     * }
     * 
     * Error response (401 Unauthorized) if no valid token:
     * {
     *   "error": "Unauthorized - Invalid or missing token"
     * }
     * 
     * @return ResponseEntity with current user's information
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // Get the current authenticated user from the security context
            Users currentUser = userService.getCurrentUser();

            // Build a response with user information
            // We create a custom response object rather than returning the entity directly
            // to have better control over what data is exposed
            Map<String, Object> response = new HashMap<>();
            response.put("userid", currentUser.getUserid());
            response.put("email", currentUser.getEmail());
            response.put("displayname", currentUser.getDisplayname());
            response.put("createdAt", currentUser.getCreatedAt());
            
            // Check if user is also a seller
            boolean isSeller = currentUser.getSeller() != null;
            response.put("isSeller", isSeller);
            
            // If user is a seller, include seller information
            if (isSeller) {
                response.put("sellerid", currentUser.getSeller().getSid());
                response.put("sellername", currentUser.getSeller().getSellername());
            }

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Error getting user (shouldn't happen if JWT is valid)
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Unauthorized: " + e.getMessage()));
        }
    }
}
