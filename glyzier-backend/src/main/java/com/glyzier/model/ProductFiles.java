package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

/**
 * ProductFiles Entity - Represents files associated with a product
 * 
 * This entity maps to the 'product_files' table in the database and stores
 * metadata about files related to products (e.g., images, previews, digital downloads).
 * Each file belongs to one product (many-to-one relationship).
 * 
 * In a production environment, the actual file would be stored in a file storage
 * service like AWS S3, and this entity would store the key/reference to that file.
 * For this university project, file storage is simulated.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "product_files")
public class ProductFiles {

    /**
     * Primary Key: Unique identifier for each product file
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pfileid")
    private Long pfileid;

    /**
     * Storage key or reference for the file
     * In a real system, this would be the S3 key or file path
     * For this project, it's a simulated reference
     */
    @Column(name = "file_key", nullable = false)
    private String fileKey;

    /**
     * Type of file (e.g., "product_image", "preview", "digital_download")
     * Indicates the purpose or category of the file
     */
    @Column(name = "file_type")
    private String fileType;

    /**
     * File format/extension (e.g., "jpg", "png", "pdf", "zip")
     * Used to determine how to handle or display the file
     */
    @Column(name = "file_format")
    private String fileFormat;

    /**
     * Timestamp of when the file was uploaded/created
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    /**
     * Many-to-One relationship with Products entity
     * Foreign key reference to the product this file belongs to
     * A file "belongs to" one product
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", referencedColumnName = "pid", nullable = false)
    private Products product;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public ProductFiles() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param fileKey Storage key for the file
     * @param fileType Type/purpose of the file
     * @param fileFormat Format/extension of the file
     * @param product The product this file belongs to
     */
    public ProductFiles(String fileKey, String fileType, String fileFormat, Products product) {
        this.fileKey = fileKey;
        this.fileType = fileType;
        this.fileFormat = fileFormat;
        this.product = product;
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "ProductFiles{" +
                "pfileid=" + pfileid +
                ", fileKey='" + fileKey + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileFormat='" + fileFormat + '\'' +
                ", createdAt=" + createdAt +
                ", pid=" + (product != null ? product.getPid() : null) +
                '}';
    }
}
