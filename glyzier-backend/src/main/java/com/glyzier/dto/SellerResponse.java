package com.glyzier.dto;

import com.glyzier.model.Seller;
import com.glyzier.model.Products;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SellerResponse DTO
 * 
 * Data Transfer Object for seller information responses.
 * This DTO is returned to clients when they request seller information.
 * It includes basic seller details and a simplified list of products
 * WITHOUT including the full seller object in each product (prevents circular references).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class SellerResponse {

    private Long sid;
    private String sellername;
    private String storebio;
    private Timestamp createdAt;
    
    // User information (basic)
    private Long userId;
    private String userDisplayName;
    private String userEmail;
    
    // Simplified product list (without circular references)
    private List<SimpleProductInfo> products;
    private Integer productCount;

    /**
     * Inner class for simplified product information
     * Does NOT include seller details to prevent circular references
     */
    public static class SimpleProductInfo {
        private Long pid;
        private String productname;
        private String type;
        private String price;
        private String status;
        private String screenshotPreviewUrl;
        private Timestamp createdAt;
        private Integer qtyonhand;

        public SimpleProductInfo(Products product) {
            this.pid = product.getPid();
            this.productname = product.getProductname();
            this.type = product.getType();
            this.price = product.getPrice() != null ? product.getPrice().toString() : "0.00";
            this.status = product.getStatus();
            this.screenshotPreviewUrl = product.getScreenshotPreviewUrl();
            this.createdAt = product.getCreatedAt();
            this.qtyonhand = product.getInventory() != null ? product.getInventory().getQtyonhand() : 0;
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

        public String getPrice() {
            return price;
        }

        public void setPrice(String price) {
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

        public Integer getQtyonhand() {
            return qtyonhand;
        }

        public void setQtyonhand(Integer qtyonhand) {
            this.qtyonhand = qtyonhand;
        }
    }

    // Constructors

    /**
     * Default constructor
     */
    public SellerResponse() {
        this.products = new ArrayList<>();
        this.productCount = 0;
    }

    /**
     * Constructor from Seller entity
     * Converts a Seller entity to a SellerResponse DTO
     * 
     * @param seller The Seller entity to convert
     */
    public SellerResponse(Seller seller) {
        this.sid = seller.getSid();
        this.sellername = seller.getSellername();
        this.storebio = seller.getStorebio();
        this.createdAt = seller.getCreatedAt();
        
        // Set user information (if available)
        if (seller.getUser() != null) {
            this.userId = seller.getUser().getUserid();
            this.userDisplayName = seller.getUser().getDisplayname();
            this.userEmail = seller.getUser().getEmail();
        }
        
        // Set product information (without circular references)
        if (seller.getProducts() != null) {
            this.products = seller.getProducts().stream()
                    .map(SimpleProductInfo::new)
                    .collect(Collectors.toList());
            this.productCount = this.products.size();
        } else {
            this.products = new ArrayList<>();
            this.productCount = 0;
        }
    }

    // Getters and Setters

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public String getSellername() {
        return sellername;
    }

    public void setSellername(String sellername) {
        this.sellername = sellername;
    }

    public String getStorebio() {
        return storebio;
    }

    public void setStorebio(String storebio) {
        this.storebio = storebio;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<SimpleProductInfo> getProducts() {
        return products;
    }

    public void setProducts(List<SimpleProductInfo> products) {
        this.products = products;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }
}
