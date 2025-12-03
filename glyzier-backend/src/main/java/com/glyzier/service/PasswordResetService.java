package com.glyzier.service;

import com.glyzier.dto.ForgotPasswordRequest;
import com.glyzier.dto.ResetPasswordRequest;
import com.glyzier.model.PasswordResetCode;
import com.glyzier.model.Users;
import com.glyzier.repository.PasswordResetCodeRepository;
import com.glyzier.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Random;

/**
 * Password Reset Service
 * 
 * Handles the forgot password functionality:
 * 1. Generate and send password reset code via email
 * 2. Verify reset code and update password
 * 
 * Security features:
 * - 6-digit random code
 * - 10-minute expiration
 * - One-time use codes
 * - Invalidate all previous codes when new one is generated
 * 
 * @author Glyzier Team
 * @version 1.0
 */
@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetCodeRepository resetCodeRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Send password reset code to user's email
     * 
     * Process:
     * 1. Check if email exists in system
     * 2. Generate 6-digit random code
     * 3. Save code to database with 10-minute expiration
     * 4. Send code via email
     * 5. Invalidate all previous unused codes for this email
     * 
     * @param request ForgotPasswordRequest containing email
     * @return Success message
     * @throws RuntimeException if email not found
     */
    @Transactional
    public String sendResetCode(ForgotPasswordRequest request) {
        // Normalize email to lowercase
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        
        // Check if user exists
        Users user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        
        // FIRST: Invalidate all old unused codes for this email (for security)
        // This ensures only the latest code is valid
        resetCodeRepository.invalidateAllCodesForEmail(normalizedEmail);
        
        // Generate 6-digit random code
        String code = generateResetCode();
        
        // Calculate expiration time (10 minutes from now)
        Timestamp createdAt = Timestamp.from(Instant.now());
        Timestamp expiresAt = Timestamp.from(Instant.now().plusSeconds(600)); // 10 minutes
        
        // Create and save reset code entity
        PasswordResetCode resetCode = new PasswordResetCode(
            normalizedEmail,
            code,
            createdAt,
            expiresAt
        );
        resetCodeRepository.save(resetCode);
        
        // Send email with reset code
        emailService.sendPasswordResetCode(normalizedEmail, code);
        
        return "Password reset code sent to " + normalizedEmail;
    }
    
    /**
     * Reset password using verification code
     * 
     * Process:
     * 1. Verify email exists
     * 2. Find valid reset code (unused and not expired)
     * 3. Validate code matches
     * 4. Update user password
     * 5. Mark code as used
     * 
     * @param request ResetPasswordRequest containing email, code, and new password
     * @return Success message
     * @throws RuntimeException if validation fails
     */
    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        // Normalize email
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        
        // Verify user exists
        Users user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        
        // Find the latest valid code for this email
        Timestamp now = Timestamp.from(Instant.now());
        PasswordResetCode resetCode = resetCodeRepository
                .findLatestValidCodeByEmail(normalizedEmail, now)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset code"));
        
        // Verify the code matches
        if (!resetCode.getCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid reset code");
        }
        
        // Validate new password (minimum 6 characters)
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        
        // Update user password (encrypt before saving)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Mark the code as used
        resetCode.setUsed(true);
        resetCodeRepository.save(resetCode);
        
        // Invalidate all other codes for this email
        resetCodeRepository.invalidateAllCodesForEmail(normalizedEmail);
        
        return "Password reset successfully";
    }
    
    /**
     * Generate a random 6-digit code
     * 
     * @return String containing 6 random digits
     */
    private String generateResetCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Generates number between 100000-999999
        return String.valueOf(code);
    }
}
