package com.glyzier.repository;

import com.glyzier.model.Conversation;
import com.glyzier.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Conversation Repository
 * 
 * Spring Data JPA repository for managing conversations in the database.
 * Provides methods to find conversations between users and list all
 * conversations for a specific user.
 * 
 * This repository includes custom queries to:
 * - Find existing conversations between two users
 * - Get all conversations where a user is a participant
 * - Sort conversations by most recent activity
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    /**
     * Find a conversation between two specific users
     * 
     * This method checks both directions since user1 and user2 can be
     * in either order. For example, if we want to find a conversation
     * between User A and User B, it could be stored as:
     * - user1=A, user2=B OR
     * - user1=B, user2=A
     * 
     * This is used when:
     * - Creating a new conversation (check if one already exists)
     * - Opening a conversation from the "Contact Seller" button
     * 
     * @param user1 First user
     * @param user2 Second user
     * @return Optional containing the conversation if it exists
     */
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1 = :user1 AND c.user2 = :user2) OR " +
           "(c.user1 = :user2 AND c.user2 = :user1)")
    Optional<Conversation> findByUsers(@Param("user1") Users user1, @Param("user2") Users user2);

    /**
     * Find all conversations where a user is a participant
     * 
     * This retrieves all conversations where the user is either user1 or user2.
     * Results are sorted by updatedAt descending so the most recently active
     * conversations appear first in the inbox.
     * 
     * This is used for:
     * - Displaying the inbox/conversation list
     * - Showing the user's messaging history
     * 
     * @param user The user to find conversations for
     * @return List of conversations sorted by most recent activity
     */
    @Query("SELECT c FROM Conversation c WHERE " +
           "c.user1 = :user OR c.user2 = :user " +
           "ORDER BY c.updatedAt DESC")
    List<Conversation> findByUserOrderByUpdatedAtDesc(@Param("user") Users user);
}
