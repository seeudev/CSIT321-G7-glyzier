package com.glyzier.security;

import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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
     * @param username The username (email) to search for
     * @return UserDetails object containing user information and credentials
     * @throws UsernameNotFoundException if no user is found with the given email
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user by email in the database
        // orElseThrow will throw UsernameNotFoundException if user doesn't exist
        Users user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        // Convert our Users entity to Spring Security's UserDetails
        // The User.builder() creates a UserDetails implementation
        // We use an empty list for authorities since we're not implementing roles yet
        // (In a more complex app, you might add roles like "ROLE_USER", "ROLE_SELLER", etc.)
        return User.builder()
                .username(user.getEmail()) // Username is the email
                .password(user.getPassword()) // Encrypted password from database
                .authorities(new ArrayList<>()) // No specific authorities/roles for now
                .build();
    }
}
