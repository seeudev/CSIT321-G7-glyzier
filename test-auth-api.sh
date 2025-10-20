#!/bin/bash

# Test script for Glyzier Authentication API
# Module 2: Authentication & User API Testing

echo "======================================"
echo "Testing Glyzier Authentication API"
echo "======================================"
echo ""

BASE_URL="http://localhost:8080"

# Test 1: Register a new user
echo "Test 1: Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@glyzier.com","displayname":"Test User","password":"password123"}')
  
echo "Registration Response:"
echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

# Test 2: Login with the registered user
echo "Test 2: Logging in with the registered user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@glyzier.com","password":"password123"}')
  
echo "Login Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract token from login response if registration failed
if [ -z "$TOKEN" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
fi

# Test 3: Get current user information using JWT token
if [ -n "$TOKEN" ]; then
    echo "Test 3: Getting current user information..."
    USER_INFO_RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/me" \
      -H "Authorization: Bearer $TOKEN")
      
    echo "User Info Response:"
    echo "$USER_INFO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$USER_INFO_RESPONSE"
    echo ""
else
    echo "Test 3: Skipped - No valid token available"
    echo ""
fi

# Test 4: Try to register with duplicate email (should fail)
echo "Test 4: Attempting to register with duplicate email..."
DUPLICATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@glyzier.com","displayname":"Duplicate User","password":"password456"}')
  
echo "Duplicate Registration Response:"
echo "$DUPLICATE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$DUPLICATE_RESPONSE"
echo ""

# Test 5: Try to login with wrong password (should fail)
echo "Test 5: Attempting to login with wrong password..."
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@glyzier.com","password":"wrongpassword"}')
  
echo "Wrong Password Response:"
echo "$WRONG_PASSWORD_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WRONG_PASSWORD_RESPONSE"
echo ""

# Test 6: Try to access protected endpoint without token (should fail)
echo "Test 6: Accessing protected endpoint without token..."
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/me")

echo "No Token Response:"
echo "$NO_TOKEN_RESPONSE"
echo ""

echo "======================================"
echo "Testing Complete!"
echo "======================================"
