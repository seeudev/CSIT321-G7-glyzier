package com.glyzier.controller;

import com.glyzier.dto.UpdateProfileRequest;
import com.glyzier.dto.ChangePasswordRequest;
import com.glyzier.model.Users;
import com.glyzier.service.UserService;
import jakarta.validation.Valid;
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
 * - PUT /api/users/profile - Update user profile (Module 14)
 * - PUT /api/users/change-password - Change user password (Module 14)
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

    /**
     * Update user profile
     * 
     * This endpoint allows authenticated users to update their profile information.
     * Users can modify their display name and phone number.
     * Email cannot be changed through this endpoint for security reasons.
     * 
     * Module 14 Implementation:
     * - Accepts validated UpdateProfileRequest
     * - Updates current user's profile
     * - Returns updated user information
     * 
     * Request:
     * PUT /api/users/profile
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * Body:
     * {
     *   "displayname": "New Display Name",
     *   "phonenumber": "+1 234 567 8900"
     * }
     * 
     * Success response (200 OK):
     * {
     *   "message": "Profile updated successfully",
     *   "user": {
     *     "userid": 1,
     *     "email": "user@example.com",
     *     "displayname": "New Display Name",
     *     "phonenumber": "+1 234 567 8900"
     *   }
     * }
     * 
     * Error response (400 Bad Request) if validation fails:
     * {
     *   "error": "Display name is required"
     * }
     * 
     * @param request UpdateProfileRequest with new profile data
     * @return ResponseEntity with success message and updated user info
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            // Update the profile through the service
            Users updatedUser = userService.updateProfile(request);

            // Build response with updated user information
            Map<String, Object> userData = new HashMap<>();
            userData.put("userid", updatedUser.getUserid());
            userData.put("email", updatedUser.getEmail());
            userData.put("displayname", updatedUser.getDisplayname());
            userData.put("phonenumber", updatedUser.getPhonenumber());
            userData.put("createdAt", updatedUser.getCreatedAt());

            // Check if user is a seller
            boolean isSeller = updatedUser.getSeller() != null;
            userData.put("isSeller", isSeller);
            
            if (isSeller) {
                userData.put("sellerid", updatedUser.getSeller().getSid());
                userData.put("sellername", updatedUser.getSeller().getSellername());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", userData);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Handle any errors during profile update
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Change user password
     * 
     * This endpoint allows authenticated users to change their password.
     * For security, users must provide their current password, and the new
     * password must match the confirmation.
     * 
     * Module 14 Implementation:
     * - Validates current password is correct
     * - Ensures new password matches confirmation
     * - Encrypts and stores new password
     * - Returns success message
     * 
     * Request:
     * PUT /api/users/change-password
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * Body:
     * {
     *   "currentPassword": "oldpass123",
     *   "newPassword": "newpass456",
     *   "confirmPassword": "newpass456"
     * }
     * 
     * Success response (200 OK):
     * {
     *   "message": "Password changed successfully"
     * }
     * 
     * Error response (400 Bad Request) if validation fails:
     * {
     *   "error": "Current password is incorrect"
     * }
     * 
     * Error response (400 Bad Request) if passwords don't match:
     * {
     *   "error": "New password and confirmation do not match"
     * }
     * 
     * @param request ChangePasswordRequest with current and new passwords
     * @return ResponseEntity with success message
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            // Change password through the service
            userService.changePassword(request);

            // Return success message
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));

        } catch (RuntimeException e) {
            // Handle any errors during password change
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
