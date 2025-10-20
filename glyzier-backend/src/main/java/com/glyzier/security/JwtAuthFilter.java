package com.glyzier.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * 
 * This filter intercepts every HTTP request to check for a valid JWT token.
 * It extends OncePerRequestFilter to ensure it's executed once per request.
 * 
 * Flow:
 * 1. Extract the JWT token from the Authorization header
 * 2. Validate the token and extract the username (email)
 * 3. Load the user details from the database
 * 4. Set the authentication in Spring Security's SecurityContext
 * 5. Allow the request to proceed
 * 
 * If no token is present or the token is invalid, the request continues
 * but without authentication (public endpoints will still work).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    /**
     * JWT utility for token operations (validation, extraction)
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Service to load user details from the database
     */
    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * Main filter method that processes each request
     * 
     * @param request The HTTP request
     * @param response The HTTP response
     * @param filterChain The filter chain to continue processing
     * @throws ServletException if a servlet error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the Authorization header from the request
        // Format expected: "Bearer <JWT_TOKEN>"
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Check if the Authorization header exists and starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract the token by removing "Bearer " prefix (first 7 characters)
            token = authHeader.substring(7);
            
            try {
                // Extract the username (email) from the token
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // If token parsing fails, log the error and continue
                // The request will be treated as unauthenticated
                System.out.println("JWT Token parsing failed: " + e.getMessage());
            }
        }

        // If we have a username and no authentication is set in the SecurityContext
        // (This prevents re-authenticating an already authenticated request)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Load the full user details from the database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Validate the token against the user details
            if (jwtUtil.validateToken(token, userDetails)) {
                // Token is valid - create an authentication token
                // UsernamePasswordAuthenticationToken represents an authenticated user
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,           // Principal (the user)
                        null,                  // Credentials (not needed after authentication)
                        userDetails.getAuthorities() // User's authorities/roles
                    );

                // Set additional details from the request (like IP address)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the SecurityContext
                // This makes the user authenticated for this request
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue with the filter chain (proceed to the next filter or controller)
        filterChain.doFilter(request, response);
    }
}
