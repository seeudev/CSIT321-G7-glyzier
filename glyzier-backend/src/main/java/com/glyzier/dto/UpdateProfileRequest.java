package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

/**
 * Update Profile Request DTO (Data Transfer Object)
 * 
 * This class represents the data structure for user profile update requests.
 * It allows users to modify their display name and phone number.
 * Email cannot be changed through this endpoint for security reasons.
 * 
 * Validation Rules:
 * - Display name: Required, 2-100 characters
 * - Phone number: Optional, 10-20 characters, numbers/spaces/+/- only
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 14 - Basic User Profile)
 */
public class UpdateProfileRequest {

    /**
     * User's display name
     * This is the public-facing name shown on the platform
     * Required field with length constraints
     */
    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 100, message = "Display name must be between 2 and 100 characters")
    private String displayname;

    /**
     * User's phone number (optional)
     * Format validation allows: numbers, spaces, +, and - characters
     * Example valid formats: "+1 234 567 8900", "1234567890", "+44-123-456-7890"
     */
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    @Pattern(regexp = "^[0-9\\s+\\-]*$", message = "Phone number can only contain numbers, spaces, +, and -")
    private String phonenumber;

    // Constructors

    /**
     * Default constructor required for JSON deserialization
     */
    public UpdateProfileRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param displayname User's display name
     * @param phonenumber User's phone number (optional)
     */
    public UpdateProfileRequest(String displayname, String phonenumber) {
        this.displayname = displayname;
        this.phonenumber = phonenumber;
    }

    // Getters and Setters

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    @Override
    public String toString() {
        return "UpdateProfileRequest{" +
                "displayname='" + displayname + '\'' +
                ", phonenumber='" + phonenumber + '\'' +
                '}';
    }
}
