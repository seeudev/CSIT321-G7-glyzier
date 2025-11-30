package com.glyzier.dto;

import com.glyzier.model.Products;
import com.glyzier.model.ProductFiles;
import com.glyzier.model.Inventory;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductResponse DTO
 * 
 * Data Transfer Object for product information responses.
 * This DTO is returned to clients when they request product information.
 * It includes product details, seller info, images, and inventory status.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class ProductResponse {

    private Long pid;
    private String productname;
    private String productdesc;
    private String type;
    private BigDecimal price;
    private String status;
    private String screenshotPreviewUrl;
    private Timestamp createdAt;
    
    // Seller information
    private Long sellerId;
    private String sellerName; // Shop name (sellername)
    private String sellerDisplayName; // Actual seller's display name from Users
    private Long sellerUserId; // User ID of the seller for messaging
    
    // Inventory information
    private Integer qtyonhand;
    private Integer availableQuantity;
    private boolean inStock;
    private boolean isUnlimited;
    
    // Product files (images)
    private List<ProductFileInfo> files;

    /**
     * Inner class to represent product file information
     */
    public static class ProductFileInfo {
        private Long pfileid;
        private String fileKey;
        private String fileType;
        private String fileFormat;

        public ProductFileInfo(Long pfileid, String fileKey, String fileType, String fileFormat) {
            this.pfileid = pfileid;
            this.fileKey = fileKey;
            this.fileType = fileType;
            this.fileFormat = fileFormat;
        }

        // Getters and Setters
        public Long getPfileid() {
            return pfileid;
        }

        public void setPfileid(Long pfileid) {
            this.pfileid = pfileid;
        }

        public String getFileKey() {
            return fileKey;
        }

        public void setFileKey(String fileKey) {
            this.fileKey = fileKey;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public String getFileFormat() {
            return fileFormat;
        }

        public void setFileFormat(String fileFormat) {
            this.fileFormat = fileFormat;
        }
    }

    // Constructors

    /**
     * Default constructor
     */
    public ProductResponse() {
        this.files = new ArrayList<>();
    }

    /**
     * Constructor from Products entity
     * Converts a Products entity to a ProductResponse DTO
     * 
     * @param product The Products entity to convert
     */
    public ProductResponse(Products product) {
        this.pid = product.getPid();
        this.productname = product.getProductname();
        this.productdesc = product.getProductdesc();
        this.type = product.getType();
        this.price = product.getPrice();
        this.status = product.getStatus();
        this.screenshotPreviewUrl = product.getScreenshotPreviewUrl();
        this.createdAt = product.getCreatedAt();
        
        // Set seller information
        if (product.getSeller() != null) {
            this.sellerId = product.getSeller().getSid();
            this.sellerName = product.getSeller().getSellername();
            // Set seller's user ID and display name for messaging
            if (product.getSeller().getUser() != null) {
                this.sellerUserId = product.getSeller().getUser().getUserid();
                this.sellerDisplayName = product.getSeller().getUser().getDisplayname();
            }
        }
        
        // Set inventory information
        if (product.getInventory() != null) {
            Inventory inv = product.getInventory();
            this.qtyonhand = inv.getQtyonhand();
            this.isUnlimited = inv.isUnlimited();
            this.availableQuantity = this.isUnlimited ? Integer.MAX_VALUE : inv.getAvailableQuantity();
            this.inStock = inv.isInStock();
        } else {
            this.qtyonhand = 0;
            this.availableQuantity = 0;
            this.inStock = false;
            this.isUnlimited = false;
        }
        
        // Set product files
        if (product.getProductFiles() != null && !product.getProductFiles().isEmpty()) {
            this.files = product.getProductFiles().stream()
                    .map(pf -> new ProductFileInfo(
                            pf.getPfileid(),
                            pf.getFileKey(),
                            pf.getFileType(),
                            pf.getFileFormat()
                    ))
                    .collect(Collectors.toList());
        } else {
            this.files = new ArrayList<>();
        }
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

    public String getProductdesc() {
        return productdesc;
    }

    public void setProductdesc(String productdesc) {
        this.productdesc = productdesc;
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

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public String getSellerDisplayName() {
        return sellerDisplayName;
    }

    public void setSellerDisplayName(String sellerDisplayName) {
        this.sellerDisplayName = sellerDisplayName;
    }

    public Long getSellerUserId() {
        return sellerUserId;
    }

    public void setSellerUserId(Long sellerUserId) {
        this.sellerUserId = sellerUserId;
    }

    public Integer getQtyonhand() {
        return qtyonhand;
    }

    public void setQtyonhand(Integer qtyonhand) {
        this.qtyonhand = qtyonhand;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public List<ProductFileInfo> getFiles() {
        return files;
    }

    public void setFiles(List<ProductFileInfo> files) {
        this.files = files;
    }

    public boolean isUnlimited() {
        return isUnlimited;
    }

    public void setUnlimited(boolean unlimited) {
        isUnlimited = unlimited;
    }
}
