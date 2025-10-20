package com.glyzier.dto;

/**
 * Register Request DTO (Data Transfer Object)
 * 
 * This class represents the data structure for user registration requests.
 * It is used to receive registration information from the client (React frontend).
 * 
 * Fields match the required user information for creating a new account.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
public class RegisterRequest {

    /**
     * User's email address
     * Must be unique - used as the username for authentication
     */
    private String email;

    /**
     * User's display name
     * This is the public-facing name shown on the platform
     */
    private String displayname;

    /**
     * User's plain text password
     * Will be encrypted by the backend before storage
     */
    private String password;

    // Constructors

    /**
     * Default constructor required for JSON deserialization
     */
    public RegisterRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param email User's email address
     * @param displayname User's display name
     * @param password User's password
     */
    public RegisterRequest(String email, String displayname, String password) {
        this.email = email;
        this.displayname = displayname;
        this.password = password;
    }

    // Getters and Setters

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "email='" + email + '\'' +
                ", displayname='" + displayname + '\'' +
                '}'; // Excludes password for security
    }
}
