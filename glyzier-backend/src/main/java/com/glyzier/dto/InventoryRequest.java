package com.glyzier.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * InventoryRequest DTO
 * 
 * Data Transfer Object for setting/updating product inventory.
 * This DTO is used when a seller wants to update the stock quantity for a product.
 * 
 * For this university project, inventory management is simplified.
 * We only track quantity on hand - no complex warehouse logic.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class InventoryRequest {

    /**
     * Quantity on hand (available stock)
     * Must be a non-negative integer
     * For digital products, this can be set to a large number (e.g., 999999)
     * For physical products, this represents actual stock
     */
    @NotNull(message = "Quantity on hand is required")
    @Min(value = 0, message = "Quantity on hand cannot be negative")
    private Integer qtyonhand;

    // Constructors

    /**
     * Default constructor
     */
    public InventoryRequest() {
    }

    /**
     * Constructor with quantity
     * 
     * @param qtyonhand Quantity on hand
     */
    public InventoryRequest(Integer qtyonhand) {
        this.qtyonhand = qtyonhand;
    }

    // Getters and Setters

    public Integer getQtyonhand() {
        return qtyonhand;
    }

    public void setQtyonhand(Integer qtyonhand) {
        this.qtyonhand = qtyonhand;
    }

    @Override
    public String toString() {
        return "InventoryRequest{" +
                "qtyonhand=" + qtyonhand +
                '}';
    }
}
