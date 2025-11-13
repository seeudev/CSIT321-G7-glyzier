package com.glyzier.dto;

import com.glyzier.model.CartItem;
import com.glyzier.model.Products;

import java.math.BigDecimal;

/**
 * CartItemResponse - DTO for cart item information
 * 
 * This DTO is returned when retrieving cart items.
 * It includes product details along with cart-specific information
 * like quantity and snapshot price.
 * 
 * Pattern: Never return JPA entities directly to clients.
 * This DTO prevents lazy loading issues and controls data exposure.
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 9)
 */
public class CartItemResponse {

    /**
     * Cart item ID
     */
    private Long cartItemid;

    /**
     * Product ID
     */
    private Long pid;

    /**
     * Product name
     */
    private String productname;

    /**
     * Product type/category
     */
    private String type;

    /**
     * Product status (Available, Sold Out, etc.)
     */
    private String status;

    /**
     * Seller ID who offers this product
     */
    private Long sellerId;

    /**
     * Seller shop name
     */
    private String sellerName;

    /**
     * Quantity in cart
     */
    private Integer quantity;

    /**
     * Price snapshot (at time of adding to cart)
     */
    private BigDecimal priceSnapshot;

    /**
     * Line total (quantity * priceSnapshot)
     */
    private BigDecimal lineTotal;

    /**
     * Current product price (for comparison)
     * May differ from priceSnapshot if price changed
     */
    private BigDecimal currentPrice;

    /**
     * Available stock quantity
     */
    private Integer availableStock;

    // Constructors

    /**
     * Default constructor
     */
    public CartItemResponse() {
    }

    /**
     * Constructor from CartItem entity
     * 
     * Extracts data from the cart item and related product entity.
     * 
     * @param cartItem The cart item entity
     */
    public CartItemResponse(CartItem cartItem) {
        this.cartItemid = cartItem.getCartItemid();
        this.quantity = cartItem.getQuantity();
        this.priceSnapshot = cartItem.getPriceSnapshot();
        this.lineTotal = cartItem.getLineTotal();

        // Extract product details
        Products product = cartItem.getProduct();
        if (product != null) {
            this.pid = product.getPid();
            this.productname = product.getProductname();
            this.type = product.getType();
            this.status = product.getStatus();
            this.currentPrice = product.getPrice();

            // Extract seller details
            if (product.getSeller() != null) {
                this.sellerId = product.getSeller().getSid();
                this.sellerName = product.getSeller().getSellername();
            }

            // Extract inventory details
            if (product.getInventory() != null) {
                this.availableStock = product.getInventory().getAvailableQuantity();
            }
        }
    }

    // Getters and Setters

    public Long getCartItemid() {
        return cartItemid;
    }

    public void setCartItemid(Long cartItemid) {
        this.cartItemid = cartItemid;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceSnapshot() {
        return priceSnapshot;
    }

    public void setPriceSnapshot(BigDecimal priceSnapshot) {
        this.priceSnapshot = priceSnapshot;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    @Override
    public String toString() {
        return "CartItemResponse{" +
                "cartItemid=" + cartItemid +
                ", pid=" + pid +
                ", productname='" + productname + '\'' +
                ", quantity=" + quantity +
                ", priceSnapshot=" + priceSnapshot +
                ", lineTotal=" + lineTotal +
                '}';
    }
}
