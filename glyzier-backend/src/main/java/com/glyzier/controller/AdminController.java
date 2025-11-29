package com.glyzier.controller;

import com.glyzier.dto.AdminDashboardStatsResponse;
import com.glyzier.dto.AdminProductResponse;
import com.glyzier.dto.AdminUserResponse;
import com.glyzier.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController - REST endpoints for admin operations
 * 
 * Handles all admin-specific functionality:
 * - Dashboard statistics
 * - User management (ban/unban)
 * - Product moderation (remove/restore)
 * 
 * All endpoints require ADMIN role (enforced by SecurityConfig).
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get Dashboard Statistics
     * 
     * Endpoint: GET /api/admin/dashboard/stats
     * 
     * Returns aggregated statistics for the admin dashboard:
     * - Total users
     * - Total products
     * - Total orders
     * - Total revenue
     * 
     * @return AdminDashboardStatsResponse with all statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get All Users
     * 
     * Endpoint: GET /api/admin/users
     * 
     * Returns a list of all users with their role, status, and seller information.
     * Used in the admin user management page.
     * 
     * @return List of AdminUserResponse DTOs
     */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Ban a User
     * 
     * Endpoint: POST /api/admin/users/{userid}/ban
     * 
     * Changes user status to BANNED, preventing login.
     * The user will be blocked by JwtAuthFilter on next login attempt.
     * 
     * @param userid The ID of the user to ban
     * @return Success message
     */
    @PostMapping("/users/{userid}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long userid) {
        try {
            adminService.banUser(userid);
            return ResponseEntity.ok().body("{\"message\": \"User banned successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Unban a User
     * 
     * Endpoint: POST /api/admin/users/{userid}/unban
     * 
     * Changes user status back to ACTIVE, allowing login.
     * 
     * @param userid The ID of the user to unban
     * @return Success message
     */
    @PostMapping("/users/{userid}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long userid) {
        try {
            adminService.unbanUser(userid);
            return ResponseEntity.ok().body("{\"message\": \"User unbanned successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Get All Products
     * 
     * Endpoint: GET /api/admin/products
     * 
     * Returns a list of all products (including soft-deleted) with seller information.
     * Used in the admin product moderation page.
     * 
     * @return List of AdminProductResponse DTOs
     */
    @GetMapping("/products")
    public ResponseEntity<List<AdminProductResponse>> getAllProducts() {
        List<AdminProductResponse> products = adminService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * Remove (Soft Delete) a Product
     * 
     * Endpoint: DELETE /api/admin/products/{pid}
     * 
     * Changes product status to DELETED, hiding it from public view.
     * Product is not physically deleted from database.
     * 
     * @param pid The ID of the product to remove
     * @return Success message
     */
    @DeleteMapping("/products/{pid}")
    public ResponseEntity<?> removeProduct(@PathVariable Long pid) {
        try {
            adminService.removeProduct(pid);
            return ResponseEntity.ok().body("{\"message\": \"Product removed successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Restore a Soft-Deleted Product
     * 
     * Endpoint: POST /api/admin/products/{pid}/restore
     * 
     * Changes product status back to ACTIVE, making it visible again.
     * 
     * @param pid The ID of the product to restore
     * @return Success message
     */
    @PostMapping("/products/{pid}/restore")
    public ResponseEntity<?> restoreProduct(@PathVariable Long pid) {
        try {
            adminService.restoreProduct(pid);
            return ResponseEntity.ok().body("{\"message\": \"Product restored successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
