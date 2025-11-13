package com.glyzier.dto;

import com.glyzier.model.Cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CartResponse - DTO for shopping cart information
 * 
 * This DTO is returned when retrieving cart details.
 * It includes all cart items and calculated totals.
 * 
 * Pattern: Never return JPA entities directly to clients.
 * This DTO prevents lazy loading issues and controls data exposure.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
public class CartResponse {

    /**
     * Cart ID
     */
    private Long cartid;

    /**
     * User ID who owns this cart
     */
    private Long userid;

    /**
     * List of cart items
     */
    private List<CartItemResponse> items;

    /**
     * Total number of items (sum of quantities)
     */
    private Integer totalItemCount;

    /**
     * Total price (sum of line totals)
     */
    private BigDecimal totalPrice;

    // Constructors

    /**
     * Default constructor
     */
    public CartResponse() {
        this.items = new ArrayList<>();
        this.totalItemCount = 0;
        this.totalPrice = BigDecimal.ZERO;
    }

    /**
     * Constructor from Cart entity
     * 
     * Extracts data from the cart entity and converts all cart items to DTOs.
     * Calculates total item count and total price.
     * 
     * @param cart The cart entity
     */
    public CartResponse(Cart cart) {
        this.cartid = cart.getCartid();
        this.userid = cart.getUser() != null ? cart.getUser().getUserid() : null;

        // Convert cart items to DTOs
        this.items = cart.getCartItems().stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());

        // Calculate totals
        this.totalItemCount = cart.getTotalItemCount();
        this.totalPrice = cart.getCartItems().stream()
                .map(item -> item.getLineTotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Getters and Setters

    public Long getCartid() {
        return cartid;
    }

    public void setCartid(Long cartid) {
        this.cartid = cartid;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public Integer getTotalItemCount() {
        return totalItemCount;
    }

    public void setTotalItemCount(Integer totalItemCount) {
        this.totalItemCount = totalItemCount;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    @Override
    public String toString() {
        return "CartResponse{" +
                "cartid=" + cartid +
                ", userid=" + userid +
                ", itemCount=" + totalItemCount +
                ", totalPrice=" + totalPrice +
                ", items=" + items.size() +
                '}';
    }
}
