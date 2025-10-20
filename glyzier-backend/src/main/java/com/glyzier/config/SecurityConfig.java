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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security Configuration
 * 
 * This class configures Spring Security for the Glyzier application.
 * It sets up:
 * - JWT-based authentication
 * - Password encoding with BCrypt
 * - CORS for React frontend
 * - Public and protected endpoints
 * - Stateless session management
 * 
 * @author Glyzier Team
 * @version 1.0
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
     * - /api/products/** (browsing products - will be implemented in Module 3)
     * - /api/sellers/** (viewing seller info - will be implemented in Module 3)
     * 
     * Protected endpoints (require valid JWT):
     * - All other /api/** endpoints
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
            
            // Enable CORS with our custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - anyone can access these
                // Authentication endpoints (login, register)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Public product browsing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                
                // Public seller viewing (GET only)
                .requestMatchers(HttpMethod.GET, "/api/sellers/{sid}").permitAll()
                
                // All other /api endpoints require authentication
                .requestMatchers("/api/**").authenticated()
                
                // All other requests are allowed (for development)
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

    /**
     * CORS Configuration Source
     * 
     * Configures Cross-Origin Resource Sharing (CORS) to allow the React frontend
     * to make requests to the backend API.
     * 
     * This is necessary because the frontend (http://localhost:3000) and backend
     * (http://localhost:8080) run on different ports, which browsers consider
     * different origins.
     * 
     * @return CorsConfigurationSource with frontend access rules
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from the React development server
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        
        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers (including Authorization header for JWT)
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Apply this CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
