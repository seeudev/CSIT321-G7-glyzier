package com.glyzier.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

/**
 * Users Entity - Represents a user in the Glyzier platform
 * 
 * This entity maps to the 'users' table in the database and stores
 * basic user information including authentication credentials.
 * A user may optionally own a seller account (one-to-one relationship).
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Entity
@Table(name = "users")
public class Users {

    /**
     * Primary Key: Unique identifier for each user
     * Auto-generated using identity strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid")
    private Long userid;

    /**
     * User's email address - must be unique across all users
     * Used for login and communication purposes
     */
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    /**
     * Display name shown to other users on the platform
     * This is the public-facing name for the user
     */
    @Column(name = "displayname")
    private String displayname;

    /**
     * Encrypted password for user authentication
     * Should be hashed before storage (e.g., using BCrypt)
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * Timestamp of when the user account was created
     * Automatically set when the entity is first persisted
     */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    /**
     * One-to-One relationship with Seller entity
     * A user may optionally own one seller account
     * mappedBy indicates that the Seller entity owns the relationship
     * 
     * @JsonManagedReference prevents infinite recursion during JSON serialization
     * This is the "parent" side of the bidirectional relationship
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Seller seller;

    // Constructors

    /**
     * Default constructor required by JPA
     */
    public Users() {
    }

    /**
     * Constructor with essential fields
     * 
     * @param email User's email address
     * @param displayname User's display name
     * @param password User's password (should be hashed)
     */
    public Users(String email, String displayname, String password) {
        this.email = email;
        this.displayname = displayname;
        this.password = password;
    }

    // Getters and Setters

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    /**
     * Override toString for debugging purposes
     * Note: Password is excluded for security
     */
    @Override
    public String toString() {
        return "Users{" +
                "userid=" + userid +
                ", email='" + email + '\'' +
                ", displayname='" + displayname + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
