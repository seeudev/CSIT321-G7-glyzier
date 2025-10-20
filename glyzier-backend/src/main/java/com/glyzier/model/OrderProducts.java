package com.glyzier.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * OrderProducts Entity - Represents the join table between Orders and Products
 * 
 * This entity maps to the 'order_products' table in the database and serves as
 * a join table that connects orders with products. It stores information about
 * each product included in an order, including quantity and snapshot data.
 * 
 * Each order item references both an order and a product (many-to-one relationships).
 * 
 * The snapshot fields (product_name_snapshot, unit_price) preserve the state of
 * the product at the time of purchase, which is important for historical accuracy
 * even if the product details change later.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "order_products")
public class OrderProducts {

    /**
     * Primary Key: Unique identifier for each order-product relationship
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "opid")
    private Long opid;

    /**
     * Snapshot of the product name at the time of order
     * Preserves the product name even if it changes later
     * Important for order history and receipts
     */
    @Column(name = "product_name_snapshot", nullable = false)
    private String productNameSnapshot;

    /**
     * Unit price of the product at the time of order
     * Preserves the price even if the product price changes later
     * Uses BigDecimal for precise monetary calculations
     */
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    /**
     * Quantity of this product ordered
     * For digital products, this might typically be 1
     * For prints or physical items, this can be any positive integer
     */
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    /**
     * Many-to-One relationship with Orders entity
     * Foreign key reference to the order this item belongs to
     * An order item "is contained in" one order
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderid", referencedColumnName = "orderid", nullable = false)
    private Orders order;

    /**
     * Many-to-One relationship with Products entity
     * Foreign key reference to the product being ordered
     * An order item "references" one product
     * Note: This creates a many-to-many relationship between Orders and Products
     * through this join entity
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", referencedColumnName = "pid", nullable = false)
    private Products product;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public OrderProducts() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param productNameSnapshot Snapshot of product name at time of order
     * @param unitPrice Price per unit at time of order
     * @param quantity Quantity ordered
     * @param order The order this item belongs to
     * @param product The product being ordered
     */
    public OrderProducts(String productNameSnapshot, BigDecimal unitPrice, Integer quantity, 
                        Orders order, Products product) {
        this.productNameSnapshot = productNameSnapshot;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.order = order;
        this.product = product;
    }

    // Getters and Setters

    public Long getOpid() {
        return opid;
    }

    public void setOpid(Long opid) {
        this.opid = opid;
    }

    public String getProductNameSnapshot() {
        return productNameSnapshot;
    }

    public void setProductNameSnapshot(String productNameSnapshot) {
        this.productNameSnapshot = productNameSnapshot;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Orders getOrder() {
        return order;
    }

    public void setOrder(Orders order) {
        this.order = order;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    /**
     * Helper method to calculate the line total for this order item
     * 
     * @return The total price for this line item (unit price × quantity)
     */
    public BigDecimal getLineTotal() {
        if (unitPrice != null && quantity != null) {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "OrderProducts{" +
                "opid=" + opid +
                ", productNameSnapshot='" + productNameSnapshot + '\'' +
                ", unitPrice=" + unitPrice +
                ", quantity=" + quantity +
                ", orderid=" + (order != null ? order.getOrderid() : null) +
                ", pid=" + (product != null ? product.getPid() : null) +
                '}';
    }
}
