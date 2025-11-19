package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

/**
 * Inventory Entity - Represents inventory/stock tracking for products
 * 
 * This entity maps to the 'inventory' table in the database and stores
 * stock information for products in the Glyzier platform.
 * Each inventory record is associated with one product (one-to-one relationship).
 * 
 * Note: For this university project, inventory management is simulated and kept simple.
 * In a production system, this would include more sophisticated logic like
 * stock reservations during checkout, automatic reordering, warehouse locations, etc.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "inventory")
public class Inventory {

    /**
     * Primary Key: Unique identifier for each inventory record
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invid")
    private Long invid;

    /**
     * Quantity on hand (available stock)
     * This represents the actual physical or digital stock available
     * For digital products, this could be set to a high number or unlimited (-1)
     * For physical products (prints), this is the actual quantity in stock
     */
    @Column(name = "qtyonhand", nullable = false)
    private Integer qtyonhand;

    /**
     * Quantity reserved (stock held for pending orders)
     * When an order is placed but not yet completed, stock is reserved
     * This prevents overselling while the order is being processed
     * Reserved stock is not available for new orders
     */
    @Column(name = "qtyreserved", nullable = false)
    private Integer qtyreserved;

    /**
     * Timestamp of when the inventory was last updated
     * Automatically updated whenever the entity is modified
     * Useful for tracking inventory changes and auditing
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    /**
     * One-to-One relationship with Products entity
     * Foreign key reference to the product this inventory tracks
     * An inventory record "tracks stock for" one product
     */
    @OneToOne
    @JoinColumn(name = "pid", referencedColumnName = "pid", nullable = false)
    private Products product;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Inventory() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param qtyonhand Quantity available in stock
     * @param qtyreserved Quantity reserved for pending orders
     * @param product The product this inventory tracks
     */
    public Inventory(Integer qtyonhand, Integer qtyreserved, Products product) {
        this.qtyonhand = qtyonhand;
        this.qtyreserved = qtyreserved;
        this.product = product;
    }

    // Getters and Setters

    public Long getInvid() {
        return invid;
    }

    public void setInvid(Long invid) {
        this.invid = invid;
    }

    public Integer getQtyonhand() {
        return qtyonhand;
    }

    public void setQtyonhand(Integer qtyonhand) {
        this.qtyonhand = qtyonhand;
    }

    public Integer getQtyreserved() {
        return qtyreserved;
    }

    public void setQtyreserved(Integer qtyreserved) {
        this.qtyreserved = qtyreserved;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    /**
     * Helper method to calculate available quantity
     * Available = On Hand - Reserved
     * For digital products with unlimited inventory, qtyonhand = -1
     * 
     * @return The quantity available for new orders, or Integer.MAX_VALUE if unlimited
     */
    public Integer getAvailableQuantity() {
        if (qtyonhand != null && qtyonhand == -1) {
            return Integer.MAX_VALUE; // Unlimited
        }
        if (qtyonhand != null && qtyreserved != null) {
            return qtyonhand - qtyreserved;
        }
        return 0;
    }

    /**
     * Helper method to check if product is in stock
     * For digital products with unlimited inventory (-1), always returns true
     * 
     * @return true if available quantity > 0 or unlimited, false otherwise
     */
    public boolean isInStock() {
        if (qtyonhand != null && qtyonhand == -1) {
            return true; // Unlimited stock
        }
        return getAvailableQuantity() > 0;
    }

    /**
     * Helper method to check if inventory is unlimited
     * Digital products use -1 to represent unlimited stock
     * 
     * @return true if qtyonhand is -1 (unlimited), false otherwise
     */
    public boolean isUnlimited() {
        return qtyonhand != null && qtyonhand == -1;
    }

    /**
     * Helper method to reserve stock for an order (simulated logic)
     * In a real system, this would be part of a transaction
     * For unlimited inventory, reservations are not tracked
     * 
     * @param quantity Amount to reserve
     * @return true if successful, false if insufficient stock
     */
    public boolean reserveStock(Integer quantity) {
        if (qtyonhand != null && qtyonhand == -1) {
            return true; // Unlimited stock, always available
        }
        if (getAvailableQuantity() >= quantity) {
            this.qtyreserved += quantity;
            return true;
        }
        return false;
    }

    /**
     * Helper method to release reserved stock (simulated logic)
     * Used when an order is cancelled or completed
     * 
     * @param quantity Amount to release
     */
    public void releaseReservedStock(Integer quantity) {
        this.qtyreserved = Math.max(0, this.qtyreserved - quantity);
    }

    /**
     * Helper method to fulfill an order (simulated logic)
     * Decrements both reserved and on-hand quantities
     * For unlimited inventory (-1), quantities remain unchanged
     * 
     * @param quantity Amount to fulfill
     */
    public void fulfillOrder(Integer quantity) {
        if (qtyonhand != null && qtyonhand == -1) {
            return; // Unlimited stock, no need to decrement
        }
        this.qtyreserved = Math.max(0, this.qtyreserved - quantity);
        this.qtyonhand = Math.max(0, this.qtyonhand - quantity);
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "Inventory{" +
                "invid=" + invid +
                ", qtyonhand=" + qtyonhand +
                ", qtyreserved=" + qtyreserved +
                ", availableQuantity=" + getAvailableQuantity() +
                ", updatedAt=" + updatedAt +
                ", pid=" + (product != null ? product.getPid() : null) +
                '}';
    }
}
