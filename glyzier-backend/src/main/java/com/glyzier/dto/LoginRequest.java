package com.glyzier.dto;

/**
 * Login Request DTO (Data Transfer Object)
 * 
 * This class represents the data structure for user login requests.
 * It is used to receive authentication credentials from the client.
 * 
 * Contains only the essential fields needed for authentication.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class LoginRequest {

    /**
     * User's email address (used as username for authentication)
     */
    private String email;

    /**
     * User's plain text password
     * Will be verified against the encrypted password in the database
     */
    private String password;

    // Constructors

    /**
     * Default constructor required for JSON deserialization
     */
    public LoginRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param email User's email address
     * @param password User's password
     */
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                '}'; // Excludes password for security
    }
}
