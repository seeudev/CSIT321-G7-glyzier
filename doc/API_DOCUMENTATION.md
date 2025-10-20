# Glyzier API Documentation

Base URL: `http://localhost:8080/api`  
Authentication: JWT Bearer Token in Authorization header  
Content-Type: `application/json`

---

## Authentication

### POST /auth/register

Register new user account.

**Authentication**: Not required

**Request**:
```json
{
  "displayname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation**:
- displayname: 3-100 chars, required
- email: valid format, unique, required
- password: min 6 chars, required

**Response 201**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe"
}
```

**Error 400**:
```json
{"error": "Email already exists"}
```

---

### POST /auth/login

Authenticate user and receive JWT token.

**Authentication**: Not required

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response 200**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe"
}
```

**Error 401**:
```json
{"error": "Invalid email or password"}
```

---

## User Management

### GET /users/me

Get current authenticated user.

**Authentication**: Required

**Response 200**:
```json
{
  "userid": 1,
  "email": "john@example.com",
  "displayname": "John Doe",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "isSeller": false
}
```

---

## Seller Management

### POST /sellers/register

Convert user to seller account.

**Authentication**: Required

**Request**:
```json
{
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist."
}
```

**Validation**:
- sellername: 3-100 chars, unique, required
- storebio: max 1000 chars, optional

**Response 201**:
```json
{
  "message": "Successfully registered as a seller",
  "seller": {
    "sid": 1,
    "sellername": "Artisan Gallery",
    "storebio": "Professional digital artist.",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "user": {
      "userid": 1,
      "displayname": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error 400**:
```json
{"error": "User is already a seller"}
```

---

### GET /sellers/{sid}

Get seller information.

**Authentication**: Not required

**Response 200**:
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist.",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "user": {
    "userid": 1,
    "displayname": "John Doe",
    "email": "john@example.com"
  },
  "products": []
}
```

---

### GET /sellers/me

Get own seller profile.

**Authentication**: Required

**Response 200**:
```json
{
  "sid": 1,
  "sellername": "Artisan Gallery",
  "storebio": "Professional digital artist",
  "createdAt": "2025-10-20T12:00:00.000+00:00"
}
```

**Error 404**:
```json
{"error": "User is not a seller"}
```

---

### GET /sellers/check

Check if user is a seller.

**Authentication**: Required

**Response 200**:
```json
{"isSeller": true, "sid": 1}
```

---

## Product Management

### POST /products

Create product (seller only).

**Authentication**: Required (Seller)

**Request**:
```json
{
  "productname": "Sunset Landscape Print",
  "type": "Print",
  "price": 29.99,
  "status": "Available",
  "fileKeys": ["sunset-main.jpg", "sunset-detail1.jpg"]
}
```

**Validation**:
- productname: 3-200 chars, required
- type: required (e.g., "Print", "Digital", "Original")
- price: positive number, required
- status: required (e.g., "Available", "Sold Out")
- fileKeys: optional array of strings (simulated)

**Response 201**:
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
    }
  ],
  "inventory": null
}
```

---

### GET /products

List all products.

**Authentication**: Not required

**Query Parameters**:
- page: default 0
- size: default 20

**Response 200**:
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
    }
  ],
  "pageable": {"pageNumber": 0, "pageSize": 20},
  "totalElements": 1,
  "totalPages": 1
}
```

---

### GET /products/{pid}

Get product details.

**Authentication**: Not required

**Response 200**:
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

---

### PUT /products/{pid}

Update product (owner only).

**Authentication**: Required (Product Owner)

**Request**:
```json
{
  "productname": "Sunset Landscape Print - Limited Edition",
  "type": "Print",
  "price": 39.99,
  "status": "Available",
  "fileKeys": ["sunset-main-hd.jpg"]
}
```

**Response 200**:
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
  "files": []
}
```

**Error 403**:
```json
{"error": "You do not have permission to edit this product"}
```

---

### DELETE /products/{pid}

Delete product (owner only).

**Authentication**: Required (Product Owner)

**Response 200**:
```json
{"message": "Product deleted successfully"}
```

---

### POST /products/{pid}/inventory

Set product inventory (seller only).

**Authentication**: Required (Product Owner)

**Request**:
```json
{"qtyonhand": 50}
```

**Validation**:
- qtyonhand: >= 0, required

**Response 200**:
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

---

### GET /products/seller/{sid}

Get seller's products.

**Authentication**: Not required

**Response 200**:
```json
[
  {
    "pid": 1,
    "productname": "Sunset Landscape Print",
    "type": "Print",
    "price": 29.99,
    "status": "Available",
    "createdAt": "2025-10-20T12:00:00.000+00:00"
  }
]
```

---

## Order Management

### POST /orders/place

Place order (simulated checkout).

**Authentication**: Required

**Request**:
```json
{
  "items": [
    {"pid": 1, "quantity": 2},
    {"pid": 3, "quantity": 1}
  ]
}
```

**Validation**:
- items: min 1 item, required
- pid: must exist, required
- quantity: > 0, required

**Response 201**:
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
      }
    ]
  }
}
```

**Error 400**:
```json
{"error": "Product with ID 99 not found"}
```
```json
{"error": "Insufficient inventory for product: Sunset Landscape Print"}
```

---

### GET /orders/my-history

Get user's order history.

**Authentication**: Required

**Response 200**:
```json
[
  {
    "orderid": 1,
    "total": 94.98,
    "status": "Completed",
    "placedAt": "2025-10-20T16:00:00.000+00:00",
    "itemCount": 2
  }
]
```

---

### GET /orders/{orderid}

Get order details (owner only).

**Authentication**: Required (Order Owner)

**Response 200**:
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
    }
  ]
}
```

**Error 403**:
```json
{"error": "You do not have permission to view this order"}
```

---

## Error Responses

**Format**:
```json
{
  "error": "Error message",
  "timestamp": "2025-10-20T16:00:00.000+00:00",
  "status": 400
}
```

**Status Codes**:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Testing Example

```bash
# Register
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"displayname":"Test Artist","email":"test@artist.com","password":"Test123456"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# Become seller
curl -X POST http://localhost:8080/api/sellers/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sellername":"Test Studio","storebio":"Test bio"}'

# Create product
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productname":"Test Art","type":"Print","price":25.00,"status":"Available","fileKeys":["test.jpg"]}'

# Set inventory
curl -X POST http://localhost:8080/api/products/1/inventory \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"qtyonhand":100}'

# Browse products (no auth)
curl -X GET http://localhost:8080/api/products

# Register buyer
BUYER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"displayname":"Buyer","email":"buyer@test.com","password":"Buyer123456"}')

BUYER_TOKEN=$(echo $BUYER_RESPONSE | jq -r '.token')

# Place order
curl -X POST http://localhost:8080/api/orders/place \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"pid":1,"quantity":2}]}'

# Check order history
curl -X GET http://localhost:8080/api/orders/my-history \
  -H "Authorization: Bearer $BUYER_TOKEN"
```

---

## Notes

**JWT Token**:
- Expires after 24 hours
- Format: `Authorization: Bearer <token>`
- Refresh by logging in again

**Pagination**:
- Default: 20 items per page
- Page numbers start at 0
- Use: `?page=0&size=10`

**Simulated Features**:
- File uploads: fileKeys are strings
- Inventory: simple decrement
- Payments: no real processing

**Security**:
- Passwords: BCrypt encrypted
- Authentication: JWT stateless
- CORS: enabled for localhost
- Validation: all endpoints
- SQL injection: prevented via JPA

---

Last Updated: October 21, 2025  
Project: Glyzier CSIT321-G7
