package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Products Entity - Represents a product offered by a seller in the Glyzier platform
 * 
 * This entity maps to the 'products' table in the database and stores
 * information about products that can be purchased by users.
 * Each product belongs to one seller (many-to-one relationship).
 * A product can have multiple product files (one-to-many relationship).
 * A product can be stocked by one inventory record (one-to-one relationship).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "products")
public class Products {

    /**
     * Primary Key: Unique identifier for each product
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pid")
    private Long pid;

    /**
     * Name of the product
     * Displayed to customers browsing the store
     */
    @Column(name = "productname", nullable = false)
    private String productname;

    /**
     * Type of the product (e.g., "Print", "Digital", "Original Art")
     * Indicates the format or category of the product
     */
    @Column(name = "type")
    private String type;

    /**
     * Price of the product in the platform's currency
     * Uses BigDecimal for precise monetary calculations
     */
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Current status of the product (ACTIVE, DELETED)
     * ACTIVE: Product is visible and available for purchase
     * DELETED: Product has been soft-deleted by admin (hidden from public view)
     * Defaults to ACTIVE when product is created
     */
    @Column(name = "status", length = 20, nullable = false)
    private String status = "ACTIVE";

    /**
     * Product description
     * Detailed information about the product features, materials, and benefits
     */
    @Column(name = "productdesc", columnDefinition = "TEXT")
    private String productdesc;

    /**
     * Screenshot preview URL for the product
     * Used as a thumbnail in hero sections, product cards, and carousels
     * This provides a visual preview of the product to customers
     */
    @Column(name = "screenshot_preview_url", length = 2048)
    private String screenshotPreviewUrl;

    /**
     * Timestamp of when the product was created/added
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    /**
     * Many-to-One relationship with Seller entity
     * Foreign key reference to the seller who offers this product
     * A product "is offered by" one seller
     * 
     * @JsonIgnoreProperties prevents circular reference when serializing
     * We ignore the "products" field of the seller to avoid infinite loop
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sid", referencedColumnName = "sid", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"products"})
    private Seller seller;

    /**
     * One-to-Many relationship with ProductFiles entity
     * A product can have multiple associated files (images, previews, digital files)
     * mappedBy indicates that the ProductFiles entity owns the relationship
     * cascade = CascadeType.ALL means operations cascade to product files
     * orphanRemoval = true means if a file is removed from this list, it's deleted
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductFiles> productFiles = new ArrayList<>();

    /**
     * One-to-One relationship with Inventory entity
     * A product is stocked by one inventory record
     * mappedBy indicates that the Inventory entity owns the relationship
     */
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
    private Inventory inventory;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Products() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param productname Name of the product
     * @param type Type/category of the product
     * @param price Price of the product
     * @param status Status of the product
     * @param seller The seller offering this product
     */
    public Products(String productname, String type, BigDecimal price, String status, Seller seller) {
        this.productname = productname;
        this.type = type;
        this.price = price;
        this.status = status;
        this.seller = seller;
    }

    /**
     * Constructor with all fields including screenshot preview URL
     * 
     * @param productname Name of the product
     * @param type Type/category of the product
     * @param price Price of the product
     * @param status Status of the product
     * @param screenshotPreviewUrl Screenshot preview URL for thumbnails
     * @param seller The seller offering this product
     */
    public Products(String productname, String type, BigDecimal price, String status, String screenshotPreviewUrl, Seller seller) {
        this.productname = productname;
        this.type = type;
        this.price = price;
        this.status = status;
        this.screenshotPreviewUrl = screenshotPreviewUrl;
        this.seller = seller;
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

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public List<ProductFiles> getProductFiles() {
        return productFiles;
    }

    public void setProductFiles(List<ProductFiles> productFiles) {
        this.productFiles = productFiles;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    /**
     * Helper method to add a product file to this product
     * Maintains bidirectional relationship consistency
     * 
     * @param productFile The product file to add
     */
    public void addProductFile(ProductFiles productFile) {
        productFiles.add(productFile);
        productFile.setProduct(this);
    }

    /**
     * Helper method to remove a product file from this product
     * Maintains bidirectional relationship consistency
     * 
     * @param productFile The product file to remove
     */
    public void removeProductFile(ProductFiles productFile) {
        productFiles.remove(productFile);
        productFile.setProduct(null);
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "Products{" +
                "pid=" + pid +
                ", productname='" + productname + '\'' +
                ", type='" + type + '\'' +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", sid=" + (seller != null ? seller.getSid() : null) +
                '}';
    }
}
