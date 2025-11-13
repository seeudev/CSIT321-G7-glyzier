package com.glyzier.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * AddToCartRequest - DTO for adding a product to the cart
 * 
 * This DTO validates and carries data when a user adds a product to their cart.
 * 
 * Validation rules:
 * - pid: Required, must reference a valid product
 * - quantity: Required, must be at least 1
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
public class AddToCartRequest {

    /**
     * Product ID to add to the cart
     */
    @NotNull(message = "Product ID is required")
    private Long pid;

    /**
     * Quantity to add (must be at least 1)
     */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Constructors

    public AddToCartRequest() {
    }

    public AddToCartRequest(Long pid, Integer quantity) {
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
        return "AddToCartRequest{" +
                "pid=" + pid +
                ", quantity=" + quantity +
                '}';
    }
}
