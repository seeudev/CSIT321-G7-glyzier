package com.glyzier.dto;

import java.sql.Timestamp;

/**
 * AdminUserResponse - DTO for user information in admin panel
 * 
 * Returns user details formatted for admin management screens.
 * Includes role, status, and seller information if applicable.
 * 
 * Module 17: Admin System
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class AdminUserResponse {

    /**
     * Unique identifier for the user
     */
    private Long userid;

    /**
     * User's email address
     */
    private String email;

    /**
     * User's display name
     */
    private String displayname;

    /**
     * Whether the user is an admin
     */
    private boolean isAdmin;

    /**
     * User's account status (ACTIVE, BANNED)
     */
    private String status;

    /**
     * Phone number if provided
     */
    private String phonenumber;

    /**
     * Timestamp of account creation
     */
    private Timestamp createdAt;

    /**
     * Seller ID if user has a seller account
     * Null if user is not a seller
     */
    private Long sellerId;

    /**
     * Shop name if user has a seller account
     * Null if user is not a seller
     */
    private String shopName;

    // Constructors

    /**
     * Default constructor
     */
    public AdminUserResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param userid User ID
     * @param email User email
     * @param displayname Display name
     * @param isAdmin Whether user is admin
     * @param status Account status
     * @param phonenumber Phone number
     * @param createdAt Creation timestamp
     * @param sellerId Seller ID if applicable
     * @param shopName Shop name if applicable
     */
    public AdminUserResponse(Long userid, String email, String displayname, boolean isAdmin, String status, 
                            String phonenumber, Timestamp createdAt, Long sellerId, String shopName) {
        this.userid = userid;
        this.email = email;
        this.displayname = displayname;
        this.isAdmin = isAdmin;
        this.status = status;
        this.phonenumber = phonenumber;
        this.createdAt = createdAt;
        this.sellerId = sellerId;
        this.shopName = shopName;
    }

    // Getters and Setters

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }
}
