package com.glyzier.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * AdminProductResponse - DTO for product information in admin panel
 * 
 * Returns product details formatted for admin moderation screens.
 * Includes seller information and product status.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class AdminProductResponse {

    /**
     * Unique identifier for the product
     */
    private Long pid;

    /**
     * Product name
     */
    private String productname;

    /**
     * Product type/category
     */
    private String type;

    /**
     * Product price
     */
    private BigDecimal price;

    /**
     * Product status (ACTIVE, DELETED)
     */
    private String status;

    /**
     * Screenshot preview URL
     */
    private String screenshotPreviewUrl;

    /**
     * Timestamp of product creation
     */
    private Timestamp createdAt;

    /**
     * ID of the seller who owns this product
     */
    private Long sellerId;

    /**
     * Name of the seller's shop
     */
    private String shopName;

    /**
     * Email of the seller (for contact purposes)
     */
    private String sellerEmail;

    // Constructors

    /**
     * Default constructor
     */
    public AdminProductResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param pid Product ID
     * @param productname Product name
     * @param type Product type
     * @param price Product price
     * @param status Product status
     * @param screenshotPreviewUrl Preview URL
     * @param createdAt Creation timestamp
     * @param sellerId Seller ID
     * @param shopName Shop name
     * @param sellerEmail Seller email
     */
    public AdminProductResponse(Long pid, String productname, String type, BigDecimal price, String status,
                               String screenshotPreviewUrl, Timestamp createdAt, Long sellerId, 
                               String shopName, String sellerEmail) {
        this.pid = pid;
        this.productname = productname;
        this.type = type;
        this.price = price;
        this.status = status;
        this.screenshotPreviewUrl = screenshotPreviewUrl;
        this.createdAt = createdAt;
        this.sellerId = sellerId;
        this.shopName = shopName;
        this.sellerEmail = sellerEmail;
    }

    // Getters and Setters

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getScreenshotPreviewUrl() {
        return screenshotPreviewUrl;
    }

    public void setScreenshotPreviewUrl(String screenshotPreviewUrl) {
        this.screenshotPreviewUrl = screenshotPreviewUrl;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getSellerEmail() {
        return sellerEmail;
    }

    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }
}
