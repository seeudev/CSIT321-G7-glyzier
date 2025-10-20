package com.glyzier.dto;

/**
 * OrderItemRequest DTO - Request object for a single order item
 * 
 * This Data Transfer Object is used to capture the product and quantity
 * information when a user wants to place an order.
 * It represents one item (product) that the user wants to purchase.
 * 
 * Used in the PlaceOrderRequest as part of the items list.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class OrderItemRequest {

    /**
     * Product ID - The unique identifier of the product to order
     */
    private Long pid;

    /**
     * Quantity - How many units of this product to order
     */
    private Integer quantity;

    // Constructors

    /**
     * Default constructor
     */
    public OrderItemRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param pid Product ID
     * @param quantity Quantity to order
     */
    public OrderItemRequest(Long pid, Integer quantity) {
        this.pid = pid;
        this.quantity = quantity;
    }

    // Getters and Setters

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "OrderItemRequest{" +
                "pid=" + pid +
                ", quantity=" + quantity +
                '}';
    }
}
