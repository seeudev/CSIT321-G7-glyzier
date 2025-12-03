# Email Configuration Setup Guide

## Quick Start (Local Development)

Your email credentials are already configured in `application-supabase.properties` (not tracked by git). The forgot password feature should work immediately when you start the application.

## File Structure

```
glyzier-backend/
├── .env.example                           # Template for environment variables
├── src/main/resources/
│   ├── application.properties             # Base config (uses env variables)
│   ├── application-supabase.properties    # ✅ Your actual credentials (gitignored)
│   └── application-supabase.properties.template  # Template for new developers
```

## Configuration Locations

### 1. Local Development (Current Setup)
**File**: `application-supabase.properties` (gitignored)
```properties
spring.mail.username=gamevaultkeys@gmail.com
spring.mail.password=fvbj pmiz bdbn gnbq
spring.mail.from=gamevaultkeys@gmail.com
```

### 2. Production/Deployment
**Use environment variables** in your hosting platform:
```bash
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

The application will automatically use environment variables if they're set, otherwise it falls back to the properties file.

## For New Developers

If you're setting up the project for the first time:

1. Copy the template:
   ```bash
   cd glyzier-backend/src/main/resources
   cp application-supabase.properties.template application-supabase.properties
   ```

2. Edit `application-supabase.properties` and add your email credentials:
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   spring.mail.from=your-email@gmail.com
   ```

3. Generate Gmail App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification (required)
   - Create app password for "Mail"
   - Use the 16-character password (remove spaces)

## Security Notes

✅ **Safe** (gitignored):
- `application-supabase.properties` - Your actual credentials
- `.env` - Alternative for environment variables

❌ **Never commit**:
- Email passwords
- Database passwords
- API keys
- JWT secrets

📝 **Safe to commit** (templates):
- `application.properties` - Uses placeholders
- `application-supabase.properties.template` - Template only
- `.env.example` - Example file

## Testing Email Functionality

When you start the application, check the console output:

### ✅ Email Configured Successfully
```
============================================================
EMAIL SERVICE INITIALIZATION
============================================================
✓ Email service: CONFIGURED
  Host: smtp.gmail.com
  Username: ga***@gmail.com
  From: gamevaultkeys@gmail.com
  Status: Ready to send emails
============================================================
```

### ⚠️ Email Not Configured
```
============================================================
EMAIL SERVICE INITIALIZATION
============================================================
⚠ Email service: NOT CONFIGURED
  Status: Console mode (codes will be logged)
  Reason: Email credentials not set or using placeholders
  Action: Configure in application-supabase.properties
============================================================
```

## How Forgot Password Works

1. **User requests reset** → Backend generates 6-digit code
2. **Code is saved to database** → Valid for 10 minutes
3. **Email is sent** → Via Gmail SMTP
4. **Code is logged to console** → Always logged for development
5. **User enters code** → Validates and resets password

## Troubleshooting

### Emails not sending?
The code is **always logged to the console**, so the feature works even if email fails. Check:
- Gmail App Password is correct (16 characters, no spaces)
- 2-Step Verification is enabled on Gmail account
- Not hitting Gmail's sending limits (500 emails/day)

### Application won't start?
- Ensure `application-supabase.properties` exists
- Check database credentials are correct
- Verify no syntax errors in properties file

## Environment Variable Priority

Spring Boot loads configuration in this order (later overrides earlier):
1. `application.properties` (base config, env variable placeholders)
2. `application-supabase.properties` (profile-specific overrides)
3. Environment variables (highest priority)

So you can override ANY property using environment variables without changing files.
