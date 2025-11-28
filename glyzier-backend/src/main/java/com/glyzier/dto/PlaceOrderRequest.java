package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    /**
     * Delivery address for this order. Not persisted to user profile.
     */
    @NotBlank(message = "Delivery address is required")
    private String address;

    /**
     * Simulated card number for payment. Any 16 digits accepted by frontend.
     */
    @NotBlank(message = "Card number is required")
    @Size(min = 16, max = 16, message = "Card number must be 16 digits")
    private String cardNumber;

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

    public PlaceOrderRequest(List<OrderItemRequest> items, String address, String cardNumber) {
        this.items = items;
        this.address = address;
        this.cardNumber = cardNumber;
    }

    // Getters and Setters

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public String toString() {
        return "PlaceOrderRequest{" +
                "items=" + items +
                ", address='" + address + '\'' +
                ", cardNumber='" + (cardNumber != null ? "****" : null) + '\'' +
                '}';
    }
}
