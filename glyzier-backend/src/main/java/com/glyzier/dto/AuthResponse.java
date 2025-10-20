package com.glyzier.dto;

/**
 * Authentication Response DTO (Data Transfer Object)
 * 
 * This class represents the response sent back to the client after successful authentication.
 * It contains the JWT token and basic user information.
 * 
 * The JWT token should be stored by the client and included in the Authorization header
 * for subsequent authenticated requests.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class AuthResponse {

    /**
     * JWT token string
     * This token is used for authenticating future requests
     * Format in requests: "Bearer {token}"
     */
    private String token;

    /**
     * User's unique identifier
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
     * Indicates if the user is also a seller
     * true if the user has a seller account, false otherwise
     */
    private boolean isSeller;

    // Constructors

    /**
     * Default constructor required for JSON serialization
     */
    public AuthResponse() {
    }

    /**
     * Constructor with all fields
     * 
     * @param token JWT token string
     * @param userid User's unique identifier
     * @param email User's email address
     * @param displayname User's display name
     * @param isSeller Whether the user is a seller
     */
    public AuthResponse(String token, Long userid, String email, String displayname, boolean isSeller) {
        this.token = token;
        this.userid = userid;
        this.email = email;
        this.displayname = displayname;
        this.isSeller = isSeller;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

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

    public boolean isSeller() {
        return isSeller;
    }

    public void setSeller(boolean seller) {
        isSeller = seller;
    }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "userid=" + userid +
                ", email='" + email + '\'' +
                ", displayname='" + displayname + '\'' +
                ", isSeller=" + isSeller +
                '}'; // Token excluded from toString for security
    }
}
