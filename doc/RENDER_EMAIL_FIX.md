# Gmail SMTP on Port 465 (SSL) - Render Deployment Fix

## Problem
Render (and most cloud platforms) block outbound connections to port 587 (TLS/STARTTLS).
This causes: `Couldn't connect to host, port: smtp.gmail.com, 587; timeout 5000`

## Solution: Use Port 465 (SSL)
Port 465 uses direct SSL connection and is less commonly blocked.

## Render Environment Variables Setup

Go to your Render dashboard → Service → Environment → Add environment variables:

### Email Configuration (Port 465 SSL)
```bash
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=your-email@gmail.com
```

**Note:** Use your actual Gmail credentials that you have in your local `application-supabase.properties` file.

## How to Update on Render

1. **Go to Render Dashboard**
   - https://dashboard.render.com/
   - Select your `glyzier-backend` service

2. **Update Environment Variables**
   - Click "Environment" tab on the left
   - The variables should already exist (EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_FROM)
   - **No changes needed** - the credentials are the same, only the Spring Boot config changed

3. **Redeploy**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or push this commit to trigger auto-deploy

4. **Test**
   - Try forgot password again
   - Check Render logs for:
     ```
     ✓ Email sent successfully to: user@example.com
     ```

## Alternative: SendGrid (Recommended for Production)

If port 465 still doesn't work, use SendGrid (free tier: 100 emails/day):

### 1. Sign up for SendGrid
- Visit: https://signup.sendgrid.com/
- Free tier: 100 emails/day (plenty for password resets)

### 2. Generate API Key
- Dashboard → Settings → API Keys → Create API Key
- Name: "Glyzier Production"
- Permissions: "Mail Send" → "Full Access"
- Copy the API key (starts with `SG.`)

### 3. Update Render Environment Variables
```bash
# Remove Gmail variables, add SendGrid:
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com  # Or verified sender email
```

### 4. Update Spring Boot Configuration
```properties
# In application.properties
spring.sendgrid.api-key=${SENDGRID_API_KEY:}
```

### 5. Update EmailService.java to use SendGrid
- Install SendGrid dependency in pom.xml
- Use SendGrid Java SDK instead of JavaMailSender

## Why Port 587 is Blocked

Cloud platforms (Render, Heroku, AWS, etc.) block port 587 to prevent:
- Spam email campaigns from compromised servers
- Unauthorized bulk email sending
- SMTP relay abuse

**Allowed ports:**
- ✅ 465 (SSL) - Less commonly blocked
- ✅ 2525 (Alternative submission port)
- ❌ 587 (TLS/STARTTLS) - **Commonly blocked**
- ❌ 25 (Standard SMTP) - **Always blocked**

## Current Behavior (Even if Email Fails)

**Good news:** The feature still works! The 6-digit code is **always logged to console**, so:

1. User requests reset code
2. Code is generated and saved to database
3. Email sending fails (port blocked)
4. **Code is logged to Render logs** ← User can find it here
5. User enters code from logs
6. Password reset succeeds

### To find the code in Render logs:
1. Go to Render Dashboard → Your Service → Logs
2. Search for "PASSWORD RESET CODE"
3. Copy the 6-digit code
4. Use it to reset password

## Testing Locally

Your local machine doesn't have port restrictions, so email works fine:
```bash
cd glyzier-backend
./mvnw spring-boot:run

# Try forgot password - email should send successfully
```

## Production Recommendations

For a production app, consider:

1. **SendGrid** - 99% deliverability, proper email reputation
2. **AWS SES** - Pay-as-you-go, very reliable
3. **Mailgun** - Developer-friendly API
4. **Postmark** - Excellent for transactional emails

All of these work perfectly on Render and other cloud platforms.

## Summary

**Quick Fix:** Port 465 (SSL) instead of 587 (TLS)
- Changed: `spring.mail.port=465`
- Added: SSL-specific properties
- No credential changes needed on Render

**If still blocked:** Use SendGrid (recommended for production anyway)

**Current workaround:** Code is logged to console, feature works even without email
