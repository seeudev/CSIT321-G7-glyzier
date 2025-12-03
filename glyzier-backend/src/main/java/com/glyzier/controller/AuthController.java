package com.glyzier.controller;

import com.glyzier.dto.AuthResponse;
import com.glyzier.dto.ForgotPasswordRequest;
import com.glyzier.dto.LoginRequest;
import com.glyzier.dto.RegisterRequest;
import com.glyzier.dto.ResetPasswordRequest;
import com.glyzier.service.AuthService;
import com.glyzier.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * 
 * This REST controller handles authentication-related HTTP requests.
 * It provides public endpoints for user registration, login, and password reset.
 * 
 * Endpoints:
 * - POST /api/auth/register - Register a new user
 * - POST /api/auth/login - Login and receive JWT token
 * - POST /api/auth/forgot-password - Request password reset code
 * - POST /api/auth/reset-password - Reset password with code
 * 
 * These endpoints are public (no authentication required) as defined in SecurityConfig.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * Service that handles authentication logic
     */
    @Autowired
    private AuthService authService;
    
    /**
     * Service that handles password reset logic
     */
    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * Register a new user
     * 
     * This endpoint accepts a JSON payload with user registration details
     * and creates a new user account.
     * 
     * Request body example:
     * {
     *   "email": "user@example.com",
     *   "displayname": "John Doe",
     *   "password": "securePassword123"
     * }
     * 
     * Success response (201 Created):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "userid": 1,
     *   "email": "user@example.com",
     *   "displayname": "John Doe",
     *   "seller": false
     * }
     * 
     * Error response (400 Bad Request) if email already exists:
     * {
     *   "error": "Email already registered"
     * }
     * 
     * @param request RegisterRequest containing user registration data
     * @return ResponseEntity with AuthResponse containing JWT token and user info
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Attempt to register the user
            AuthResponse response = authService.register(request);
            
            // Return 201 Created with the auth response
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            // Registration failed (e.g., email already exists)
            // Return 400 Bad Request with error message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Login endpoint
     * 
     * This endpoint accepts user credentials and returns a JWT token
     * if authentication is successful.
     * 
     * Request body example:
     * {
     *   "email": "user@example.com",
     *   "password": "securePassword123"
     * }
     * 
     * Success response (200 OK):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "userid": 1,
     *   "email": "user@example.com",
     *   "displayname": "John Doe",
     *   "seller": false
     * }
     * 
     * Error response (401 Unauthorized) if credentials are invalid:
     * {
     *   "error": "Invalid email or password"
     * }
     * 
     * @param request LoginRequest containing email and password
     * @return ResponseEntity with AuthResponse containing JWT token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Attempt to authenticate the user
            AuthResponse response = authService.login(request);
            
            // Return 200 OK with the auth response
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            // Authentication failed (invalid credentials)
            // Return 401 Unauthorized with error message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Forgot Password endpoint
     * 
     * Sends a 6-digit reset code to the user's email address.
     * The code expires in 10 minutes and can only be used once.
     * 
     * Request body example:
     * {
     *   "email": "user@example.com"
     * }
     * 
     * Success response (200 OK):
     * {
     *   "message": "Password reset code sent to user@example.com"
     * }
     * 
     * Error response (400 Bad Request) if email not found:
     * {
     *   "error": "Email not found"
     * }
     * 
     * @param request ForgotPasswordRequest containing email
     * @return ResponseEntity with success message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String message = passwordResetService.sendResetCode(request);
            return ResponseEntity.ok(new SuccessResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Reset Password endpoint
     * 
     * Resets the user's password using the verification code sent via email.
     * The code must be valid, unused, and not expired.
     * 
     * Request body example:
     * {
     *   "email": "user@example.com",
     *   "code": "123456",
     *   "newPassword": "newSecurePassword123"
     * }
     * 
     * Success response (200 OK):
     * {
     *   "message": "Password reset successfully"
     * }
     * 
     * Error response (400 Bad Request) if code is invalid:
     * {
     *   "error": "Invalid or expired reset code"
     * }
     * 
     * @param request ResetPasswordRequest containing email, code, and new password
     * @return ResponseEntity with success message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            String message = passwordResetService.resetPassword(request);
            return ResponseEntity.ok(new SuccessResponse(message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Simple error response class for consistent error handling
     * Used to return error messages in a structured JSON format
     */
    private static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
    
    /**
     * Simple success response class for consistent response format
     * Used to return success messages in a structured JSON format
     */
    private static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
