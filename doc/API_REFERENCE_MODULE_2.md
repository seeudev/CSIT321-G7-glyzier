# Glyzier API Reference - Authentication Endpoints

## Base URL
```
http://localhost:8080
```

---

## Authentication Endpoints

### 1. Register New User
**Endpoint:** `POST /api/auth/register`  
**Authentication:** Not required (Public)  
**Description:** Creates a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "displayname": "John Doe",
  "password": "securePassword123"
}
```

**Success Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userid": 1,
  "email": "user@example.com",
  "displayname": "John Doe",
  "seller": false
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already registered"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "displayname": "John Doe",
    "password": "securePassword123"
  }'
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required (Public)  
**Description:** Authenticates a user and returns a JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userid": 1,
  "email": "user@example.com",
  "displayname": "John Doe",
  "seller": false
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

## User Endpoints

### 3. Get Current User
**Endpoint:** `GET /api/users/me`  
**Authentication:** Required (JWT Token)  
**Description:** Returns information about the currently authenticated user

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200 OK):**
```json
{
  "userid": 1,
  "email": "user@example.com",
  "displayname": "John Doe",
  "createdAt": "2024-10-20T10:30:00",
  "isSeller": false
}
```

**Success Response (200 OK) - When user is also a seller:**
```json
{
  "userid": 1,
  "email": "user@example.com",
  "displayname": "John Doe",
  "createdAt": "2024-10-20T10:30:00",
  "isSeller": true,
  "sellerid": 5,
  "sellername": "John's Art Store"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized: No authenticated user found"
}
```

**cURL Example:**
```bash
# Replace <JWT_TOKEN> with your actual token from login/register
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Authentication Flow

### Standard User Registration and Login Flow

```
1. Client                    2. Backend                   3. Database
   |                            |                            |
   |-- POST /api/auth/register ->|                            |
   |    {email, displayname,     |                            |
   |     password}               |                            |
   |                             |-- Check if email exists -->|
   |                             |<-- Email available --------|
   |                             |                            |
   |                             |-- Hash password with BCrypt |
   |                             |                            |
   |                             |-- Save new user ---------->|
   |                             |<-- User saved --------------|
   |                             |                            |
   |                             |-- Generate JWT token ------|
   |<-- {token, user info} ------|                            |
   |                             |                            |
   
   
4. Subsequent Requests
   |                             |                            |
   |-- GET /api/users/me ------->|                            |
   |    Header: Bearer <token>   |                            |
   |                             |-- Validate JWT token ------|
   |                             |-- Extract email from token  |
   |                             |-- Load user from DB ------->|
   |                             |<-- User data ---------------|
   |<-- {user info} -------------|                            |
```

---

## JWT Token Information

### Token Structure
The JWT token consists of three parts separated by dots:
```
Header.Payload.Signature
```

### Token Lifespan
- **Expiration:** 24 hours (86400000 milliseconds)
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Secret:** Configured in `application.properties`

### How to Use the Token

1. **Store the token** after successful login/registration
   - LocalStorage (React): `localStorage.setItem('token', response.token)`
   - SessionStorage: `sessionStorage.setItem('token', response.token)`
   - State Management: Redux, Context API, etc.

2. **Include in requests** to protected endpoints
   ```javascript
   fetch('http://localhost:8080/api/users/me', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

3. **Handle expiration**
   - Token expires after 24 hours
   - Client receives 401 Unauthorized
   - User must login again

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | When It Occurs |
|------------|---------|----------------|
| 200 | OK | Successful request |
| 201 | Created | Successful registration |
| 400 | Bad Request | Invalid input, duplicate email |
| 401 | Unauthorized | Invalid credentials, missing/invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Error Response Format
All errors return JSON in this format:
```json
{
  "error": "Description of the error"
}
```

---

## Testing with cURL

### Complete Test Sequence

```bash
# 1. Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@glyzier.com","displayname":"Test User","password":"test123"}'

# Save the token from the response
TOKEN="<paste_token_here>"

# 2. Login (optional, to test login endpoint)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@glyzier.com","password":"test123"}'

# 3. Get current user information
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Test error: Try to register with same email
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@glyzier.com","displayname":"Another User","password":"test456"}'

# 5. Test error: Try wrong password
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@glyzier.com","password":"wrongpassword"}'

# 6. Test error: Access protected endpoint without token
curl -X GET http://localhost:8080/api/users/me
```

---

## Frontend Integration Example (React)

### Registration Component
```javascript
const register = async (email, displayname, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, displayname, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

### Login Component
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      const error = await response.json();
      return { success: false, error: error.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

### Protected Request Example
```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:8080/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false, error: 'Unauthorized' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

---

## Security Considerations

### Best Practices
1. heck the remaining files in the batch due to size...