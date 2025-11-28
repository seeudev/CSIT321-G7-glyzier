package com.glyzier.dto;

import com.glyzier.model.Orders;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

/**
 * OrderResponse DTO - Response object for an order
 * 
 * This Data Transfer Object is used to send order information
 * to the client. It contains the complete order details including
 * all order items.
 * 
 * This is used when returning order information to the user,
 * either as part of order history or when viewing a specific order.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class OrderResponse {

    /**
     * Order ID
     */
    private Long orderid;

    /**
     * Total amount of the order
     */
    private BigDecimal total;

    /**
     * Status of the order (e.g., "Pending", "Completed", "Cancelled")
     */
    private String status;

    /**
     * Timestamp when the order was placed
     */
    private Timestamp placedAt;

    /**
     * User ID who placed the order
     */
    private Long userid;

    /**
     * Display name of the user who placed the order
     */
    private String userDisplayName;

    /**
     * List of items (products) in this order
     */
    private List<OrderProductResponse> items;

    /**
     * Delivery address used for this order
     */
    private String deliveryAddress;

    // Constructors

    /**
     * Default constructor
     */
    public OrderResponse() {
    }

    /**
     * Constructor from Orders entity
     * Converts entity to DTO with all order items
     * 
     * @param order The Orders entity to convert
     */
    public OrderResponse(Orders order) {
        this.orderid = order.getOrderid();
        this.total = order.getTotal();
        this.status = order.getStatus();
        this.placedAt = order.getPlacedAt();
        
        // Extract user information
        if (order.getUser() != null) {
            this.userid = order.getUser().getUserid();
            this.userDisplayName = order.getUser().getDisplayname();
        }
        
        // Convert order products to DTOs
        if (order.getOrderProducts() != null) {
            this.items = order.getOrderProducts().stream()
                    .map(OrderProductResponse::new)
                    .collect(Collectors.toList());
        }
        // Capture delivery address if present
        this.deliveryAddress = order.getDeliveryAddress();
    }

    /**
     * Constructor from Orders entity without items
     * Used for order list/history where full details aren't needed
     * 
     * @param order The Orders entity to convert
     * @param includeItems Whether to include order items
     */
    public OrderResponse(Orders order, boolean includeItems) {
        this.orderid = order.getOrderid();
        this.total = order.getTotal();
        this.status = order.getStatus();
        this.placedAt = order.getPlacedAt();
        
        if (order.getUser() != null) {
            this.userid = order.getUser().getUserid();
            this.userDisplayName = order.getUser().getDisplayname();
        }
        
        // Only include items if requested
        if (includeItems && order.getOrderProducts() != null) {
            this.items = order.getOrderProducts().stream()
                    .map(OrderProductResponse::new)
                    .collect(Collectors.toList());
        }
        this.deliveryAddress = order.getDeliveryAddress();
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

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
    }

    public List<OrderProductResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderProductResponse> items) {
        this.items = items;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
