package com.glyzier.dto;

import java.time.LocalDateTime;

/**
 * FavoriteProductResponse DTO
 * 
 * Data transfer object for returning favorited product information.
 * Includes product details and when it was favorited.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 10)
 */
public class FavoriteProductResponse {
    
    private Long favid;
    private Long pid;
    private String productname;
    private String productdesc;
    private java.math.BigDecimal price;
    private String type;
    private String status;
    private String screenshotPreviewUrl;
    private String sellerName;
    private Long sellerId;
    private LocalDateTime favoritedAt;
    
    // Default constructor
    public FavoriteProductResponse() {}
    
    // Full constructor
    public FavoriteProductResponse(Long favid, Long pid, String productname, String productdesc,
                                   java.math.BigDecimal price, String type, String status,
                                   String screenshotPreviewUrl, String sellerName, Long sellerId,
                                   LocalDateTime favoritedAt) {
        this.favid = favid;
        this.pid = pid;
        this.productname = productname;
        this.productdesc = productdesc;
        this.price = price;
        this.type = type;
        this.status = status;
        this.screenshotPreviewUrl = screenshotPreviewUrl;
        this.sellerName = sellerName;
        this.sellerId = sellerId;
        this.favoritedAt = favoritedAt;
    }
    
    // Getters and Setters
    
    public Long getFavid() {
        return favid;
    }
    
    public void setFavid(Long favid) {
        this.favid = favid;
    }
    
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
    
    public String getProductdesc() {
        return productdesc;
    }
    
    public void setProductdesc(String productdesc) {
        this.productdesc = productdesc;
    }
    
    public java.math.BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(java.math.BigDecimal price) {
        this.price = price;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
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
    
    public String getSellerName() {
        return sellerName;
    }
    
    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }
    
    public Long getSellerId() {
        return sellerId;
    }
    
    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }
    
    public LocalDateTime getFavoritedAt() {
        return favoritedAt;
    }
    
    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
