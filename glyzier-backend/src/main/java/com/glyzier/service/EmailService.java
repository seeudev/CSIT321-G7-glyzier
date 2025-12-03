package com.glyzier.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;

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
            System.out.println("1. Edit: glyzier-backend/src/main/resources/application-supabase.properties");
            System.out.println("2. Add your Gmail credentials");
            System.out.println("3. Generate App Password: https://myaccount.google.com/apppasswords");
            System.out.println("4. Restart the application\n");
            return;
        }
        
        // Try to send email with HTML template
        try {
            // Create HTML email
            org.springframework.mail.javamail.MimeMessagePreparator preparator = mimeMessage -> {
                mimeMessage.setFrom(fromEmail);
                mimeMessage.setRecipient(jakarta.mail.Message.RecipientType.TO, new jakarta.mail.internet.InternetAddress(toEmail));
                mimeMessage.setSubject("Glyzier - Password Reset Code");
                
                // HTML email body with glassmorphism theme
                String htmlContent = createPasswordResetEmailHtml(code);
                mimeMessage.setContent(htmlContent, "text/html; charset=utf-8");
            };
            
            mailSender.send(preparator);
            System.out.println("✓ Email sent successfully to: " + toEmail);
            System.out.println("  (Code is also displayed above for reference)\n");
        } catch (MailException e) {
            System.err.println("\n✗ Failed to send email to: " + toEmail);
            System.err.println("Error: " + e.getMessage());
            System.err.println("\nThe code is displayed above. Please use it to reset your password.");
            System.err.println("\nTo fix email sending:");
            System.err.println("1. Verify your email credentials in application-supabase.properties");
            System.err.println("2. For Gmail: Make sure you're using an App Password (not regular password)");
            System.err.println("3. Check that 2-Step Verification is enabled");
            System.err.println("4. Verify SMTP settings are correct\n");
            
            // Don't throw exception - code is logged, user can proceed
            if (e.getCause() != null) {
                System.err.println("Root cause: " + e.getCause().getMessage());
            }
        }
    }
    
    /**
     * Create beautiful HTML email template with glassmorphism theme
     */
    private String createPasswordResetEmailHtml(String code) {
        return "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head>" +
            "  <meta charset=\"UTF-8\">" +
            "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
            "  <title>Password Reset - Glyzier</title>" +
            "</head>" +
            "<body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;\">" +
            "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"padding: 40px 20px;\">" +
            "    <tr>" +
            "      <td align=\"center\">" +
            "        <!-- Main Container -->" +
            "        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width: 600px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); overflow: hidden;\">" +
            "          <!-- Header -->" +
            "          <tr>" +
            "            <td style=\"background: rgba(255, 255, 255, 0.05); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1);\">" +
            "              <h1 style=\"margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 1px;\">Glyzier</h1>" +
            "              <p style=\"margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;\">Artist Marketplace</p>" +
            "            </td>" +
            "          </tr>" +
            "          <!-- Content -->" +
            "          <tr>" +
            "            <td style=\"padding: 40px 30px;\">" +
            "              <h2 style=\"margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 600; text-align: center;\">Password Reset Request</h2>" +
            "              <p style=\"margin: 0 0 30px 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6; text-align: center;\">You requested to reset your password. Use the code below to continue:</p>" +
            "              " +
            "              <!-- Code Box -->" +
            "              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 0 30px 0;\">" +
            "                <tr>" +
            "                  <td align=\"center\">" +
            "                    <div style=\"background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; padding: 20px 40px; display: inline-block;\">" +
            "                      <p style=\"margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.7); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;\">Your Reset Code</p>" +
            "                      <p style=\"margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;\">" + code + "</p>" +
            "                    </div>" +
            "                  </td>" +
            "                </tr>" +
            "              </table>" +
            "              " +
            "              <!-- Warning Box -->" +
            "              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background: rgba(255, 107, 107, 0.1); border-left: 4px solid rgba(255, 107, 107, 0.6); border-radius: 8px; margin: 0 0 30px 0;\">" +
            "                <tr>" +
            "                  <td style=\"padding: 15px 20px;\">" +
            "                    <p style=\"margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5;\">⏱️ <strong>This code expires in 10 minutes</strong></p>" +
            "                  </td>" +
            "                </tr>" +
            "              </table>" +
            "              " +
            "              <p style=\"margin: 0 0 20px 0; color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.6; text-align: center;\">If you didn't request this code, you can safely ignore this email. Your password will remain unchanged.</p>" +
            "            </td>" +
            "          </tr>" +
            "          <!-- Footer -->" +
            "          <tr>" +
            "            <td style=\"background: rgba(0, 0, 0, 0.1); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);\">" +
            "              <p style=\"margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600;\">Need help?</p>" +
            "              <p style=\"margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 1.5;\">Contact us if you have any questions or concerns</p>" +
            "              <p style=\"margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.4); font-size: 11px;\">© 2025 Glyzier. All rights reserved.</p>" +
            "            </td>" +
            "          </tr>" +
            "        </table>" +
            "      </td>" +
            "    </tr>" +
            "  </table>" +
            "</body>" +
            "</html>";
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

