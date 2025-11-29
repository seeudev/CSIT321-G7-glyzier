# CORS Configuration Fix for Development

## What Was Fixed

The backend API was returning **403 Forbidden** errors for requests from the frontend because CORS (Cross-Origin Resource Sharing) was not configured. 

During development:
- **Frontend**: Runs on `http://localhost:5173` (Vite dev server)
- **Backend**: Runs on `http://localhost:8080` (Spring Boot)

These are different origins, so the browser blocks requests by default for security reasons.

## Solution Implemented

Updated `SecurityConfig.java` to add a CORS configuration bean that:

1. **Allows frontend origins**:
   - `http://localhost:5173` (default Vite port)
   - `http://localhost:3000` (alternative dev server)
   - `http://127.0.0.1:5173` and `http://127.0.0.1:3000` (IPv4 alternatives)

2. **Allows all common HTTP methods**:
   - GET, POST, PUT, DELETE, PATCH, OPTIONS

3. **Allows credentials**:
   - Cookies and Authorization headers

4. **Exposes necessary headers**:
   - Authorization, Content-Type, etc.

5. **Caches pre-flight requests** for 1 hour to reduce overhead

## What to Do Next

1. **Restart your backend** - The Java changes require a restart
   ```bash
   # Stop the current backend process and run it again
   mvn spring-boot:run
   # Or use your IDE's Run button
   ```

2. **Test the API calls** - Refresh your frontend and try:
   - Login/Register
   - Add to cart
   - Add to favorites
   - Check messages/conversations

3. **Monitor the console** - You should no longer see 403 errors

## For Production

When deploying to production, update the allowed origins in `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

## Files Modified

- `glyzier-backend/src/main/java/com/glyzier/config/SecurityConfig.java`
  - Added CORS imports
  - Added `corsConfigurationSource()` bean
  - Enabled CORS in security filter chain
  - Updated documentation comments
