package com.glyzier.repository;

import com.glyzier.model.Conversation;
import com.glyzier.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Message Repository
 * 
 * Spring Data JPA repository for managing messages in the database.
 * Provides methods to retrieve messages for a specific conversation.
 * 
 * Messages are retrieved in chronological order (oldest first) so they
 * can be displayed properly in the message thread view.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Find all messages in a conversation
     * 
     * This retrieves all messages for a specific conversation, ordered
     * by sent time ascending (oldest first). This creates a chronological
     * message history for display in the message thread.
     * 
     * Used when:
     * - Opening a message thread
     * - Polling for new messages (short polling)
     * 
     * @param conversation The conversation to get messages for
     * @return List of messages in chronological order
     */
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
}
