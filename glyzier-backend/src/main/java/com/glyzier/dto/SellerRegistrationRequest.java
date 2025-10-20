package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * SellerRegistrationRequest DTO
 * 
 * Data Transfer Object for seller registration requests.
 * This DTO is used when a user wants to become a seller on the platform.
 * It contains the basic information needed to create a seller account.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class SellerRegistrationRequest {

    /**
     * Name of the seller's store
     * This will be displayed to customers browsing products
     * Must not be blank and should be between 3-100 characters
     */
    @NotBlank(message = "Seller name is required")
    @Size(min = 3, max = 100, message = "Seller name must be between 3 and 100 characters")
    private String sellername;

    /**
     * Biography or description of the seller's store
     * Provides information about the seller, their art style, and offerings
     * Optional field, can be null or empty
     */
    @Size(max = 1000, message = "Store bio must not exceed 1000 characters")
    private String storebio;

    // Constructors

    /**
     * Default constructor
     */
    public SellerRegistrationRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param sellername Name of the seller's store
     * @param storebio Biography/description of the store
     */
    public SellerRegistrationRequest(String sellername, String storebio) {
        this.sellername = sellername;
        this.storebio = storebio;
    }

    // Getters and Setters

    public String getSellername() {
        return sellername;
    }

    public void setSellername(String sellername) {
        this.sellername = sellername;
    }

    public String getStorebio() {
        return storebio;
    }

    public void setStorebio(String storebio) {
        this.storebio = storebio;
    }

    @Override
    public String toString() {
        return "SellerRegistrationRequest{" +
                "sellername='" + sellername + '\'' +
                ", storebio='" + storebio + '\'' +
                '}';
    }
}
