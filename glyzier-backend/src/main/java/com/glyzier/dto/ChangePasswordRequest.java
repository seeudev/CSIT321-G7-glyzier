package com.glyzier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Change Password Request DTO (Data Transfer Object)
 * 
 * This class represents the data structure for password change requests.
 * It requires the user to provide their current password for security verification,
 * plus the new password and confirmation.
 * 
 * Validation Rules:
 * - Current password: Required
 * - New password: Required, minimum 8 characters
 * - Confirm password: Required (matching validation done in service layer)
 * 
 * Security Notes:
 * - Current password is verified before allowing change
 * - New password must match confirmation
 * - Passwords are never logged or exposed
 * 
 * @author Glyzier Team
 * @version 1.0 (Module 14 - Basic User Profile)
 */
public class ChangePasswordRequest {

    /**
     * User's current password
     * Required for security verification before allowing password change
     */
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    /**
     * New password to set
     * Must meet minimum security requirements (8+ characters)
     */
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;

    /**
     * Confirmation of new password
     * Must match newPassword exactly (validated in service layer)
     */
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;

    // Constructors

    /**
     * Default constructor required for JSON deserialization
     */
    public ChangePasswordRequest() {
    }

    /**
     * Constructor with all fields
     * 
     * @param currentPassword User's current password
     * @param newPassword New password to set
     * @param confirmPassword Confirmation of new password
     */
    public ChangePasswordRequest(String currentPassword, String newPassword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    // Getters and Setters

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    /**
     * Override toString to exclude passwords for security
     * Never log password values
     */
    @Override
    public String toString() {
        return "ChangePasswordRequest{" +
                "currentPassword='[PROTECTED]', " +
                "newPassword='[PROTECTED]', " +
                "confirmPassword='[PROTECTED]'" +
                '}';
    }
}
