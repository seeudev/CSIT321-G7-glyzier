package com.glyzier.dto;

import com.glyzier.model.OrderProducts;

import java.math.BigDecimal;

/**
 * OrderProductResponse DTO - Response object for an order item
 * 
 * This Data Transfer Object is used to send order item information
 * to the client. It contains the details of a single product within an order.
 * 
 * This is used when returning order details to the user, showing
 * what products were included in the order with their snapshot prices
 * and quantities.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class OrderProductResponse {

    /**
     * Order Product ID
     */
    private Long opid;

    /**
     * Product ID
     */
    private Long pid;

    /**
     * Snapshot of the product name at the time of order
     * This preserves the product name even if it's changed later
     */
    private String productNameSnapshot;

    /**
     * Unit price at the time of order
     * This preserves the price even if it's changed later
     */
    private BigDecimal unitPrice;

    /**
     * Quantity ordered
     */
    private Integer quantity;

    /**
     * Line total (unit price × quantity)
     */
    private BigDecimal lineTotal;

    // Constructors

    /**
     * Default constructor
     */
    public OrderProductResponse() {
    }

    /**
     * Constructor from OrderProducts entity
     * Converts entity to DTO
     * 
     * @param orderProduct The OrderProducts entity to convert
     */
    public OrderProductResponse(OrderProducts orderProduct) {
        this.opid = orderProduct.getOpid();
        this.pid = orderProduct.getProduct() != null ? orderProduct.getProduct().getPid() : null;
        this.productNameSnapshot = orderProduct.getProductNameSnapshot();
        this.unitPrice = orderProduct.getUnitPrice();
        this.quantity = orderProduct.getQuantity();
        this.lineTotal = orderProduct.getLineTotal();
    }

    // Getters and Setters

    public Long getOpid() {
        return opid;
    }

    public void setOpid(Long opid) {
        this.opid = opid;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getProductNameSnapshot() {
        return productNameSnapshot;
    }

    public void setProductNameSnapshot(String productNameSnapshot) {
        this.productNameSnapshot = productNameSnapshot;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }
}
