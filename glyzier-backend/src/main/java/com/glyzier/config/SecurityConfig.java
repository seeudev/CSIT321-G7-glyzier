package com.glyzier.config;

import com.glyzier.security.CustomUserDetailsService;
import com.glyzier.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security Configuration
 * 
 * This class configures Spring Security for the Glyzier application.
 * Simplified architecture: Spring Boot serves both API and React frontend.
 * 
 * It sets up:
 * - JWT-based authentication
 * - Password encoding with BCrypt
 * - Public and protected endpoints
 * - Stateless session management
 * 
 * No CORS needed since frontend and backend are served from the same origin.
 * 
 * @author Glyzier Team
 * @version 2.0 - Simplified architecture
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Custom service to load user details from the database
     */
    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * JWT filter to validate tokens on each request
     */
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    /**
     * Password Encoder Bean
     * 
     * BCryptPasswordEncoder is a secure password hashing function.
     * It automatically handles salting and uses a strong hashing algorithm.
     * 
     * This bean is used to:
     * - Encode passwords during user registration
     * - Verify passwords during login
     * 
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication Provider Bean
     * 
     * This configures how Spring Security authenticates users.
     * It uses:
     * - Our CustomUserDetailsService to load user data
     * - BCryptPasswordEncoder to verify passwords
     * 
     * @return Configured DaoAuthenticationProvider
     */
    @Bean
    @SuppressWarnings("deprecation")
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Authentication Manager Bean
     * 
     * This is used by the login endpoint to authenticate users.
     * It uses the authentication provider we configured above.
     * 
     * @param config Spring's authentication configuration
     * @return AuthenticationManager instance
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Security Filter Chain
     * 
     * This is the main security configuration method.
     * It defines which endpoints are public and which require authentication.
     * 
     * Public endpoints (no authentication required):
     * - /api/auth/** (registration and login)
     * - GET /api/products/** (browsing products)
     * - GET /api/sellers/** (viewing seller info)
     * - /** (React app static resources and routes)
     * 
     * Protected endpoints (require valid JWT):
     * - Other /api/** endpoints (POST, PUT, DELETE)
     * 
     * @param http HttpSecurity configuration
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (Cross-Site Request Forgery) protection
            // Not needed for stateless JWT authentication
            .csrf(csrf -> csrf.disable())
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - anyone can access these
                
                // Authentication endpoints (login, register)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Public product browsing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                
                // Public seller viewing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/sellers/{sid}").permitAll()
                
                // Cart endpoints require authentication (Module 9)
                .requestMatchers("/api/cart/**").authenticated()
                
                // Favorites endpoints require authentication (Module 10)
                .requestMatchers("/api/favorites/**").authenticated()
                
                // All other /api endpoints require authentication
                .requestMatchers("/api/**").authenticated()
                
                // Allow all other requests (React app static resources, routes)
                .anyRequest().permitAll()
            )
            
            // Set session management to stateless
            // We don't use server-side sessions - JWT tokens handle authentication
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Set our custom authentication provider
            .authenticationProvider(authenticationProvider())
            
            // Add our JWT filter before the standard username/password filter
            // This ensures JWT validation happens first
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
