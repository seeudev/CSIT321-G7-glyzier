package com.glyzier.security;

import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom User Details Service
 * 
 * This service implements Spring Security's UserDetailsService interface.
 * It is responsible for loading user-specific data during authentication.
 * 
 * Spring Security uses this service to:
 * 1. Load user information by username (email) during login
 * 2. Verify credentials against the stored password
 * 3. Create a UserDetails object used throughout the security context
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    /**
     * Repository for accessing user data from the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by username (email in our case)
     * 
     * This method is called by Spring Security during the authentication process.
     * It searches for a user by email and converts the Users entity into a
     * Spring Security UserDetails object.
     * 
     * Module 17: Updated to check for banned users and include role authorities.
     * 
     * @param username The username (email) to search for
     * @return UserDetails object containing user information and credentials
     * @throws UsernameNotFoundException if no user is found with the given email
     * @throws RuntimeException if user is banned
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Normalize email to lowercase for case-insensitive lookup
        String normalizedEmail = username.toLowerCase().trim();
        
        // Find the user by email in the database (case-insensitive)
        // orElseThrow will throw UsernameNotFoundException if user doesn't exist
        Users user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalizedEmail));

        // Check if user is banned (Module 17: Admin System)
        // Banned users cannot log in
        if ("BANNED".equals(user.getStatus())) {
            throw new RuntimeException("User account has been banned");
        }

        // Build list of authorities based on user admin status
        // This allows role-based access control in controllers
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.isAdmin()) {
            // Add ADMIN authority for admin users
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            // Regular user authority
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        // Convert our Users entity to Spring Security's UserDetails
        // The User.builder() creates a UserDetails implementation
        return User.builder()
                .username(user.getEmail()) // Username is the email
                .password(user.getPassword()) // Encrypted password from database
                .authorities(authorities) // User's roles/authorities
                .build();
    }
}
