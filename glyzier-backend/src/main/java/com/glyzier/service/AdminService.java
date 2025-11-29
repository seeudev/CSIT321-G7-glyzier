package com.glyzier.service;

import com.glyzier.dto.AdminDashboardStatsResponse;
import com.glyzier.dto.AdminProductResponse;
import com.glyzier.dto.AdminUserResponse;
import com.glyzier.model.Orders;
import com.glyzier.model.Products;
import com.glyzier.model.Seller;
import com.glyzier.model.Users;
import com.glyzier.repository.OrdersRepository;
import com.glyzier.repository.ProductsRepository;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AdminService - Business logic for admin operations
 * 
 * Handles admin-specific functionality including:
 * - Dashboard statistics
 * - User management (ban/unban)
 * - Product moderation (soft delete)
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    /**
     * Get Dashboard Statistics
     * 
     * Retrieves aggregated statistics for the admin dashboard.
     * Calculates total users, products, orders, and revenue.
     * 
     * @return AdminDashboardStatsResponse with all statistics
     */
    public AdminDashboardStatsResponse getDashboardStats() {
        // Count total users
        Long totalUsers = userRepository.count();

        // Count active products (exclude soft-deleted)
        Long totalProducts = productsRepository.countByStatus("ACTIVE");

        // Count all orders
        Long totalOrders = ordersRepository.count();

        // Calculate total revenue from all orders
        List<Orders> orders = ordersRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(Orders::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardStatsResponse(totalUsers, totalProducts, totalOrders, totalRevenue);
    }

    /**
     * Get All Users for Admin Management
     * 
     * Retrieves all users with their role, status, and seller information.
     * Used in the admin user management page.
     * 
     * @return List of AdminUserResponse DTOs
     */
    public List<AdminUserResponse> getAllUsers() {
        List<Users> users = userRepository.findAll();

        return users.stream()
                .map(this::convertToAdminUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Ban a User
     * 
     * Changes user status to BANNED, preventing login.
     * The user will be blocked by JwtAuthFilter on next login attempt.
     * 
     * @param userid The ID of the user to ban
     * @throws RuntimeException if user not found
     */
    @Transactional
    public void banUser(Long userid) {
        Users user = userRepository.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userid));

        user.setStatus("BANNED");
        userRepository.save(user);
    }

    /**
     * Unban a User
     * 
     * Changes user status back to ACTIVE, allowing login.
     * 
     * @param userid The ID of the user to unban
     * @throws RuntimeException if user not found
     */
    @Transactional
    public void unbanUser(Long userid) {
        Users user = userRepository.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userid));

        user.setStatus("ACTIVE");
        userRepository.save(user);
    }

    /**
     * Get All Products for Admin Moderation
     * 
     * Retrieves all products (including soft-deleted) with seller information.
     * Used in the admin product moderation page.
     * 
     * @return List of AdminProductResponse DTOs
     */
    public List<AdminProductResponse> getAllProducts() {
        List<Products> products = productsRepository.findAll();

        return products.stream()
                .map(this::convertToAdminProductResponse)
                .collect(Collectors.toList());
    }

    /**
     * Remove (Soft Delete) a Product
     * 
     * Changes product status to DELETED, hiding it from public view.
     * Product is not physically deleted from database.
     * 
     * @param pid The ID of the product to remove
     * @throws RuntimeException if product not found
     */
    @Transactional
    public void removeProduct(Long pid) {
        Products product = productsRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + pid));

        product.setStatus("DELETED");
        productsRepository.save(product);
    }

    /**
     * Restore a Soft-Deleted Product
     * 
     * Changes product status back to ACTIVE, making it visible again.
     * 
     * @param pid The ID of the product to restore
     * @throws RuntimeException if product not found
     */
    @Transactional
    public void restoreProduct(Long pid) {
        Products product = productsRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + pid));

        product.setStatus("ACTIVE");
        productsRepository.save(product);
    }

    /**
     * Helper method to convert Users entity to AdminUserResponse DTO
     * 
     * @param user The user entity
     * @return AdminUserResponse DTO
     */
    private AdminUserResponse convertToAdminUserResponse(Users user) {
        Seller seller = user.getSeller();
        Long sellerId = seller != null ? seller.getSid() : null;
        String shopName = seller != null ? seller.getSellername() : null;

        return new AdminUserResponse(
                user.getUserid(),
                user.getEmail(),
                user.getDisplayname(),
                user.isAdmin(),
                user.getStatus(),
                user.getPhonenumber(),
                user.getCreatedAt(),
                sellerId,
                shopName
        );
    }

    /**
     * Helper method to convert Products entity to AdminProductResponse DTO
     * 
     * @param product The product entity
     * @return AdminProductResponse DTO
     */
    private AdminProductResponse convertToAdminProductResponse(Products product) {
        Seller seller = product.getSeller();
        Long sellerId = seller != null ? seller.getSid() : null;
        String shopName = seller != null ? seller.getSellername() : null;
        String sellerEmail = seller != null && seller.getUser() != null ? seller.getUser().getEmail() : null;

        return new AdminProductResponse(
                product.getPid(),
                product.getProductname(),
                product.getType(),
                product.getPrice(),
                product.getStatus(),
                product.getScreenshotPreviewUrl(),
                product.getCreatedAt(),
                sellerId,
                shopName,
                sellerEmail
        );
    }
}
