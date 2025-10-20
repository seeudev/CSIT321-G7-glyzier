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

... (truncated for brevity)