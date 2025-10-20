package com.glyzier.service;

import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
}
