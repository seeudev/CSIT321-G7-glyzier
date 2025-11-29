package com.glyzier.controller;

import com.glyzier.dto.ConversationResponse;
import com.glyzier.dto.CreateConversationRequest;
import com.glyzier.dto.MessageResponse;
import com.glyzier.dto.SendMessageRequest;
import com.glyzier.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Message Controller
 * 
 * REST controller for managing conversations and messages in the Glyzier messaging system.
 * All endpoints require authentication (valid JWT token).
 * 
 * This controller provides endpoints for:
 * - Viewing the inbox (list of conversations)
 * - Getting messages in a conversation thread
 * - Creating new conversations
 * - Sending messages
 * 
 * Module 16 Implementation - Short Polling Architecture:
 * The frontend polls GET /api/messages/{conversationId} every 3 seconds
 * to check for new messages. This provides a simulated real-time experience
 * without the complexity of WebSockets.
 * 
 * Endpoints:
 * - GET /api/conversations - Get user's inbox (all conversations)
 * - GET /api/conversations/{id} - Get specific conversation details
 * - POST /api/conversations - Create or get conversation with another user
 * - GET /api/messages/{conversationId} - Get all messages in a conversation
 * - POST /api/messages - Send a message in a conversation
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * Get all conversations for current user (Inbox)
     * 
     * Returns a list of all conversations where the authenticated user
     * is a participant, sorted by most recent activity first.
     * 
     * Each conversation includes:
     * - Conversation ID (for navigation)
     * - Other user's information (who you're chatting with)
     * - Last activity timestamp
     * 
     * This is used for the inbox page (/messages).
     * 
     * Request:
     * GET /api/conversations
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * 
     * Success response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     "otherUserId": 5,
     *     "otherUserName": "John Doe",
     *     "otherUserEmail": "john@example.com",
     *     "updatedAt": "2024-11-29T15:30:00",
     *     "createdAt": "2024-11-20T10:00:00"
     *   },
     *   ...
     * ]
     * 
     * @return ResponseEntity with list of conversation DTOs
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> getUserConversations() {
        try {
            List<ConversationResponse> conversations = messageService.getUserConversations();
            return ResponseEntity.ok(conversations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to load conversations: " + e.getMessage()));
        }
    }

    /**
     * Get specific conversation details
     * 
     * Returns details about a specific conversation.
     * Used for displaying conversation header information in the message thread view.
     * 
     * Request:
     * GET /api/conversations/{id}
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * 
     * Success response (200 OK):
     * {
     *   "id": 1,
     *   "otherUserId": 5,
     *   "otherUserName": "John Doe",
     *   "otherUserEmail": "john@example.com",
     *   "updatedAt": "2024-11-29T15:30:00",
     *   "createdAt": "2024-11-20T10:00:00"
     * }
     * 
     * Error response (404 Not Found) if conversation doesn't exist:
     * {
     *   "error": "Conversation not found"
     * }
     * 
     * Error response (403 Forbidden) if user not authorized:
     * {
     *   "error": "You are not authorized to view this conversation"
     * }
     * 
     * @param conversationId ID of the conversation
     * @return ResponseEntity with conversation details
     */
    @GetMapping("/conversations/{id}")
    public ResponseEntity<?> getConversation(@PathVariable("id") Long conversationId) {
        try {
            ConversationResponse conversation = messageService.getConversationById(conversationId);
            return ResponseEntity.ok(conversation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Create or get conversation with another user
     * 
     * Creates a new conversation with the specified user, or returns
     * the existing conversation if one already exists between the two users.
     * 
     * This prevents duplicate conversations between the same two users.
     * 
     * Used when:
     * - Clicking "Contact Seller" on a product
     * - Manually starting a conversation with a user
     * 
     * Request:
     * POST /api/conversations
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * Body:
     * {
     *   "recipientUserId": 5
     * }
     * 
     * Success response (201 Created or 200 OK):
     * {
     *   "id": 1,
     *   "otherUserId": 5,
     *   "otherUserName": "John Doe",
     *   "otherUserEmail": "john@example.com",
     *   "updatedAt": "2024-11-29T15:30:00",
     *   "createdAt": "2024-11-29T15:30:00"
     * }
     * 
     * Error response (404 Not Found) if recipient doesn't exist:
     * {
     *   "error": "Recipient user not found"
     * }
     * 
     * Error response (400 Bad Request) if trying to message self:
     * {
     *   "error": "Cannot create conversation with yourself"
     * }
     * 
     * @param request Contains recipient user ID
     * @return ResponseEntity with conversation details
     */
    @PostMapping("/conversations")
    public ResponseEntity<?> createOrGetConversation(@Valid @RequestBody CreateConversationRequest request) {
        try {
            ConversationResponse conversation = messageService.createOrGetConversation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(conversation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all messages in a conversation
     * 
     * Returns all messages for a specific conversation in chronological order.
     * 
     * SHORT POLLING IMPLEMENTATION:
     * The frontend calls this endpoint every 3 seconds to check for new messages.
     * This provides a simulated real-time messaging experience without WebSockets.
     * 
     * Security: Only participants in the conversation can view messages.
     * 
     * Request:
     * GET /api/messages/{conversationId}
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * 
     * Success response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     "conversationId": 1,
     *     "senderId": 3,
     *     "senderName": "Alice Smith",
     *     "content": "Hi, I'm interested in your product!",
     *     "sentAt": "2024-11-29T15:30:00"
     *   },
     *   {
     *     "id": 2,
     *     "conversationId": 1,
     *     "senderId": 5,
     *     "senderName": "John Doe",
     *     "content": "Thank you for your interest!",
     *     "sentAt": "2024-11-29T15:32:00"
     *   }
     * ]
     * 
     * Error response (404 Not Found) if conversation doesn't exist:
     * {
     *   "error": "Conversation not found"
     * }
     * 
     * Error response (403 Forbidden) if user not authorized:
     * {
     *   "error": "You are not authorized to view this conversation"
     * }
     * 
     * @param conversationId ID of the conversation
     * @return ResponseEntity with list of message DTOs
     */
    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<?> getConversationMessages(@PathVariable Long conversationId) {
        try {
            List<MessageResponse> messages = messageService.getConversationMessages(conversationId);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Send a message in a conversation
     * 
     * Creates a new message in the specified conversation.
     * Updates the conversation's updated_at timestamp to reflect activity.
     * 
     * The message will appear in the next polling cycle (within 3 seconds)
     * for the other user in the conversation.
     * 
     * Security: Only participants in the conversation can send messages.
     * 
     * Request:
     * POST /api/messages
     * Headers: Authorization: Bearer <JWT_TOKEN>
     * Body:
     * {
     *   "conversationId": 1,
     *   "content": "Hello! How are you?"
     * }
     * 
     * Success response (201 Created):
     * {
     *   "message": "Message sent successfully",
     *   "data": {
     *     "id": 3,
     *     "conversationId": 1,
     *     "senderId": 3,
     *     "senderName": "Alice Smith",
     *     "content": "Hello! How are you?",
     *     "sentAt": "2024-11-29T15:35:00"
     *   }
     * }
     * 
     * Error response (400 Bad Request) if validation fails:
     * {
     *   "error": "Message content is required"
     * }
     * 
     * Error response (403 Forbidden) if user not authorized:
     * {
     *   "error": "You are not authorized to send messages in this conversation"
     * }
     * 
     * @param request Contains conversation ID and message content
     * @return ResponseEntity with created message DTO
     */
    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        try {
            MessageResponse message = messageService.sendMessage(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Message sent successfully");
            response.put("data", message);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
