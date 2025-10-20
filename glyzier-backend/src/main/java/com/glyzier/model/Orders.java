package com.glyzier.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Orders Entity - Represents a customer order in the Glyzier platform
 * 
 * This entity maps to the 'orders' table in the database and stores
 * information about orders placed by users.
 * Each order belongs to one user (many-to-one relationship).
 * An order contains multiple order items through Order_Products (one-to-many relationship).
 * 
 * Note: For this university project, payment processing is simulated.
 * No real payment gateway integration is implemented.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "orders")
public class Orders {

    /**
     * Primary Key: Unique identifier for each order
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderid")
    private Long orderid;

    /**
     * Total amount for the order
     * Uses BigDecimal for precise monetary calculations
     * This is the sum of all items in the order
     */
    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    /**
     * Current status of the order (e.g., "Pending", "Completed", "Cancelled", "Shipped")
     * Used to track the order's progress through fulfillment
     */
    @Column(name = "status", nullable = false)
    private String status;

    /**
     * Timestamp of when the order was placed
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "placed_at", updatable = false)
    private Timestamp placedAt;

    /**
     * Many-to-One relationship with Users entity
     * Foreign key reference to the user who placed this order
     * An order "is placed by" one user
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", referencedColumnName = "userid", nullable = false)
    private Users user;

    /**
     * One-to-Many relationship with Order_Products entity
     * An order contains many order items (products)
     * mappedBy indicates that the Order_Products entity owns the relationship
     * cascade = CascadeType.ALL means operations cascade to order items
     * orphanRemoval = true means if an item is removed from this list, it's deleted
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProducts> orderProducts = new ArrayList<>();

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Orders() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param total Total amount of the order
     * @param status Status of the order
     * @param user The user who placed the order
     */
    public Orders(BigDecimal total, String status, Users user) {
        this.total = total;
        this.status = status;
        this.user = user;
    }

    // Getters and Setters

    public Long getOrderid() {
        return orderid;
    }

    public void setOrderid(Long orderid) {
        this.orderid = orderid;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(Timestamp placedAt) {
        this.placedAt = placedAt;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public List<OrderProducts> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProducts> orderProducts) {
        this.orderProducts = orderProducts;
    }

    /**
     * Helper method to add an order item to this order
     * Maintains bidirectional relationship consistency
     * 
     * @param orderProduct The order item to add
     */
    public void addOrderProduct(OrderProducts orderProduct) {
        orderProducts.add(orderProduct);
        orderProduct.setOrder(this);
    }

    /**
     * Helper method to remove an order item from this order
     * Maintains bidirectional relationship consistency
     * 
     * @param orderProduct The order item to remove
     */
    public void removeOrderProduct(OrderProducts orderProduct) {
        orderProducts.remove(orderProduct);
        orderProduct.setOrder(null);
    }

    /**
     * Override toString for debugging purposes
     */
    @Override
    public String toString() {
        return "Orders{" +
                "orderid=" + orderid +
                ", total=" + total +
                ", status='" + status + '\'' +
                ", placedAt=" + placedAt +
                ", userid=" + (user != null ? user.getUserid() : null) +
                '}';
    }
}
