package com.glyzier.repository;

import com.glyzier.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Spring Data JPA repository for Users entity
 * 
 * This interface extends JpaRepository to provide CRUD operations
 * for the Users entity. Spring Data JPA automatically implements
 * this interface at runtime, providing methods like save(), findById(),
 * findAll(), delete(), etc.
 * 
 * Custom query methods can be added here and Spring Data JPA will
 * automatically implement them based on method naming conventions.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    /**
     * Find a user by email address
     * This is useful for login functionality and checking if an email exists
     * 
     * Spring Data JPA automatically implements this method based on the name
     * It will generate a query: SELECT * FROM users WHERE email = ?
     * 
     * @param email The email address to search for
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<Users> findByEmail(String email);

    /**
     * Check if a user exists by email address
     * Useful for registration validation to prevent duplicate emails
     * 
     * @param email The email address to check
     * @return true if a user with this email exists, false otherwise
     */
    boolean existsByEmail(String email);
}
