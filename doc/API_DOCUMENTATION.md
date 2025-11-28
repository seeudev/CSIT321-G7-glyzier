# Glyzier API Documentation

Base URL: `http://localhost:8080/api`  
Authentication: JWT Bearer Token in Authorization header  
Content-Type: `application/json`

**Modules Implemented**: 
- Module 1-2: Authentication & User Management
- Module 3-5: Seller Management
- Module 7: Products & Inventory
- Module 8: Orders
- Module 9: Shopping Cart
- Module 10: Favorites/Wishlist
- Module 11: Basic Search & Filter
- Module 12: Simple Checkout
- Module 13: Seller Order Management
- **Module 14: Basic User Profile** ⭐ NEW

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
  "phonenumber": "+1 234 567 8900",
  "createdAt": "2025-10-20T12:00:00.000+00:00",
  "isSeller": false
}
```

---

### PUT /users/profile

Update user profile information (Module 14).

**Authentication**: Required

**Request**:
```json
{
  "displayname": "Jane Doe",
  "phonenumber": "+1 234 567 8900"
}
```

**Validation**:
- displayname: 2-100 chars, required
- phonenumber: 10-20 chars, optional, numbers/spaces/+/- only

**Response 200**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "userid": 1,
    "email": "john@example.com",
    "displayname": "Jane Doe",
    "phonenumber": "+1 234 567 8900",
    "createdAt": "2025-10-20T12:00:00.000+00:00",
    "isSeller": false
  }
}
```

**Error 400**:
```json
{
  "error": "Display name is required"
}
```

---

### PUT /users/change-password

Change user password (Module 14).

**Authentication**: Required

**Request**:
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456",
  "confirmPassword": "newpass456"
}
```

**Validation**:
- currentPassword: required
- newPassword: min 8 chars, required
- confirmPassword: must match newPassword, required

**Response 200**:
```json
{
  "message": "Password changed successfully"
}
```

**Error 400 (wrong current password)**:
```json
{
  "error": "Current password is incorrect"
}
```

**Error 400 (passwords don't match)**:
```json
{
  "error": "New password and confirmation do not match"
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

### GET /products/search ⭐ NEW (Module 11)

Search products by name and optionally filter by category.

**Authentication**: Not required

**Query Parameters**:
- query: Search string (required) - searches product name using LIKE pattern (case-insensitive)
- category: Product type/category (optional) - filters results by type

**Examples**:
- `/products/search?query=abstract`
- `/products/search?query=painting&category=Print`
- `/products/search?query=landscape&category=Original`

**Response 200**:
```json
{
  "products": [
    {
      "pid": 1,
      "productname": "Abstract Sunset Print",
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
      "pid": 3,
      "productname": "Abstract Expressionism Original",
      "type": "Original",
      "price": 299.99,
      "status": "Available",
      "createdAt": "2025-10-22T14:30:00.000+00:00",
      "seller": {
        "sid": 2,
        "sellername": "Modern Art Collective"
      }
    }
  ],
  "count": 2,
  "query": "abstract"
}
```

**Response with Category Filter**:
```json
{
  "products": [
    {
      "pid": 1,
      "productname": "Abstract Sunset Print",
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
  "count": 1,
  "query": "abstract",
  "category": "Print"
}
```

**Error 400**:
```json
{"error": "Search query cannot be empty"}
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

### GET /orders/seller/my-orders

Get orders containing seller's products. **(Module 13: Seller Order Management)**

**Authentication**: Required (Seller only)

**Description**: Returns all orders that contain at least one product belonging to the authenticated seller. Each order's items list is filtered to show only the seller's products.

**Response 200**:
```json
[
  {
    "orderid": 5,
    "total": 150.00,
    "status": "Pending",
    "placedAt": "2024-11-28T14:30:00Z",
    "userid": 3,
    "userDisplayName": "John Buyer",
    "deliveryAddress": "John Buyer\n123 Main St\nManila, 1000\nPhone: 09123456789",
    "items": [
      {
        "opid": 10,
        "pid": 7,
        "productNameSnapshot": "Sunset Painting",
        "unitPrice": 75.00,
        "quantity": 2,
        "lineTotal": 150.00
      }
    ]
  }
]
```

**Error 404**:
```json
{"error": "User is not a seller"}
```

---

### PUT /orders/{orderid}/status

Update order status. **(Module 13: Seller Order Management)**

**Authentication**: Required (Seller only - must own at least one product in order)

**Path Parameters**:
- `orderid` (number): Order ID to update

**Request**:
```json
{
  "status": "Shipped"
}
```

**Valid Status Values**:
- `Pending` → `Processing` or `Cancelled`
- `Processing` → `Shipped` or `Cancelled`
- `Shipped` → `Delivered`
- `Delivered` → (terminal state, no transitions)
- `Cancelled` → (terminal state, no transitions)

**Response 200**:
```json
{
  "message": "Order status updated successfully",
  "order": {
    "orderid": 5,
    "total": 150.00,
    "status": "Shipped",
    "placedAt": "2024-11-28T14:30:00Z",
    "userid": 3,
    "userDisplayName": "John Buyer",
    "deliveryAddress": "John Buyer\n123 Main St\nManila, 1000\nPhone: 09123456789",
    "items": [
      {
        "opid": 10,
        "pid": 7,
        "productNameSnapshot": "Sunset Painting",
        "unitPrice": 75.00,
        "quantity": 2,
        "lineTotal": 150.00
      }
    ]
  }
}
```

**Error 400**:
```json
{"error": "Status is required"}
```
```json
{"error": "Invalid status. Valid values are: Pending, Processing, Shipped, Delivered, Cancelled"}
```

**Error 403**:
```json
{"error": "You do not have permission to update this order - none of your products are in this order"}
```
```json
{"error": "User is not a seller"}
```

**Error 404**:
```json
{"error": "Order not found with ID: 99"}
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

# MODULE 9: SHOPPING CART

# Add product to cart
curl -X POST http://localhost:8080/api/cart/add \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pid":1,"quantity":2}'

# View cart
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer $BUYER_TOKEN"

# Update cart item quantity
curl -X PUT http://localhost:8080/api/cart/update/1 \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'

# Remove item from cart
curl -X DELETE http://localhost:8080/api/cart/remove/1 \
  -H "Authorization: Bearer $BUYER_TOKEN"

# Get cart item count (for badge)
curl -X GET http://localhost:8080/api/cart/count \
  -H "Authorization: Bearer $BUYER_TOKEN"

# Place order from cart
curl -X POST http://localhost:8080/api/orders/place-from-cart \
  -H "Authorization: Bearer $BUYER_TOKEN"

# Clear cart
curl -X DELETE http://localhost:8080/api/cart/clear \
  -H "Authorization: Bearer $BUYER_TOKEN"

# MODULE 13: SELLER ORDER MANAGEMENT

# Get seller's orders (containing seller's products)
curl -X GET http://localhost:8080/api/orders/seller/my-orders \
  -H "Authorization: Bearer $SELLER_TOKEN"

# Update order status (seller only)
curl -X PUT http://localhost:8080/api/orders/5/status \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Shipped"}'
```

---

## Module 9: Shopping Cart

### GET /cart

Get current user's shopping cart.

**Authentication**: Required

**Response 200**:
```json
{
  "cartid": 1,
  "userid": 2,
  "items": [
    {
      "cartItemid": 1,
      "pid": 1,
      "productname": "Sunset Painting",
      "type": "Print",
      "status": "Available",
      "sellerId": 1,
      "sellerName": "Art Studio",
      "quantity": 2,
      "priceSnapshot": 25.00,
      "currentPrice": 25.00,
      "lineTotal": 50.00,
      "availableStock": 98
    }
  ],
  "totalItemCount": 2,
  "totalPrice": 50.00
}
```

---

### POST /cart/add

Add product to cart or increase quantity if already exists.

**Authentication**: Required

**Request**:
```json
{
  "pid": 1,
  "quantity": 2
}
```

**Validation**:
- pid: required
- quantity: min 1, required

**Response 200**:
```json
{
  "message": "Product added to cart successfully",
  "cart": { /* CartResponse */ }
}
```

**Error 400**:
```json
{
  "error": "Insufficient stock for product: Sunset Painting. Available: 5, Requested: 10"
}
```

---

### PUT /cart/update/{pid}

Update quantity of a cart item.

**Authentication**: Required

**Path Parameters**:
- pid: Product ID to update

**Request**:
```json
{
  "quantity": 3
}
```

**Validation**:
- quantity: min 1, required

**Response 200**:
```json
{
  "message": "Cart item updated successfully",
  "cart": { /* CartResponse */ }
}
```

**Error 400**:
```json
{
  "error": "Product not found in cart"
}
```

---

### DELETE /cart/remove/{pid}

Remove a product from the cart.

**Authentication**: Required

**Path Parameters**:
- pid: Product ID to remove

**Response 200**:
```json
{
  "message": "Product removed from cart successfully",
  "cart": { /* CartResponse */ }
}
```

**Error 404**:
```json
{
  "error": "Product not found in cart"
}
```

---

### DELETE /cart/clear

Remove all items from the cart.

**Authentication**: Required

**Response 200**:
```json
{
  "message": "Cart cleared successfully",
  "cart": {
    "cartid": 1,
    "userid": 2,
    "items": [],
    "totalItemCount": 0,
    "totalPrice": 0.00
  }
}
```

---

### GET /cart/count

Get total item count for cart badge.

**Authentication**: Required

**Response 200**:
```json
{
  "count": 5
}
```

Returns 0 if cart is empty or on error.

---

### POST /orders/place-from-cart

Place order from all items in cart with delivery address and payment simulation. Cart is cleared after successful order. **(Module 12: Checkout)**

**Authentication**: Required

**Request**:
```json
{
  "address": "John Doe\n123 Main St, Building A, Unit 4B\nManila, 1000\nPhone: 09123456789",
  "cardNumber": "1234567812345678"
}
```

**Validation**:
- `address`: Required, delivery address string (multiline format)
- `cardNumber`: Required, exactly 16 digits (simulated payment)

**Response 201**:
```json
{
  "message": "Order placed successfully from cart",
  "order": {
    "orderid": 1,
    "total": 75.00,
    "status": "Pending",
    "placedAt": "2024-11-13T14:30:00Z",
    "deliveryAddress": "John Doe\n123 Main St, Building A, Unit 4B\nManila, 1000\nPhone: 09123456789",
    "items": [
      {
        "pid": 1,
        "productNameSnapshot": "Sunset Painting",
        "unitPrice": 25.00,
        "quantity": 3,
        "lineTotal": 75.00
      }
    ]
  }
}
```

**Error 400**:
```json
{
  "error": "Cart is empty"
}
```

**Error 400** (Validation):
```json
{
  "error": "Delivery address is required"
}
```

---

## Favorites

### GET /favorites

Get all favorited products for authenticated user.

**Authentication**: Required

**Response 200**:
```json
[
  {
    "favid": 1,
    "pid": 5,
    "productname": "Abstract Eye",
    "productdesc": "A vibrant abstract painting...",
    "price": 45.00,
    "category": "Graphical",
    "type": "Digital",
    "status": "Available",
    "screenshotPreviewUrl": "https://...",
    "sellerName": "ArtShop",
    "sellerId": 3,
    "favoritedAt": "2024-11-13T10:30:00Z"
  }
]
```

---

### POST /favorites/{pid}

Add product to favorites (idempotent operation).

**Authentication**: Required

**Path Parameters**:
- `pid` (number): Product ID to favorite

**Response 201**:
```json
{
  "message": "Product added to favorites",
  "favorite": {
    "favid": 1,
    "pid": 5,
    "productname": "Abstract Eye",
    "price": 45.00,
    "favoritedAt": "2024-11-13T10:30:00Z"
  }
}
```

**Error 400**:
```json
{"error": "Product not found with ID: 5"}
```

---

### DELETE /favorites/{pid}

Remove product from favorites.

**Authentication**: Required

**Path Parameters**:
- `pid` (number): Product ID to unfavorite

**Response 200**:
```json
{"message": "Product removed from favorites"}
```

---

### GET /favorites/check/{pid}

Check if product is favorited by user.

**Authentication**: Required

**Path Parameters**:
- `pid` (number): Product ID to check

**Response 200**:
```json
{
  "isFavorited": true,
  "productId": 5
}
```

---

### GET /favorites/count

Get total count of user's favorites.

**Authentication**: Required

**Response 200**:
```json
{"count": 12}
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

Last Updated: November 28, 2025 (Module 13: Seller Order Management)  
Project: Glyzier CSIT321-G7
