package com.glyzier.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * UpdateCartItemRequest - DTO for updating cart item quantity
 * 
 * This DTO validates and carries data when a user updates
 * the quantity of a product in their cart.
 * 
 * Validation rules:
 * - quantity: Required, must be at least 1
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
public class UpdateCartItemRequest {

    /**
     * New quantity for the cart item (must be at least 1)
     */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Constructors

    public UpdateCartItemRequest() {
    }

    public UpdateCartItemRequest(Integer quantity) {
        this.quantity = quantity;
    }

    // Getters and Setters

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "UpdateCartItemRequest{" +
                "quantity=" + quantity +
                '}';
    }
}
