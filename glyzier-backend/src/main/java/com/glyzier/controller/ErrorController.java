package com.glyzier.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Error Controller - Global Error Handling
 * 
 * Handles errors for API requests, particularly 404 Not Found errors.
 * This controller ensures API endpoints return proper JSON error responses
 * instead of HTML error pages.
 * 
 * Important: This only handles errors for /api/** paths.
 * Frontend routes are handled by React Router via WebMvcConfig.
 * 
 * Error response format:
 * {
 *   "error": "Not Found",
 *   "message": "The requested resource was not found",
 *   "status": 404,
 *   "path": "/api/invalid-endpoint"
 * }
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    /**
     * Handle error endpoint
     * 
     * Spring Boot automatically forwards errors to /error.
     * This method intercepts those requests and returns appropriate
     * JSON responses for API calls.
     * 
     * For API paths (/api/**):
     * - Returns JSON error response with status code, message, and path
     * 
     * For non-API paths:
     * - Returns null to let WebMvcConfig forward to React Router
     * 
     * @param request The HTTP request containing error attributes
     * @return ResponseEntity with error details for API calls, null otherwise
     */
    @GetMapping("/error")
    public ResponseEntity<?> handleError(HttpServletRequest request) {
        // Get error attributes
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object requestUri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        
        // If this is an API request, return JSON error
        if (requestUri != null && requestUri.toString().startsWith("/api/")) {
            int statusCode = status != null ? Integer.parseInt(status.toString()) : 500;
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", statusCode);
            errorResponse.put("error", getErrorName(statusCode));
            errorResponse.put("message", getErrorMessage(statusCode));
            errorResponse.put("path", requestUri.toString());
            
            return ResponseEntity.status(statusCode).body(errorResponse);
        }
        
        // For non-API requests, return null to let WebMvcConfig handle it
        // This allows React Router to handle frontend 404s
        return null;
    }
    
    /**
     * Get error name based on status code
     * 
     * @param statusCode HTTP status code
     * @return Human-readable error name
     */
    private String getErrorName(int statusCode) {
        return switch (statusCode) {
            case 400 -> "Bad Request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            case 500 -> "Internal Server Error";
            default -> "Error";
        };
    }
    
    /**
     * Get error message based on status code
     * 
     * @param statusCode HTTP status code
     * @return Human-readable error message
     */
    private String getErrorMessage(int statusCode) {
        return switch (statusCode) {
            case 400 -> "The request was invalid or malformed";
            case 401 -> "Authentication is required to access this resource";
            case 403 -> "You don't have permission to access this resource";
            case 404 -> "The requested API endpoint was not found";
            case 500 -> "An internal server error occurred";
            default -> "An error occurred while processing your request";
        };
    }
}
