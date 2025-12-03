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
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import java.io.IOException;

/**
 * EmailService
 * 
 * Handles email sending with automatic fallback:
 * 1. SendGrid HTTP API (for Render/production - ports 80/443 never blocked)
 * 2. SMTP (for local development)
 * 3. Console logging (if neither configured)
 * 
 * Render blocks SMTP ports (465, 587) so SendGrid is required for production.
 */
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
    
    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;
    
    @PostConstruct
    public void init() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("EMAIL SERVICE INITIALIZATION");
        System.out.println("=".repeat(60));
        
        boolean hasSendGrid = sendGridApiKey != null && !sendGridApiKey.isEmpty() && !sendGridApiKey.contains("your-");
        boolean hasSmtp = isEmailConfigurationValid();
        
        if (hasSendGrid) {
            System.out.println("✓ Email service: SENDGRID (HTTP API)");
            System.out.println("  Provider: SendGrid");
            System.out.println("  API Key: " + maskApiKey(sendGridApiKey));
            System.out.println("  From: " + fromEmail);
            System.out.println("  Status: Production-ready (works on Render)");
            System.out.println("  Note: Uses HTTP API (port 443) - never blocked");
        } else if (hasSmtp && mailSender != null) {
            System.out.println("✓ Email service: SMTP");
            System.out.println("  Host: " + mailHost);
            System.out.println("  Username: " + maskEmail(mailUsername));
            System.out.println("  From: " + fromEmail);
            System.out.println("  Status: Ready (local development)");
            System.out.println("  ⚠ WARNING: SMTP blocked on Render - use SendGrid for production");
        } else {
            System.out.println("⚠ Email service: NOT CONFIGURED");
            System.out.println("  Status: Console mode (codes will be logged)");
            System.out.println("  ");
            System.out.println("  For PRODUCTION (Render):");
            System.out.println("    1. Create SendGrid account (free): https://signup.sendgrid.com/");
            System.out.println("    2. Get API key from Settings → API Keys");
            System.out.println("    3. Add to Render: SENDGRID_API_KEY=SG.xxx...");
            System.out.println("  ");
            System.out.println("  For LOCAL development:");
            System.out.println("    1. Configure Gmail in application-supabase.properties");
            System.out.println("    2. Use App Password (not regular password)");
        }
        System.out.println("=".repeat(60) + "\n");
    }
    
    private String maskApiKey(String key) {
        if (key == null || key.length() < 10) return "***";
        return key.substring(0, 8) + "..." + key.substring(key.length() - 4);
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
        
        // Try SendGrid first (production - works on Render)
        boolean hasSendGrid = sendGridApiKey != null && !sendGridApiKey.isEmpty() && !sendGridApiKey.contains("your-");
        if (hasSendGrid) {
            try {
                sendViaSendGrid(toEmail, code);
                System.out.println("✓ Email sent via SendGrid to: " + toEmail);
                System.out.println("  Provider: SendGrid HTTP API");
                System.out.println("  (Code is also displayed above for reference)\n");
                return;
            } catch (Exception e) {
                System.err.println("✗ SendGrid failed: " + e.getMessage());
                System.err.println("  Falling back to SMTP...\n");
                // Fall through to SMTP
            }
        }
        
        // Try SMTP (local development)
        boolean hasSmtp = isEmailConfigurationValid();
        if (hasSmtp && mailSender != null) {
            try {
                sendViaSMTP(toEmail, code);
                System.out.println("✓ Email sent via SMTP to: " + toEmail);
                System.out.println("  (Code is also displayed above for reference)\n");
                return;
            } catch (MailException e) {
                System.err.println("\n✗ SMTP failed: " + e.getMessage());
                if (e.getCause() != null) {
                    System.err.println("  Root cause: " + e.getCause().getMessage());
                }
                System.err.println("\n  ⚠ This is expected on Render (SMTP ports blocked)");
                System.err.println("  To fix: Set up SendGrid (see documentation)\n");
            }
        }
        
        // Neither configured - console mode
        System.out.println("ℹ Email not sent (no provider configured)");
        System.out.println("  The code is displayed above. Use it to reset your password.");
        System.out.println("  ");
        System.out.println("  To enable email:");
        System.out.println("  - PRODUCTION: Add SendGrid API key to Render");
        System.out.println("  - LOCAL: Configure Gmail in application-supabase.properties\n");
    }
    
    /**
     * Send email via SendGrid HTTP API (production - works on Render)
     */
    private void sendViaSendGrid(String toEmail, String code) throws IOException {
        Email from = new Email(fromEmail, "Glyzier");
        Email to = new Email(toEmail);
        String subject = "Glyzier - Password Reset Code";
        Content content = new Content("text/html", createPasswordResetEmailHtml(code));
        Mail mail = new Mail(from, subject, to, content);
        
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 400) {
                throw new IOException("SendGrid returned status " + response.getStatusCode() + ": " + response.getBody());
            }
        } catch (IOException ex) {
            throw ex;
        }
    }
    
    /**
     * Send email via SMTP (local development only - blocked on Render)
     */
    private void sendViaSMTP(String toEmail, String code) throws MailException {
        org.springframework.mail.javamail.MimeMessagePreparator preparator = mimeMessage -> {
            mimeMessage.setFrom(fromEmail);
            mimeMessage.setRecipient(jakarta.mail.Message.RecipientType.TO, new jakarta.mail.internet.InternetAddress(toEmail));
            mimeMessage.setSubject("Glyzier - Password Reset Code");
            String htmlContent = createPasswordResetEmailHtml(code);
            mimeMessage.setContent(htmlContent, "text/html; charset=utf-8");
        };
        mailSender.send(preparator);
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

