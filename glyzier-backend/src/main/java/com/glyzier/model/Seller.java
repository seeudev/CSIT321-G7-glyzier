package com.glyzier.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Seller Entity - Represents a seller/store owner in the Glyzier platform
 * 
 * This entity maps to the 'seller' table in the database and stores
 * information about sellers who can offer products on the platform.
 * Each seller is associated with one user account (one-to-one relationship).
 * A seller can offer multiple products (one-to-many relationship).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "seller")
public class Seller {

    /**
     * Primary Key: Unique identifier for each seller
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sid")
    private Long sid;

    /**
     * Name of the seller's store or business
     * This is displayed to customers browsing products
     */
    @Column(name = "sellername", nullable = false)
    private String sellername;

    /**
     * Biography or description of the seller's store
     * Provides information about the seller and their offerings
     */
    @Column(name = "storebio", columnDefinition = "TEXT")
    private String storebio;

    /**
     * Timestamp of when the seller account was created
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    /**
     * One-to-One relationship with Users entity
     * Foreign key reference to the user who owns this seller account
     * The seller "is owned by" one user
     * 
     * @JsonBackReference prevents infinite recursion during JSON serialization
     * This is the "child" side of the bidirectional relationship
     * The user field will be excluded from JSON output
     */
    @OneToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false)
    @JsonBackReference
    private Users user;

    /**
     * One-to-Many relationship with Products entity
     * A seller can offer many products
     * mappedBy indicates that the Products entity owns the relationship
     * cascade = CascadeType.ALL means operations cascade to products
     * orphanRemoval = true means if a product is removed from this list, it's deleted
     */
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Products> products = new ArrayList<>();

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Seller() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param sellername Name of the seller's store
     * @param storebio Biography or description of the store
     * @param user The user who owns this seller account
     */
    public Seller(String sellername, String storebio, Users user) {
        this.sellername = sellername;
        this.storebio = storebio;
        this.user = user;
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

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public List<Products> getProducts() {
        return products;
    }

    public void setProducts(List<Products> products) {
        this.products = products;
    }

    /**
     * Helper method to add a product to this seller's offerings
     * Maintains bidirectional relationship consistency
     * 
     * @param product The product to add
     */
    public void addProduct(Products product) {
        products.add(product);
        product.setSeller(this);
    }

    /**
     * Helper method to remove a product from this seller's offerings
     * Maintains bidirectional relationship consistency
     * 
     * @param product The product to remove
     */
    public void removeProduct(Products product) {
        products.remove(product);
        product.setSeller(null);
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "Seller{" +
                "sid=" + sid +
                ", sellername='" + sellername + '\'' +
                ", storebio='" + storebio + '\'' +
                ", createdAt=" + createdAt +
                ", userid=" + (user != null ? user.getUserid() : null) +
                '}';
    }
}
