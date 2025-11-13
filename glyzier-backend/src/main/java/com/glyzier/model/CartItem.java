package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * CartItem Entity - Represents an item in a shopping cart
 * 
 * This entity maps to the 'cart_items' table in the database and stores
 * individual products added to a cart along with their quantities.
 * Each cart item belongs to one cart (many-to-one relationship).
 * Each cart item references one product (many-to-one relationship).
 * 
 * Important: 
 * - A unique constraint prevents duplicate products in the same cart
 * - Price is snapshot at the time of adding to cart for accuracy
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
@Entity
@Table(name = "cart_items", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"cartid", "pid"}))
public class CartItem {

    /**
     * Primary Key: Unique identifier for each cart item
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_itemid")
    private Long cartItemid;

    /**
     * Many-to-One relationship with Cart entity
     * Foreign key reference to the cart this item belongs to
     * A cart item "belongs to" one cart
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartid", referencedColumnName = "cartid", nullable = false)
    private Cart cart;

    /**
     * Many-to-One relationship with Products entity
     * Foreign key reference to the product in this cart item
     * A cart item "contains" one product
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", referencedColumnName = "pid", nullable = false)
    private Products product;

    /**
     * Quantity of the product in the cart
     * Must be greater than 0
     */
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    /**
     * Snapshot price of the product at the time it was added to cart
     * This preserves pricing information even if the product price changes
     * Uses BigDecimal for precise monetary calculations
     */
    @Column(name = "price_snapshot", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceSnapshot;

    /**
     * Timestamp of when the item was added to the cart
     * Automatically set when the entity is first persisted
     * Useful for cleaning up old cart items
     */
    @CreationTimestamp
    @Column(name = "added_at", updatable = false)
    private Timestamp addedAt;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public CartItem() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param cart The cart this item belongs to
     * @param product The product in this cart item
     * @param quantity The quantity of the product
     * @param priceSnapshot The price snapshot at time of adding
     */
    public CartItem(Cart cart, Products product, Integer quantity, BigDecimal priceSnapshot) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.priceSnapshot = priceSnapshot;
    }

    // Getters and Setters

    public Long getCartItemid() {
        return cartItemid;
    }

    public void setCartItemid(Long cartItemid) {
        this.cartItemid = cartItemid;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceSnapshot() {
        return priceSnapshot;
    }

    public void setPriceSnapshot(BigDecimal priceSnapshot) {
        this.priceSnapshot = priceSnapshot;
    }

    public Timestamp getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Timestamp addedAt) {
        this.addedAt = addedAt;
    }

    /**
     * Helper method to calculate the line total for this cart item
     * Line total = quantity * priceSnapshot
     * 
     * @return The total price for this cart item
     */
    public BigDecimal getLineTotal() {
        if (quantity != null && priceSnapshot != null) {
            return priceSnapshot.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "CartItem{" +
                "cartItemid=" + cartItemid +
                ", cartid=" + (cart != null ? cart.getCartid() : null) +
                ", pid=" + (product != null ? product.getPid() : null) +
                ", quantity=" + quantity +
                ", priceSnapshot=" + priceSnapshot +
                ", lineTotal=" + getLineTotal() +
                ", addedAt=" + addedAt +
                '}';
    }
}
