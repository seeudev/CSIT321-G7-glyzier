package com.glyzier.dto;

import java.math.BigDecimal;

/**
 * AdminDashboardStatsResponse - DTO for admin dashboard statistics
 * 
 * Returns aggregated statistics for the admin dashboard overview.
 * Provides key metrics about the platform's activity and performance.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class AdminDashboardStatsResponse {

    /**
     * Total number of registered users on the platform
     */
    private Long totalUsers;

    /**
     * Total number of products listed on the platform
     * Includes only ACTIVE products (not soft-deleted)
     */
    private Long totalProducts;

    /**
     * Total number of orders placed on the platform
     */
    private Long totalOrders;

    /**
     * Total revenue from all orders
     * Sum of all order totals in the platform's currency
     */
    private BigDecimal totalRevenue;

    // Constructors

    /**
     * Default constructor
     */
    public AdminDashboardStatsResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param totalUsers Total number of users
     * @param totalProducts Total number of products
     * @param totalOrders Total number of orders
     * @param totalRevenue Total revenue from orders
     */
    public AdminDashboardStatsResponse(Long totalUsers, Long totalProducts, Long totalOrders, BigDecimal totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    // Getters and Setters

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
