package com.glyzier.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.from:noreply@glyzier.com}")
    private String fromEmail;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    @Value("${spring.mail.password:}")
    private String mailPassword;
    
    @Value("${spring.mail.host:}")
    private String mailHost;
    
    @PostConstruct
    public void init() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("EMAIL SERVICE INITIALIZATION");
        System.out.println("=".repeat(60));
        
        boolean isConfigured = isEmailConfigurationValid();
        
        if (isConfigured && mailSender != null) {
            System.out.println("✓ Email service: CONFIGURED");
            System.out.println("  Host: " + mailHost);
            System.out.println("  Username: " + maskEmail(mailUsername));
            System.out.println("  From: " + fromEmail);
            System.out.println("  Status: Ready to send emails");
        } else {
            System.out.println("⚠ Email service: NOT CONFIGURED");
            System.out.println("  Status: Console mode (codes will be logged)");
            if (mailSender == null) {
                System.out.println("  Reason: JavaMailSender bean not available");
            }
            if (!isConfigured) {
                System.out.println("  Reason: Email credentials not set or using placeholders");
                System.out.println("  Action: Configure in application.properties");
            }
        }
        System.out.println("=".repeat(60) + "\n");
    }
    
    private String maskEmail(String email) {
        if (email == null || email.isEmpty()) return "not set";
        if (email.contains("@")) {
            String[] parts = email.split("@");
            if (parts[0].length() > 2) {
                return parts[0].substring(0, 2) + "***@" + parts[1];
            }
        }
        return "***";
    }
    
    public void sendPasswordResetCode(String toEmail, String code) {
        // ALWAYS log the code to console (for development and fallback)
        System.out.println("\n" + "=".repeat(50));
        System.out.println("=== PASSWORD RESET CODE ===");
        System.out.println("=".repeat(50));
        System.out.println("Email: " + toEmail);
        System.out.println("Code:  " + code);
        System.out.println("=".repeat(50));
        System.out.println("This code expires in 10 minutes.");
        System.out.println("=".repeat(50) + "\n");
        
        // Check if email is properly configured
        boolean isEmailConfigured = isEmailConfigurationValid();
        
        if (!isEmailConfigured || mailSender == null) {
            // Email not configured - code is already logged above
            System.out.println("NOTE: Email sending is not configured.");
            System.out.println("The code is displayed above. To enable email sending:");
            System.out.println("1. Edit: glyzier-backend/src/main/resources/application.properties");
            System.out.println("2. Replace 'your-email@gmail.com' with your actual Gmail address");
            System.out.println("3. Replace 'your-app-password' with a Gmail App Password");
            System.out.println("4. Generate App Password: https://myaccount.google.com/apppasswords");
            System.out.println("5. Restart the application\n");
            return;
        }
        
        // Try to send email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Glyzier - Password Reset Code");
            message.setText("Your password reset code is: " + code + "\n\n" +
                          "This code will expire in 10 minutes.\n\n" +
                          "If you did not request this code, please ignore this email.\n\n" +
                          "Best regards,\n" +
                          "Glyzier Team");
            
            mailSender.send(message);
            System.out.println("✓ Email sent successfully to: " + toEmail);
            System.out.println("  (Code is also displayed above for reference)\n");
        } catch (MailException e) {
            System.err.println("\n✗ Failed to send email to: " + toEmail);
            System.err.println("Error: " + e.getMessage());
            System.err.println("\nThe code is displayed above. Please use it to reset your password.");
            System.err.println("\nTo fix email sending:");
            System.err.println("1. Verify your email credentials in application.properties");
            System.err.println("2. For Gmail: Make sure you're using an App Password (not regular password)");
            System.err.println("3. Check that 2-Step Verification is enabled");
            System.err.println("4. Verify SMTP settings are correct\n");
            
            // Don't throw exception - code is logged, user can proceed
            // Just log the error for debugging
            if (e.getCause() != null) {
                System.err.println("Root cause: " + e.getCause().getMessage());
            }
        }
    }
    
    /**
     * Check if email configuration is valid
     */
    private boolean isEmailConfigurationValid() {
        // Check if host is set
        if (mailHost == null || mailHost.isEmpty() || mailHost.equals("your-smtp-server.com")) {
            return false;
        }
        
        // Check if username and password are set (not placeholder values)
        if (mailUsername == null || mailUsername.isEmpty() || 
            mailUsername.equals("your-email@gmail.com") ||
            mailUsername.equals("your-email@outlook.com") ||
            mailUsername.equals("your-email@yahoo.com") ||
            mailUsername.contains("your-email") ||
            mailUsername.contains("your-username")) {
            return false;
        }
        
        if (mailPassword == null || mailPassword.isEmpty() || 
            mailPassword.equals("your-app-password") ||
            mailPassword.equals("your-password") ||
            mailPassword.contains("your-app") ||
            mailPassword.contains("your-password")) {
            return false;
        }
        
        return true;
    }
}

