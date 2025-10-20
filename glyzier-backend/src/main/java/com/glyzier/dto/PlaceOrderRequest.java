package com.glyzier.dto;

import java.util.List;

/**
 * PlaceOrderRequest DTO - Request object for placing an order
 * 
 * This Data Transfer Object is used when a user wants to place an order.
 * It contains a list of items (products and quantities) that the user
 * wants to purchase.
 * 
 * The authenticated user information is extracted from the JWT token,
 * so it's not included in this request.
 * 
 * Example JSON:
 * {
 *   "items": [
 *     { "pid": 1, "quantity": 2 },
 *     { "pid": 3, "quantity": 1 }
 *   ]
 * }
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class PlaceOrderRequest {

    /**
     * List of items to order
     * Each item contains a product ID and quantity
     */
    private List<OrderItemRequest> items;

    // Constructors

    /**
     * Default constructor
     */
    public PlaceOrderRequest() {
    }

    /**
     * Constructor with items list
     * 
     * @param items List of order items
     */
    public PlaceOrderRequest(List<OrderItemRequest> items) {
        this.items = items;
    }

    // Getters and Setters

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "PlaceOrderRequest{" +
                "items=" + items +
                '}';
    }
}
