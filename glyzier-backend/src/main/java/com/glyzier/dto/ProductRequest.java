package com.glyzier.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * ProductRequest DTO
 * 
 * Data Transfer Object for creating and updating products.
 * This DTO is used when a seller wants to add or modify a product.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class ProductRequest {

    /**
     * Name of the product
     * Must not be blank and should be between 3-200 characters
     */
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 200, message = "Product name must be between 3 and 200 characters")
    private String productname;

    /**
     * Type of the product (e.g., "Print", "Digital", "Original Art")
     * Optional field to categorize products
     */
    @Size(max = 50, message = "Product type must not exceed 50 characters")
    private String type;

    /**
     * Price of the product
     * Must be a positive value
     */
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal price;

    /**
     * Status of the product (e.g., "Available", "Sold Out", "Draft")
     * Defaults to "Available" if not specified
     */
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    /**
     * List of file keys for product images/files
     * This is a simulated file upload - we just accept string keys
     * In a real system, these would be S3 keys or file paths
     */
    private List<String> fileKeys;

    // Constructors

    /**
     * Default constructor
     * Initializes fileKeys as an empty list to prevent null pointer exceptions
     */
    public ProductRequest() {
        this.fileKeys = new ArrayList<>();
        this.status = "Available"; // Default status
    }

    /**
     * Constructor with essential fields
     * 
     * @param productname Name of the product
     * @param type Type of the product
     * @param price Price of the product
     * @param status Status of the product
     */
    public ProductRequest(String productname, String type, BigDecimal price, String status) {
        this.productname = productname;
        this.type = type;
        this.price = price;
        this.status = status != null ? status : "Available";
        this.fileKeys = new ArrayList<>();
    }

    // Getters and Setters

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

    public List<String> getFileKeys() {
        return fileKeys;
    }

    public void setFileKeys(List<String> fileKeys) {
        this.fileKeys = fileKeys;
    }

    @Override
    public String toString() {
        return "ProductRequest{" +
                "productname='" + productname + '\'' +
                ", type='" + type + '\'' +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", fileKeys=" + fileKeys +
                '}';
    }
}
