package com.glyzier.service;

import com.glyzier.dto.UpdateProfileRequest;
import com.glyzier.dto.ChangePasswordRequest;
import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Service
 * 
 * This service handles user-related operations beyond authentication.
 * It provides methods to retrieve user information, particularly for
 * authenticated users accessing their own data.
 * 
 * Key responsibilities:
 * - Get the currently authenticated user
 * - Retrieve user details by ID or email
 * - Manage user profile information
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class UserService {

    /**
     * Repository for database operations on Users
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Password encoder for hashing passwords
     * Used for password change operations
     */
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get the currently authenticated user
     * 
     * This method:
     * 1. Retrieves the authentication object from Spring Security's SecurityContext
     * 2. Extracts the username (email) from the authenticated principal
     * 3. Looks up and returns the full Users entity from the database
     * 
     * The SecurityContext is set by our JwtAuthFilter after validating the JWT token.
     * 
     * @return Users entity of the currently authenticated user
     * @throws UsernameNotFoundException if the authenticated user is not found in database
     * @throws RuntimeException if no user is authenticated
     */
    public Users getCurrentUser() {
        // Get the current authentication from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if a user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        // Get the principal (UserDetails) from the authentication
        Object principal = authentication.getPrincipal();
        
        // Extract the username (email)
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        // Look up the user in the database and return
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    /**
     * Get a user by their ID
     * 
     * @param userid The user's unique identifier
     * @return Users entity
     * @throws RuntimeException if user is not found
     */
    public Users getUserById(Long userid) {
        return userRepository.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userid));
    }

    /**
     * Get a user by their email
     * 
     * @param email The user's email address
     * @return Users entity
     * @throws UsernameNotFoundException if user is not found
     */
    public Users getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    /**
     * Check if the current user is a seller
     * 
     * @return true if the current user has a seller account, false otherwise
     */
    public boolean isCurrentUserSeller() {
        Users currentUser = getCurrentUser();
        return currentUser.getSeller() != null;
    }

    /**
     * Update user profile information
     * 
     * This method allows users to update their display name and phone number.
     * Email cannot be changed through this method for security reasons.
     * 
     * Module 14 Implementation:
     * - Updates display name (required)
     * - Updates phone number (optional, can be null or empty)
     * - Saves changes to database
     * - Returns updated user entity
     * 
     * @param request UpdateProfileRequest containing new display name and phone number
     * @return Updated Users entity
     * @throws RuntimeException if user is not found
     */
    @Transactional
    public Users updateProfile(UpdateProfileRequest request) {
        // Get the current authenticated user
        Users currentUser = getCurrentUser();

        // Update the fields from the request
        currentUser.setDisplayname(request.getDisplayname());
        
        // Phone number is optional - set even if null or empty
        currentUser.setPhonenumber(request.getPhonenumber());

        // Save and return the updated user
        return userRepository.save(currentUser);
    }

    /**
     * Change user password
     * 
     * This method allows users to change their password securely.
     * It requires verification of the current password before allowing the change.
     * 
     * Security measures:
     * 1. Verifies current password matches stored hash
     * 2. Validates new password matches confirmation
     * 3. Encrypts new password before storage
     * 
     * Module 14 Implementation:
     * - Validates current password is correct
     * - Checks new password and confirmation match
     * - Hashes new password using BCrypt
     * - Updates password in database
     * 
     * @param request ChangePasswordRequest containing current and new passwords
     * @throws RuntimeException if current password is incorrect
     * @throws RuntimeException if new password and confirmation don't match
     * @throws RuntimeException if user is not found
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        // Get the current authenticated user
        Users currentUser = getCurrentUser();

        // Verify current password is correct
        // passwordEncoder.matches() compares plain text with BCrypt hash
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Verify new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        // Encrypt the new password and update
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Save the updated user
        userRepository.save(currentUser);
    }
}
