package com.glyzier.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT Utility Class
 * 
 * This class provides utility methods for working with JSON Web Tokens (JWT).
 * It handles token generation, validation, and extraction of claims (user information).
 * 
 * Key responsibilities:
 * - Generate JWT tokens with user email as subject
 * - Validate JWT tokens (check expiration and signature)
 * - Extract information (claims) from JWT tokens
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Component
public class JwtUtil {

    /**
     * Secret key used for signing JWT tokens
     * This value is injected from application.properties
     * IMPORTANT: In production, use a strong, randomly generated secret
     */
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Token expiration time in milliseconds
     * This value is injected from application.properties
     * Default: 24 hours (86400000 milliseconds)
     */
    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Extract the username (email) from the JWT token
     * 
     * @param token The JWT token string
     * @return The username (email) stored in the token's subject
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract the expiration date from the JWT token
     * 
     * @param token The JWT token string
     * @return The expiration date of the token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract a specific claim from the JWT token using a claims resolver function
     * 
     * @param token The JWT token string
     * @param claimsResolver Function to extract the desired claim
     * @param <T> The type of the claim to extract
     * @return The extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from the JWT token
     * This method parses and validates the token signature
     * 
     * @param token The JWT token string
     * @return Claims object containing all token data
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Check if the JWT token has expired
     * 
     * @param token The JWT token string
     * @return true if the token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generate a JWT token for a user
     * 
     * @param userDetails Spring Security UserDetails object containing user information
     * @return Generated JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Create a JWT token with specified claims and subject (username)
     * 
     * Token structure:
     * - Header: Algorithm and token type
     * - Payload: Claims (user data) including subject (email), issued date, and expiration
     * - Signature: Signed with secret key
     * 
     * @param claims Additional claims to include in the token
     * @param subject The subject (username/email) of the token
     * @return The complete JWT token string
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate a JWT token
     * Checks if the token's username matches the UserDetails and if the token hasn't expired
     * 
     * @param token The JWT token string to validate
     * @param userDetails Spring Security UserDetails to compare against
     * @return true if the token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Get the signing key for JWT token creation and validation
     * Converts the secret string into a cryptographic key
     * 
     * @return The signing key
     */
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
