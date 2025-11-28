package com.glyzier.controller;

import com.glyzier.dto.InventoryRequest;
import com.glyzier.dto.ProductRequest;
import com.glyzier.dto.ProductResponse;
import com.glyzier.service.ProductService;
import com.glyzier.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProductController - REST API endpoints for product operations
 * 
 * This controller handles HTTP requests related to products in the Glyzier platform.
 * It provides both public endpoints (for browsing products) and secured endpoints
 * (for sellers to manage their products).
 * 
 * Endpoints are organized into two categories:
 * 1. Public endpoints - Anyone can access these (GET requests)
 * 2. Seller endpoints - Require authentication and seller status (POST, PUT, DELETE)
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private SellerService sellerService;

    // ==================== SELLER ENDPOINTS (Protected) ====================

    /**
     * Create a new product
     * 
     * Endpoint: POST /api/products
     * Access: Authenticated sellers only
     * 
     * This endpoint allows a seller to create a new product.
     * The product is automatically linked to the authenticated seller.
     * 
     * Request body should contain:
     * - productname: Name of the product (required, 3-200 chars)
     * - type: Type of product (optional, max 50 chars)
     * - price: Price in decimal format (required, positive)
     * - status: Product status (optional, defaults to "Available")
     * - fileKeys: List of file keys for product images (optional, simulated)
     * 
     * @param request The product details
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with the created ProductResponse and HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<?> createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Get the seller ID for this user
            Long sellerId = sellerService.getSellerByUserEmail(email).getSid();
            
            // Create the product
            ProductResponse product = productService.createProductForSeller(sellerId, request);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product created successfully");
            response.put("product", product);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Update an existing product
     * 
     * Endpoint: PUT /api/products/{pid}
     * Access: Authenticated sellers only (must own the product)
     * 
     * This endpoint allows a seller to update their product.
     * The system verifies that the authenticated seller owns the product.
     * 
     * @param pid The product ID to update
     * @param request The updated product details
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with the updated ProductResponse and HTTP 200 (OK)
     */
    @PutMapping("/{pid}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long pid,
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Get the seller ID for this user
            Long sellerId = sellerService.getSellerByUserEmail(email).getSid();
            
            // Update the product (service will verify ownership)
            ProductResponse product = productService.updateProduct(sellerId, pid, request);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product updated successfully");
            response.put("product", product);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors or permission errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            // Determine appropriate status code
            HttpStatus status = e.getMessage().contains("permission") 
                    ? HttpStatus.FORBIDDEN 
                    : HttpStatus.BAD_REQUEST;
                    
            return ResponseEntity.status(status).body(error);
        }
    }

    /**
     * Delete a product
     * 
     * Endpoint: DELETE /api/products/{pid}
     * Access: Authenticated sellers only (must own the product)
     * 
     * This endpoint allows a seller to delete their product.
     * The system verifies that the authenticated seller owns the product.
     * Associated ProductFiles and Inventory records are also deleted (cascade).
     * 
     * @param pid The product ID to delete
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with success message and HTTP 200 (OK)
     */
    @DeleteMapping("/{pid}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long pid,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Get the seller ID for this user
            Long sellerId = sellerService.getSellerByUserEmail(email).getSid();
            
            // Delete the product (service will verify ownership)
            productService.deleteProduct(sellerId, pid);
            
            // Return success response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors or permission errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            // Determine appropriate status code
            HttpStatus status = e.getMessage().contains("permission") 
                    ? HttpStatus.FORBIDDEN 
                    : HttpStatus.BAD_REQUEST;
                    
            return ResponseEntity.status(status).body(error);
        }
    }

    /**
     * Set or update product inventory (simulated)
     * 
     * Endpoint: POST /api/products/{pid}/inventory
     * Access: Authenticated sellers only (must own the product)
     * 
     * This endpoint allows a seller to set the quantity on hand for their product.
     * This is a simulated inventory system - in a real system, this would involve
     * warehouse management, stock reservations, etc.
     * 
     * Request body should contain:
     * - qtyonhand: Quantity available (required, non-negative integer)
     * 
     * @param pid The product ID
     * @param request The inventory details
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity with updated ProductResponse and HTTP 200 (OK)
     */
    @PostMapping("/{pid}/inventory")
    public ResponseEntity<?> setProductInventory(
            @PathVariable Long pid,
            @Valid @RequestBody InventoryRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String email = authentication.getName();
            
            // Get the seller ID for this user
            Long sellerId = sellerService.getSellerByUserEmail(email).getSid();
            
            // Update inventory (service will verify ownership)
            ProductResponse product = productService.setProductInventory(sellerId, pid, request);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Inventory updated successfully");
            response.put("product", product);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors or permission errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            
            // Determine appropriate status code
            HttpStatus status = e.getMessage().contains("permission") 
                    ? HttpStatus.FORBIDDEN 
                    : HttpStatus.BAD_REQUEST;
                    
            return ResponseEntity.status(status).body(error);
        }
    }

    // ==================== PUBLIC ENDPOINTS ====================

    /**
     * Get all products (paginated)
     * 
     * Endpoint: GET /api/products
     * Access: Public (no authentication required)
     * 
     * This endpoint returns a paginated list of all products.
     * Anyone can browse products, even without logging in.
     * 
     * Query parameters:
     * - page: Page number (default: 0)
     * - size: Items per page (default: 20)
     * 
     * @param page The page number (0-indexed)
     * @param size The number of items per page
     * @return ResponseEntity with Page<ProductResponse> and HTTP 200 (OK)
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Create pageable object
        Pageable pageable = PageRequest.of(page, size);
        
        // Get paginated products
        Page<ProductResponse> products = productService.getAllProducts(pageable);
        
        return ResponseEntity.ok(products);
    }

    /**
     * Get a single product by ID
     * 
     * Endpoint: GET /api/products/{pid}
     * Access: Public (no authentication required)
     * 
     * This endpoint returns detailed information about a specific product.
     * Includes ProductFiles (images) and Inventory information.
     * 
     * @param pid The product ID
     * @return ResponseEntity with ProductResponse and HTTP 200 (OK)
     */
    @GetMapping("/{pid}")
    public ResponseEntity<?> getProductById(@PathVariable Long pid) {
        try {
            ProductResponse product = productService.getProductById(pid);
            return ResponseEntity.ok(product);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get all products for a specific seller
     * 
     * Endpoint: GET /api/sellers/{sid}/products
     * Access: Public (no authentication required)
     * 
     * This endpoint returns all products offered by a specific seller.
     * Useful for displaying a seller's catalog/portfolio.
     * 
     * Note: This endpoint is actually mapped in the seller namespace
     * (/api/sellers/{sid}/products) but is handled by ProductController
     * for logical organization since it returns product data.
     * 
     * @param sid The seller ID
     * @return ResponseEntity with List<ProductResponse> and HTTP 200 (OK)
     */
    @GetMapping("/seller/{sid}")
    public ResponseEntity<?> getProductsBySeller(@PathVariable Long sid) {
        try {
            List<ProductResponse> products = productService.getProductsBySeller(sid);
            return ResponseEntity.ok(products);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Search products by name and optionally filter by category
     * 
     * Endpoint: GET /api/products/search
     * Access: Public (no authentication required)
     * 
     * Module 11 - Basic Search & Filter
     * 
     * This endpoint allows users to search for products by name.
     * Results can be filtered by category (product type).
     * Search is case-insensitive and uses LIKE pattern matching.
     * 
     * Query parameters:
     * - query: Search string (required) - searches in product name
     * - category: Product type/category (optional) - filters results
     * 
     * Examples:
     * - /api/products/search?query=abstract
     * - /api/products/search?query=painting&category=Print
     * - /api/products/search?query=landscape&category=Original
     * 
     * @param query The search query string (required)
     * @param category Optional category filter
     * @return ResponseEntity with List<ProductResponse> and count, HTTP 200 (OK)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String query,
            @RequestParam(required = false) String category) {
        
        try {
            // Perform search
            List<ProductResponse> products = productService.searchProducts(query, category);
            
            // Build response with results and count
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("count", products.size());
            response.put("query", query);
            if (category != null && !category.trim().isEmpty()) {
                response.put("category", category);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle validation errors
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
