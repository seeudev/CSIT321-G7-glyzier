# Module 3 - Seller & Product API Reference

This document provides a comprehensive reference for the Seller and Product API endpoints implemented in Module 3.

## Table of Contents
- [Overview](#overview)
- [Seller Endpoints](#seller-endpoints)
- [Product Endpoints](#product-endpoints)
- [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
- [Testing Examples](#testing-examples)

---

## Overview

Module 3 implements the core functionality for sellers and products in the Glyzier platform:

- **Sellers**: Users can become sellers and create their own stores
- **Products**: Sellers can create, update, delete, and manage inventory for their products
- **Public Access**: Anyone can browse products and seller profiles (no authentication required)
- **Seller Access**: Only authenticated sellers can manage their own products

### Authentication
- Protected endpoints require a valid JWT token in the `Authorization` header
- Format: `Authorization: Bearer <your-jwt-token>`
- Get your token from the `/api/auth/login` endpoint (Module 2)

---

## Seller Endpoints

### 1. Register as Seller (Become a Seller)

**Endpoint:** `POST /api/sellers/register`  
**Authentication:** Required  
**Description:** Convert your user account into a seller account

**Request Body:**
```json
{
  "sellername": "Artisan Gallery",
  "storebio": "Professional artist specializing in digital art and prints. Creating unique pieces since 2020."
}
```

**Validation Rules:**
- `sellername`: Required, 3-100 characters, must be unique
- `storebio`: Optional, max 1000 characters

**Success Response (201 Created):**
```json
{
  "message": "Successfully registered as a seller",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery",
    "storebio": "Professional artist specializing in digital art and prints. Creating unique pieces since 2020.",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "user": {
      "userid": 1,
      "displayname": "John Artist",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- **400 Bad Request** - User already a seller or sellername taken
- **401 Unauthorized** - No valid JWT token provided

---

### 2. Get Seller by ID

**Endpoint:** `GET /api/sellers/{sid}`  
**Authentication:** Not Required (Public)  
**Description:** Get information about a specific seller

**URL Parameters:**
- `sid` (Long) - The seller ID

**Success Response (200 OK):**
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional artist specializing in digital art and prints.",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "user": {
    "userid": 1,
    "displayname": "John Artist",
    "email": "john@example.com"
  },
  "products": []
}
```

**Error Responses:**
- **404 Not Found** - Seller not found

---

### 3. Get My Seller Profile

**Endpoint:** `GET /api/sellers/me`  
**Authentication:** Required  
**Description:** Get the seller profile for the currently authenticated user

**Success Response (200 OK):**
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional artist specializing in digital art and prints.",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "user": {
    "userid": 1,
    "displayname": "John Artist",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- **401 Unauthorized** - No valid JWT token provided
- **404 Not Found** - User is not a seller

---

### 4. Check Seller Status

**Endpoint:** `GET /api/sellers/check`  
**Authentication:** Required  
**Description:** Check if the currently authenticated user is a seller

**Success Response (200 OK):**
```json
{
  "isSeller": true
}
```

**Error Responses:**
- **401 Unauthorized** - No valid JWT token provided

---

## Product Endpoints

### 1. Create Product

**Endpoint:** `POST /api/products`  
**Authentication:** Required (Seller only)  
**Description:** Create a new product

**Request Body:**
```json
{
  "productname": "Sunset Digital Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "fileKeys": ["image1.jpg", "image2.jpg", "preview.jpg"]
}
```

**Validation Rules:**
- `productname`: Required, 3-200 characters
- `type`: Optional, max 50 characters
- `price`: Required, positive number with max 2 decimal places
- `status`: Optional, max 50 characters, defaults to "Available"
- `fileKeys`: Optional, list of simulated file keys

**Success Response (201 Created):**
```json
{
  "message": "Product created successfully",
  "product": {
    "pid": 1,
    "productname": "Sunset Digital Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "sellerId": 1,
    "sellerName": "Artisan Gallery",
    "qtyonhand": 0,
    "availableQuantity": 0,
    "inStock": false,
    "files": [
      {
        "pfileid": 1,
        "fileKey": "image1.jpg",
        "fileType": "product_image",
        "fileFormat": "jpg"
      },
      {
        "pfileid": 2,
        "fileKey": "image2.jpg",
        "fileType": "product_image",
        "fileFormat": "jpg"
      }
    ]
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation error or user is not a seller
- **401 Unauthorized** - No valid JWT token provided

---

### 2. Update Product

**Endpoint:** `PUT /api/products/{pid}`  
**Authentication:** Required (Seller must own the product)  
**Description:** Update an existing product

**URL Parameters:**
- `pid` (Long) - The product ID

**Request Body:** (Same as Create Product)

**Success Response (200 OK):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "pid": 1,
    "productname": "Sunset Digital Print - Updated",
    "type": "Print",
    "price": 34.99,
    "status": "Available",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "sellerId": 1,
    "sellerName": "Artisan Gallery",
    "qtyonhand": 10,
    "availableQuantity": 10,
    "inStock": true,
    "files": []
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation error or product not found
- **401 Unauthorized** - No valid JWT token provided
- **403 Forbidden** - Seller doesn't own this product

---

### 3. Delete Product

**Endpoint:** `DELETE /api/products/{pid}`  
**Authentication:** Required (Seller must own the product)  
**Description:** Delete a product and its associated files and inventory

**URL Parameters:**
- `pid` (Long) - The product ID

**Success Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- **400 Bad Request** - Product not found
- **401 Unauthorized** - No valid JWT token provided
- **403 Forbidden** - Seller doesn't own this product

---

### 4. Set Product Inventory

**Endpoint:** `POST /api/products/{pid}/inventory`  
**Authentication:** Required (Seller must own the product)  
**Description:** Set or update the inventory quantity for a product (simulated)

**URL Parameters:**
- `pid` (Long) - The product ID

**Request Body:**
```json
{
  "qtyonhand": 50
}
```

**Validation Rules:**
- `qtyonhand`: Required, non-negative integer

**Success Response (200 OK):**
```json
{
  "message": "Inventory updated successfully",
  "product": {
    "pid": 1,
    "productname": "Sunset Digital Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "qtyonhand": 50,
    "availableQuantity": 50,
    "inStock": true,
    "sellerId": 1,
    "sellerName": "Artisan Gallery",
    "files": []
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation error or product not found
- **401 Unauthorized** - No valid JWT token provided
- **403 Forbidden** - Seller doesn't own this product

---

### 5. Get All Products (Paginated)

**Endpoint:** `GET /api/products`  
**Authentication:** Not Required (Public)  
**Description:** Get a paginated list of all products

**Query Parameters:**
- `page` (int) - Page number, 0-indexed (default: 0)
- `size` (int) - Items per page (default: 20)

**Example Request:**
```
GET /api/products?page=0&size=10
```

**Success Response (200 OK):**
```json
{
  "content": [
    {
      "pid": 1,
      "productname": "Sunset Digital Print",
      "type": "Print",
      "price": 29.99,
      "status": "Available",
      "sellerId": 1,
      "sellerName": "Artisan Gallery",
      "qtyonhand": 50,
      "availableQuantity": 50,
      "inStock": true,
      "files": []
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true
}
```

---

### 6. Get Product by ID

**Endpoint:** `GET /api/products/{pid}`  
**Authentication:** Not Required (Public)  
**Description:** Get detailed information about a specific product

**URL Parameters:**
- `pid` (Long) - The product ID

**Success Response (200 OK):**
```json
{
  "pid": 1,
  "productname": "Sunset Digital Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "sellerId": 1,
  "sellerName": "Artisan Gallery",
  "qtyonhand": 50,
  "availableQuantity": 50,
  "inStock": true,
  "files": [
    {
      "pfileid": 1,
      "fileKey": "image1.jpg",
      "fileType": "product_image",
      "fileFormat": "jpg"
    }
  ]
}
```

**Error Responses:**
- **404 Not Found** - Product not found

---

### 7. Get Products by Seller

**Endpoint:** `GET /api/products/seller/{sid}`  
**Authentication:** Not Required (Public)  
**Description:** Get all products offered by a specific seller

**URL Parameters:**
- `sid` (Long) - The seller ID

**Success Response (200 OK):**
```json
[
  {
    "pid": 1,
    "productname": "Sunset Digital Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "sellerId": 1,
    "sellerName": "Artisan Gallery",
    "qtyonhand": 50,
    "availableQuantity": 50,
    "inStock": true,
    "files": []
  },
  {
    "pid": 2,
    "productname": "Ocean Landscape",
    "type": "Print",
    "price": 39.99,
    "status": "Available",
    "sellerId": 1,
    "sellerName": "Artisan Gallery",
    "qtyonhand": 25,
    "availableQuantity": 25,
    "inStock": true,
    "files": []
  }
]
```

**Error Responses:**
- **404 Not Found** - Seller not found

---

## Data Transfer Objects (DTOs)

### SellerRegistrationRequest
```java
{
  "sellername": String (required, 3-100 chars),
  "storebio": String (optional, max 1000 chars)
}
```

### ProductRequest
```java
{
  "productname": String (required, 3-200 chars),
  "type": String (optional, max 50 chars),
  "price": BigDecimal (required, positive),
  "status": String (optional, max 50 chars),
  "fileKeys": List<String> (optional)
}
```

### InventoryRequest
```java
{
  "qtyonhand": Integer (required, non-negative)
}
```

### ProductResponse
```java
{
  "pid": Long,
  "productname": String,
  "type": String,
  "price": BigDecimal,
  "status": String,
  "createdAt": Timestamp,
  "sellerId": Long,
  "sellerName": String,
  "qtyonhand": Integer,
  "availableQuantity": Integer,
  "inStock": Boolean,
  "files": List<ProductFileInfo>
}
```

### ProductFileInfo (nested in ProductResponse)
```java
{
  "pfileid": Long,
  "fileKey": String,
  "fileType": String,
  "fileFormat": String
}
```

---

## Testing Examples

### Example 1: Complete Seller Registration and Product Creation Flow

```bash
# Step 1: Login as a user (from Module 2)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Response will include a JWT token - save it
# TOKEN="eyJhbGc..."

# Step 2: Register as a seller
curl -X POST http://localhost:8080/api/sellers/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sellername": "Artisan Gallery",
    "storebio": "Professional digital artist"
  }'

# Step 3: Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productname": "Sunset Digital Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "fileKeys": ["sunset-main.jpg", "sunset-preview.jpg"]
  }'

# Step 4: Set inventory for the product (use PID from previous response)
curl -X POST http://localhost:8080/api/products/1/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "qtyonhand": 50
  }'
```

### Example 2: Browse Products (Public Access)

```bash
# Get all products (paginated)
curl http://localhost:8080/api/products?page=0&size=10

# Get a specific product
curl http://localhost:8080/api/products/1

# Get all products by a seller
curl http://localhost:8080/api/products/seller/1

# Get seller information
curl http://localhost:8080/api/sellers/1
```

### Example 3: Update and Delete Product

```bash
# Update a product
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productname": "Sunset Digital Print - Limited Edition",
    "type": "Print",
    "price": 39.99,
    "status": "Available",
    "fileKeys": ["sunset-limited.jpg"]
  }'

# Delete a product
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes

### File Upload Simulation
- In this university project, file uploads are **simulated**
- The `fileKeys` field accepts a list of strings representing file names
- In a real system, you would:
  - Use multipart/form-data for file uploads
  - Store files in cloud storage (e.g., AWS S3)
  - Store the S3 key or file path in the ProductFiles table

### Inventory Management
- Inventory is **simplified** for this project
- We only track `qtyonhand` (quantity on hand)
- In a real system, you would implement:
  - Stock reservations during checkout
  - Race condition handling (optimistic locking)
  - Warehouse locations
  - Automatic reordering
  - Stock alerts

### Security
- Public endpoints allow GET requests without authentication
- All modification endpoints (POST, PUT, DELETE) require authentication
- Sellers can only modify their own products (ownership validation)
- JWT tokens expire after 24 hours (configurable)

---

**Module 3 Complete!** 🎉

Next: Module 4 - Order Simulation API
