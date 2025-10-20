# 🔌 Glyzier API Documentation

Complete API reference for the Glyzier Artist Portfolio and Store platform.

**Base URL**: `http://localhost:8080/api`  
**Authentication**: JWT Bearer Token (where required)  
**Content-Type**: `application/json`

---

## 📑 Table of Contents

1. [Authentication](#1-authentication-endpoints)
2. [User Management](#2-user-management-endpoints)
3. [Seller Management](#3-seller-management-endpoints)
4. [Product Management](#4-product-management-endpoints)
5. [Order Management](#5-order-management-endpoints)
6. [Error Responses](#6-error-responses)
7. [Testing Examples](#7-testing-examples)

---

## 1. Authentication Endpoints

### 1.1 Register User

**Endpoint**: `POST /api/auth/register`  
**Authentication**: Not required  
**Description**: Create a new user account

#### Request Body
```json
{
  "displayname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Validation Rules
- `displayname`: Required, 3-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

#### Success Response (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk...",
  "type": "Bearer",
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe"
}
```

#### Error Responses
- `400 Bad Request`: Validation failed or email already exists
  ```json
  {
    "error": "Email already exists"
  }
  ```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayname": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

### 1.2 Login User

**Endpoint**: `POST /api/auth/login`  
**Authentication**: Not required  
**Description**: Authenticate user and receive JWT token

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk...",
  "type": "Bearer",
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

## 2. User Management Endpoints

### 2.1 Get Current User

**Endpoint**: `GET /api/users/me`  
**Authentication**: Required (JWT)  
**Description**: Retrieve information about the currently authenticated user

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "isSeller": false
}
```

#### Error Responses
- `401 Unauthorized`: No token or invalid token
  ```json
  {
    "error": "Unauthorized"
  }
  ```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. Seller Management Endpoints

### 3.1 Register as Seller

**Endpoint**: `POST /api/sellers/register`  
**Authentication**: Required (JWT)  
**Description**: Convert user account to seller/artist account

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist specializing in portraits and landscapes. Creating unique pieces since 2020."
}
```

#### Validation Rules
- `sellername`: Required, 3-100 characters, unique
- `storebio`: Optional, max 1000 characters

#### Success Response (201 Created)
```json
{
  "message": "Successfully registered as a seller",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery",
    "storebio": "Professional digital artist specializing in portraits and landscapes.",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "user": {
      "userid": 1,
      "displayname": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Error Responses
- `400 Bad Request`: User already a seller
  ```json
  {
    "error": "User is already a seller"
  }
  ```
- `400 Bad Request`: Sellername taken
  ```json
  {
    "error": "Seller name already exists"
  }
  ```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/sellers/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellername": "Artisan Gallery",
    "storebio": "Professional digital artist"
  }'
```

---

### 3.2 Get Seller by ID

**Endpoint**: `GET /api/sellers/{sid}`  
**Authentication**: Not required  
**Description**: Get public information about a seller

#### URL Parameters
- `sid` (Long): Seller ID

#### Success Response (200 OK)
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist specializing in portraits and landscapes.",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "user": {
    "userid": 1,
    "displayname": "John Doe",
    "email": "john@example.com"
  },
  "products": [
    {
      "pid": 1,
      "productname": "Sunset Landscape",
      "type": "Print",
      "price": 29.99,
      "status": "Available"
    }
  ]
}
```

#### Error Responses
- `404 Not Found`: Seller doesn't exist
  ```json
  {
    "error": "Seller not found"
  }
  ```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/sellers/1
```

---

### 3.3 Get Own Seller Profile

**Endpoint**: `GET /api/sellers/me`  
**Authentication**: Required (JWT)  
**Description**: Get seller profile for the authenticated user

#### Success Response (200 OK)
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist",
  "createdAt": "2025-10-20T12:00:00.000+00:00"
}
```

#### Error Responses
- `404 Not Found`: User is not a seller
  ```json
  {
    "error": "User is not a seller"
  }
  ```

---

### 3.4 Check Seller Status

**Endpoint**: `GET /api/sellers/check`  
**Authentication**: Required (JWT)  
**Description**: Check if the authenticated user is a seller

#### Success Response (200 OK)
```json
{
  "isSeller": true,
  "sid": 1
}
```
or
```json
{
  "isSeller": false
}
```

---

## 4. Product Management Endpoints

### 4.1 Create Product (Seller Only)

**Endpoint**: `POST /api/products`  
**Authentication**: Required (JWT + Seller)  
**Description**: Create a new product listing

#### Request Body
```json
{
  "productname": "Sunset Landscape Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "fileKeys": ["sunset-main.jpg", "sunset-detail1.jpg", "sunset-detail2.jpg"]
}
```

#### Validation Rules
- `productname`: Required, 3-200 characters
- `type`: Required (e.g., "Print", "Digital", "Original")
- `price`: Required, must be positive
- `status`: Required (e.g., "Available", "Sold Out", "Coming Soon")
- `fileKeys`: Optional array of file key strings (simulated)

#### Success Response (201 Created)
```json
{
  "pid": 1,
  "productname": "Sunset Landscape Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery"
  },
  "files": [
    {
      "pfileid": 1,
      "fileKey": "sunset-main.jpg",
      "fileType": "image",
      "fileFormat": "jpg"
    },
    {
      "pfileid": 2,
      "fileKey": "sunset-detail1.jpg",
      "fileType": "image",
      "fileFormat": "jpg"
    }
  ],
  "inventory": null
}
```

#### Error Responses
- `403 Forbidden`: User is not a seller
  ```json
  {
    "error": "Only sellers can create products"
  }
  ```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productname": "Sunset Landscape Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "fileKeys": ["sunset-main.jpg"]
  }'
```

---

### 4.2 Get All Products

**Endpoint**: `GET /api/products`  
**Authentication**: Not required  
**Description**: Retrieve all products (public browsing)

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Items per page (default: 20)

#### Success Response (200 OK)
```json
{
  "content": [
    {
      "pid": 1,
      "productname": "Sunset Landscape Print",
      "type": "Print",
      "price": 29.99,
      "status": "Available",
      "createdAt": "2025-10-20T12:00:00.000+00:00",
      "seller": {
        "sid": 1,
        "sellername": "Artisan Gallery"
      }
    },
    {
      "pid": 2,
      "productname": "Abstract Digital Art",
      "type": "Digital",
      "price": 15.00,
      "status": "Available",
      "createdAt": "2025-10-20T13:00:00.000+00:00",
      "seller": {
        "sid": 2,
        "sellername": "Modern Canvas"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 2,
  "totalPages": 1
}
```

#### cURL Example
```bash
curl -X GET "http://localhost:8080/api/products?page=0&size=10"
```

---

### 4.3 Get Product by ID

**Endpoint**: `GET /api/products/{pid}`  
**Authentication**: Not required  
**Description**: Get detailed information about a specific product

#### URL Parameters
- `pid` (Long): Product ID

#### Success Response (200 OK)
```json
{
  "pid": 1,
  "productname": "Sunset Landscape Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery",
    "storebio": "Professional digital artist"
  },
  "files": [
    {
      "pfileid": 1,
      "fileKey": "sunset-main.jpg",
      "fileType": "image",
      "fileFormat": "jpg",
      "createdAt": "2025-10-20T12:00:00.000+00:00"
    }
  ],
  "inventory": {
    "invid": 1,
    "qtyonhand": 10,
    "qtyreserved": 2,
    "updatedAt": "2025-10-20T12:00:00.000+00:00"
  }
}
```

#### Error Responses
- `404 Not Found`: Product doesn't exist
  ```json
  {
    "error": "Product not found"
  }
  ```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/products/1
```

---

### 4.4 Update Product (Seller Only)

**Endpoint**: `PUT /api/products/{pid}`  
**Authentication**: Required (JWT + Product Owner)  
**Description**: Update an existing product

#### URL Parameters
- `pid` (Long): Product ID

#### Request Body
```json
{
  "productname": "Sunset Landscape Print - Limited Edition",
  "type": "Print",
  "price": 39.99,
  "status": "Available",
  "fileKeys": ["sunset-main-hd.jpg"]
}
```

#### Success Response (200 OK)
```json
{
  "pid": 1,
  "productname": "Sunset Landscape Print - Limited Edition",
  "type": "Print",
  "price": 39.99,
  "status": "Available",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery"
  },
  "files": [
    {
      "pfileid": 3,
      "fileKey": "sunset-main-hd.jpg",
      "fileType": "image",
      "fileFormat": "jpg"
    }
  ]
}
```

#### Error Responses
- `403 Forbidden`: User doesn't own this product
  ```json
  {
    "error": "You do not have permission to edit this product"
  }
  ```
- `404 Not Found`: Product doesn't exist

#### cURL Example
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productname": "Sunset Landscape Print - Limited Edition",
    "type": "Print",
    "price": 39.99,
    "status": "Available"
  }'
```

---

### 4.5 Delete Product (Seller Only)

**Endpoint**: `DELETE /api/products/{pid}`  
**Authentication**: Required (JWT + Product Owner)  
**Description**: Delete a product listing

#### URL Parameters
- `pid` (Long): Product ID

#### Success Response (200 OK)
```json
{
  "message": "Product deleted successfully"
}
```

#### Error Responses
- `403 Forbidden`: User doesn't own this product
- `404 Not Found`: Product doesn't exist

#### cURL Example
```bash
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4.6 Set Product Inventory (Seller Only)

**Endpoint**: `POST /api/products/{pid}/inventory`  
**Authentication**: Required (JWT + Product Owner)  
**Description**: Set or update inventory quantity for a product (simulated)

#### URL Parameters
- `pid` (Long): Product ID

#### Request Body
```json
{
  "qtyonhand": 50
}
```

#### Validation Rules
- `qtyonhand`: Required, must be >= 0

#### Success Response (200 OK)
```json
{
  "message": "Inventory updated successfully",
  "inventory": {
    "invid": 1,
    "qtyonhand": 50,
    "qtyreserved": 0,
    "updatedAt": "2025-10-20T15:30:00.000+00:00"
  }
}
```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/products/1/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qtyonhand": 50
  }'
```

---

### 4.7 Get Products by Seller

**Endpoint**: `GET /api/products/seller/{sid}`  
**Authentication**: Not required  
**Description**: Get all products from a specific seller

#### URL Parameters
- `sid` (Long): Seller ID

#### Success Response (200 OK)
```json
[
  {
    "pid": 1,
    "productname": "Sunset Landscape Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "createdAt": "2025-10-20T12:00:00.000+00:00"
  },
  {
    "pid": 3,
    "productname": "Mountain Vista",
    "type": "Print",
    "price": 35.00,
    "status": "Available",
    "createdAt": "2025-10-20T14:00:00.000+00:00"
  }
]
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/products/seller/1
```

---

## 5. Order Management Endpoints

### 5.1 Place Order

**Endpoint**: `POST /api/orders/place`  
**Authentication**: Required (JWT)  
**Description**: Place an order for one or more products (simulated checkout)

#### Request Body
```json
{
  "items": [
    {
      "pid": 1,
      "quantity": 2
    },
    {
      "pid": 3,
      "quantity": 1
    }
  ]
}
```

#### Validation Rules
- `items`: Required, at least 1 item
- `pid`: Required, must exist
- `quantity`: Required, must be > 0

#### Success Response (201 Created)
```json
{
  "message": "Order placed successfully",
  "order": {
    "orderid": 1,
    "total": 94.98,
    "status": "Completed",
    "placedAt": "2025-10-20T16:00:00.000+00:00",
    "items": [
      {
        "opid": 1,
        "productNameSnapshot": "Sunset Landscape Print",
        "unitPrice": 29.99,
        "quantity": 2
      },
      {
        "opid": 2,
        "productNameSnapshot": "Mountain Vista",
        "unitPrice": 35.00,
        "quantity": 1
      }
    ]
  }
}
```

#### Error Responses
- `400 Bad Request`: Product not found or insufficient inventory
  ```json
  {
    "error": "Product with ID 99 not found"
  }
  ```
  ```json
  {
    "error": "Insufficient inventory for product: Sunset Landscape Print"
  }
  ```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"pid": 1, "quantity": 2},
      {"pid": 3, "quantity": 1}
    ]
  }'
```

---

### 5.2 Get Order History

**Endpoint**: `GET /api/orders/my-history`  
**Authentication**: Required (JWT)  
**Description**: Get all orders placed by the authenticated user

#### Success Response (200 OK)
```json
[
  {
    "orderid": 1,
    "total": 94.98,
    "status": "Completed",
    "placedAt": "2025-10-20T16:00:00.000+00:00",
    "itemCount": 2
  },
  {
    "orderid": 2,
    "total": 29.99,
    "status": "Completed",
    "placedAt": "2025-10-21T10:30:00.000+00:00",
    "itemCount": 1
  }
]
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/orders/my-history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5.3 Get Order Details

**Endpoint**: `GET /api/orders/{orderid}`  
**Authentication**: Required (JWT + Order Owner)  
**Description**: Get detailed information about a specific order

#### URL Parameters
- `orderid` (Long): Order ID

#### Success Response (200 OK)
```json
{
  "orderid": 1,
  "total": 94.98,
  "status": "Completed",
  "placedAt": "2025-10-20T16:00:00.000+00:00",
  "user": {
    "userid": 1,
    "displayname": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "opid": 1,
      "productNameSnapshot": "Sunset Landscape Print",
      "unitPrice": 29.99,
      "quantity": 2,
      "product": {
        "pid": 1,
        "productname": "Sunset Landscape Print",
        "seller": {
          "sid": 1,
          "sellername": "Artisan Gallery"
        }
      }
    },
    {
      "opid": 2,
      "productNameSnapshot": "Mountain Vista",
      "unitPrice": 35.00,
      "quantity": 1,
      "product": {
        "pid": 3,
        "productname": "Mountain Vista",
        "seller": {
          "sid": 1,
          "sellername": "Artisan Gallery"
        }
      }
    }
  ]
}
```

#### Error Responses
- `403 Forbidden`: User doesn't own this order
  ```json
  {
    "error": "You do not have permission to view this order"
  }
  ```
- `404 Not Found`: Order doesn't exist

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 6. Error Responses

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized for this action |
| 404 | Not Found | Requested resource doesn't exist |
| 500 | Internal Server Error | Server-side error occurred |

### Error Response Format

All errors follow this format:
```json
{
  "error": "Human-readable error message",
  "timestamp": "2025-10-20T16:00:00.000+00:00",
  "status": 400
}
```

### Common Error Messages

#### Authentication Errors
```json
{"error": "Unauthorized"}
{"error": "Invalid or expired token"}
{"error": "Invalid email or password"}
```

#### Validation Errors
```json
{"error": "Email already exists"}
{"error": "Invalid email format"}
{"error": "Password must be at least 6 characters"}
{"error": "Product name is required"}
```

#### Permission Errors
```json
{"error": "Only sellers can create products"}
{"error": "You do not have permission to edit this product"}
{"error": "User is not a seller"}
```

#### Not Found Errors
```json
{"error": "Product not found"}
{"error": "Seller not found"}
{"error": "Order not found"}
```

---

## 7. Testing Examples

### Complete User Flow Test

#### 1. Register a User
```bash
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayname": "Test Artist",
    "email": "test@artist.com",
    "password": "Test123456"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"
```

#### 2. Become a Seller
```bash
curl -X POST http://localhost:8080/api/sellers/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellername": "Test Art Studio",
    "storebio": "Creating beautiful art for everyone"
  }'
```

#### 3. Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productname": "Test Artwork",
    "type": "Print",
    "price": 25.00,
    "status": "Available",
    "fileKeys": ["test-art.jpg"]
  }'
```

#### 4. Set Inventory
```bash
curl -X POST http://localhost:8080/api/products/1/inventory \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "qtyonhand": 100
  }'
```

#### 5. Browse Products (No Auth)
```bash
curl -X GET http://localhost:8080/api/products
```

#### 6. Place an Order (as different user)
```bash
# Register another user
BUYER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayname": "Art Buyer",
    "email": "buyer@test.com",
    "password": "Buyer123456"
  }')

BUYER_TOKEN=$(echo $BUYER_RESPONSE | jq -r '.token')

# Place order
curl -X POST http://localhost:8080/api/orders/place \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"pid": 1, "quantity": 2}
    ]
  }'
```

#### 7. Check Order History
```bash
curl -X GET http://localhost:8080/api/orders/my-history \
  -H "Authorization: Bearer $BUYER_TOKEN"
```

---

## 8. Notes and Best Practices

### JWT Token Management
- Tokens expire after 24 hours
- Store tokens securely (e.g., localStorage in browsers, secure storage in mobile apps)
- Include token in Authorization header: `Bearer <token>`
- Refresh token by logging in again when expired

### Pagination
- Default page size is 20 items
- Page numbers start at 0
- Use query parameters: `?page=0&size=10`

### Simulated Features
⚠️ **Educational Project - Simulated Components**:
- **File Uploads**: `fileKeys` are strings, not actual files
- **Inventory**: Simple decrement, no race condition handling
- **Payments**: No real payment processing
- **Email**: No email notifications

### Security Considerations
- All passwords are encrypted with BCrypt
- Use HTTPS in production
- Validate all input on the server side
- JWT secret should be strong and environment-specific
- CORS is configured for localhost development

---

## 📚 Additional Resources

- **Main README**: [../README.md](../README.md)
- **GitHub Repository**: https://github.com/seeudev/CSIT321-G7-glyzier
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Documentation**: https://react.dev/

---

**Last Updated**: October 21, 2025  
**API Version**: 1.0  
**Project**: Glyzier - CSIT321 Group 7
