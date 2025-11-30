package com.glyzier.service;

import com.glyzier.dto.AuthResponse;
import com.glyzier.dto.LoginRequest;
import com.glyzier.dto.RegisterRequest;
import com.glyzier.model.Users;
import com.glyzier.repository.UserRepository;
import com.glyzier.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication Service
 * 
 * This service handles user registration and login operations.
 * It manages password encryption, JWT token generation, and user authentication.
 * 
 * Key responsibilities:
 * - Register new users with encrypted passwords
 * - Authenticate users and generate JWT tokens
 * - Return user information after successful authentication
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class AuthService {

    /**
     * Repository for database operations on Users
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Password encoder for hashing passwords
     */
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * JWT utility for generating tokens
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Authentication manager for validating credentials
     */
    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register a new user
     * 
     * This method:
     * 1. Checks if the email is already registered
     * 2. Creates a new Users entity
     * 3. Encrypts the password using BCrypt
     * 4. Saves the user to the database
     * 5. Generates a JWT token
     * 6. Returns an AuthResponse with user info and token
     * 
     * @param request RegisterRequest containing user registration data
     * @return AuthResponse with JWT token and user information
     * @throws RuntimeException if email is already registered
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user entity
        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setDisplayname(request.getDisplayname());
        
        // Encrypt the password before saving
        // IMPORTANT: Never store plain text passwords!
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save user to database
        // The createdAt timestamp is automatically set by @CreationTimestamp
        Users savedUser = userRepository.save(user);

        // Generate JWT token for the new user
        // We need to create a UserDetails object for token generation
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities("USER")
                .build();
        
        String token = jwtUtil.generateToken(userDetails);

        // Create and return response with token and user info
        return new AuthResponse(
            token,
            savedUser.getUserid(),
            savedUser.getEmail(),
            savedUser.getDisplayname(),
            false, // New user is not a seller yet
            savedUser.isAdmin() // Include isAdmin (Module 17)
        );
    }

    /**
     * Authenticate a user and generate JWT token
     * 
     * This method:
     * 1. Validates the credentials using Spring Security's AuthenticationManager
     * 2. If valid, retrieves the user from the database
     * 3. Generates a JWT token
     * 4. Returns an AuthResponse with user info and token
     * 
     * @param request LoginRequest containing email and password
     * @return AuthResponse with JWT token and user information
     * @throws UsernameNotFoundException if user doesn't exist
     * @throws RuntimeException if authentication fails (wrong password)
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate the user using Spring Security
            // This will check if the password matches the encrypted password in the database
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            // If authentication succeeds, retrieve the user from database
            Users user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            // Check if user is a seller
            boolean isSeller = user.getSeller() != null;

            // Return response with token and user info
            return new AuthResponse(
                token,
                user.getUserid(),
                user.getEmail(),
                user.getDisplayname(),
                isSeller,
                user.isAdmin() // Include isAdmin (Module 17)
            );

        } catch (Exception e) {
            // Authentication failed (wrong password or user doesn't exist)
            throw new RuntimeException("Invalid email or password");
        }
    }
}
