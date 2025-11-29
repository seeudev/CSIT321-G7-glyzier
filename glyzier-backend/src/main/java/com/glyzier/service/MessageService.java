package com.glyzier.service;

import com.glyzier.dto.ConversationResponse;
import com.glyzier.dto.CreateConversationRequest;
import com.glyzier.dto.MessageResponse;
import com.glyzier.dto.SendMessageRequest;
import com.glyzier.model.Conversation;
import com.glyzier.model.Message;
import com.glyzier.model.Users;
import com.glyzier.repository.ConversationRepository;
import com.glyzier.repository.MessageRepository;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Message Service
 * 
 * Service layer for managing conversations and messages in the Glyzier messaging system.
 * 
 * This service handles:
 * - Creating new conversations between users
 * - Sending messages within conversations
 * - Retrieving conversation lists for the inbox
 * - Retrieving message threads for display
 * 
 * All operations are user-scoped based on the currently authenticated user.
 * Users can only access conversations they are part of.
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class MessageService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    /**
     * Get all conversations for the current authenticated user
     * 
     * Returns a list of conversations where the current user is a participant,
     * sorted by most recent activity first. Each conversation shows information
     * about the "other user" (the person the current user is chatting with).
     * 
     * This is used for the inbox page.
     * 
     * @return List of conversation response DTOs
     */
    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations() {
        Users currentUser = userService.getCurrentUser();
        List<Conversation> conversations = conversationRepository
                .findByUserOrderByUpdatedAtDesc(currentUser);

        // Convert each conversation to a response DTO
        return conversations.stream()
                .map(conversation -> convertToConversationResponse(conversation, currentUser))
                .collect(Collectors.toList());
    }

    /**
     * Get all messages in a specific conversation
     * 
     * Retrieves all messages for a conversation in chronological order.
     * Verifies that the current user is a participant in the conversation
     * before returning messages (security check).
     * 
     * This is used for the message thread view and polling for new messages.
     * 
     * @param conversationId ID of the conversation
     * @return List of message response DTOs
     * @throws RuntimeException if conversation not found or user not authorized
     */
    @Transactional(readOnly = true)
    public List<MessageResponse> getConversationMessages(Long conversationId) {
        Users currentUser = userService.getCurrentUser();
        
        // Get the conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Security check: verify current user is part of this conversation
        if (!isUserInConversation(currentUser, conversation)) {
            throw new RuntimeException("You are not authorized to view this conversation");
        }

        // Get all messages and convert to DTOs
        List<Message> messages = messageRepository
                .findByConversationOrderBySentAtAsc(conversation);

        return messages.stream()
                .map(this::convertToMessageResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create a new conversation or get existing one
     * 
     * Creates a conversation between the current user and another user.
     * If a conversation already exists between these two users, returns
     * the existing conversation instead of creating a duplicate.
     * 
     * This is used when clicking "Contact Seller" on a product or
     * when initiating a new conversation.
     * 
     * @param request Contains the recipient user ID
     * @return Conversation response DTO
     * @throws RuntimeException if recipient user not found or trying to message self
     */
    @Transactional
    public ConversationResponse createOrGetConversation(CreateConversationRequest request) {
        Users currentUser = userService.getCurrentUser();
        
        // Get the recipient user
        Users recipientUser = userRepository.findById(request.getRecipientUserId())
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        // Prevent users from creating conversations with themselves
        if (currentUser.getUserid().equals(recipientUser.getUserid())) {
            throw new RuntimeException("Cannot create conversation with yourself");
        }

        // Check if conversation already exists
        Conversation conversation = conversationRepository
                .findByUsers(currentUser, recipientUser)
                .orElse(null);

        // If conversation doesn't exist, create a new one
        if (conversation == null) {
            conversation = new Conversation(currentUser, recipientUser);
            conversation = conversationRepository.save(conversation);
        }

        return convertToConversationResponse(conversation, currentUser);
    }

    /**
     * Send a message in a conversation
     * 
     * Creates a new message in the specified conversation and updates
     * the conversation's updated_at timestamp to reflect recent activity.
     * 
     * Validates that:
     * - Conversation exists
     * - Current user is a participant in the conversation
     * - Message content is not empty
     * 
     * @param request Contains conversation ID and message content
     * @return Message response DTO
     * @throws RuntimeException if conversation not found or user not authorized
     */
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request) {
        Users currentUser = userService.getCurrentUser();
        
        // Get the conversation
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Security check: verify current user is part of this conversation
        if (!isUserInConversation(currentUser, conversation)) {
            throw new RuntimeException("You are not authorized to send messages in this conversation");
        }

        // Create and save the message
        Message message = new Message(conversation, currentUser, request.getContent());
        message = messageRepository.save(message);

        // Update conversation's updated_at timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return convertToMessageResponse(message);
    }

    /**
     * Get a specific conversation by ID
     * 
     * Retrieves conversation details for display in the message thread header.
     * Validates that the current user is a participant in the conversation.
     * 
     * @param conversationId ID of the conversation
     * @return Conversation response DTO
     * @throws RuntimeException if conversation not found or user not authorized
     */
    @Transactional(readOnly = true)
    public ConversationResponse getConversationById(Long conversationId) {
        Users currentUser = userService.getCurrentUser();
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Security check
        if (!isUserInConversation(currentUser, conversation)) {
            throw new RuntimeException("You are not authorized to view this conversation");
        }

        return convertToConversationResponse(conversation, currentUser);
    }

    /**
     * Helper: Check if a user is a participant in a conversation
     * 
     * @param user User to check
     * @param conversation Conversation to check
     * @return true if user is user1 or user2 in the conversation
     */
    private boolean isUserInConversation(Users user, Conversation conversation) {
        return conversation.getUser1().getUserid().equals(user.getUserid()) ||
               conversation.getUser2().getUserid().equals(user.getUserid());
    }

    /**
     * Helper: Convert Conversation entity to ConversationResponse DTO
     * 
     * Determines which user is the "other user" based on the current user,
     * and populates the response with that user's information.
     * 
     * @param conversation The conversation entity
     * @param currentUser The current authenticated user
     * @return Conversation response DTO
     */
    private ConversationResponse convertToConversationResponse(Conversation conversation, 
                                                               Users currentUser) {
        // Determine who the "other user" is (the person we're chatting with)
        Users otherUser = conversation.getUser1().getUserid().equals(currentUser.getUserid())
                ? conversation.getUser2()
                : conversation.getUser1();

        return new ConversationResponse(
                conversation.getId(),
                otherUser.getUserid(),
                otherUser.getDisplayname(),
                otherUser.getEmail(),
                conversation.getUpdatedAt(),
                conversation.getCreatedAt()
        );
    }

    /**
     * Helper: Convert Message entity to MessageResponse DTO
     * 
     * @param message The message entity
     * @return Message response DTO
     */
    private MessageResponse convertToMessageResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getConversation().getId(),
                message.getSender().getUserid(),
                message.getSender().getDisplayname(),
                message.getContent(),
                message.getSentAt()
        );
    }
}
