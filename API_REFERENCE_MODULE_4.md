# API Reference - Module 4: Order Simulation API

## Overview
This module implements simulated order processing functionality for the Glyzier platform. Users can place orders, view their order history, and retrieve detailed order information.

**IMPORTANT**: This is a SIMULATED implementation for a university project:
- No real payment processing
- Simplified inventory management (basic decrement)
- No race condition handling
- Not production-ready

## Authentication
All endpoints in this module require authentication using JWT (JSON Web Token).

Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Place Order (POST /api/orders/place)

**Description**: Allows an authenticated user to place an order for one or more products.

**Authentication**: Required (JWT)

**Request Body**:
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

**Request Fields**:
- `items` (array, required): List of order items
  - `pid` (number, required): Product ID
  - `quantity` (number, required): Quantity to order (must be > 0)

**Process**:
1. Authenticates the user via JWT token
2. Validates all products exist and are available
3. Checks inventory availability for each item
4. Decrements inventory (simulated - no race condition handling)
5. Creates order items with snapshot data (product name, price at time of order)
6. Calculates total order price
7. Creates the main order record
8. Returns complete order details

**Success Response (201 Created)**:
```json
{
  "message": "Order placed successfully",
  "order": {
    "orderid": 1,
    "total": 150.00,
    "status": "Pending",
    "placedAt": "2025-10-20T10:30:00.000+00:00",
    "userid": 2,
    "userDisplayName": "John Doe",
    "items": [
      {
        "opid": 1,
        "pid": 1,
        "productNameSnapshot": "Sunset Landscape Print",
        "unitPrice": 50.00,
        "quantity": 2,
        "lineTotal": 100.00
      },
      {
        "opid": 2,
        "pid": 3,
        "productNameSnapshot": "Abstract Digital Art",
        "unitPrice": 50.00,
        "quantity": 1,
        "lineTotal": 50.00
      }
    ]
  }
}
```

**Error Responses**:

*400 Bad Request* - Validation errors:
```json
{
  "error": "Order must contain at least one item"
}
```
```json
{
  "error": "Quantity must be greater than 0 for product ID: 1"
}
```
```json
{
  "error": "Product not found with ID: 999"
}
```
```json
{
  "error": "Product is not available: Out of Stock Item"
}
```
```json
{
  "error": "Insufficient stock for product: Sunset Landscape. Available: 5, Requested: 10"
}
```

*401 Unauthorized* - Missing or invalid JWT:
```json
{
  "error": "Unauthorized"
}
```

*500 Internal Server Error*:
```json
{
  "error": "An error occurred while placing the order: ..."
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      { "pid": 1, "quantity": 2 },
      { "pid": 3, "quantity": 1 }
    ]
  }'
```

---

### 2. Get My Order History (GET /api/orders/my-history)

**Description**: Retrieves all orders placed by the currently authenticated user, ordered by most recent first.

**Authentication**: Required (JWT)

**Query Parameters**: None

**Success Response (200 OK)**:
```json
[
  {
    "orderid": 3,
    "total": 200.00,
    "status": "Pending",
    "placedAt": "2025-10-20T15:00:00.000+00:00",
    "userid": 2,
    "userDisplayName": "John Doe",
    "items": null
  },
  {
    "orderid": 1,
    "total": 150.00,
    "status": "Completed",
    "placedAt": "2025-10-19T10:30:00.000+00:00",
    "userid": 2,
    "userDisplayName": "John Doe",
    "items": null
  }
]
```

**Note**: The `items` field is `null` in the history list for performance reasons. Use the "Get Order By ID" endpoint to retrieve full order details including items.

**Response Fields**:
- `orderid` (number): Unique order ID
- `total` (number): Total order amount
- `status` (string): Order status (e.g., "Pending", "Completed", "Cancelled")
- `placedAt` (timestamp): When the order was placed
- `userid` (number): ID of the user who placed the order
- `userDisplayName` (string): Display name of the user
- `items` (null): Not included in history list

**Error Responses**:

*401 Unauthorized* - Missing or invalid JWT:
```json
{
  "error": "Unauthorized"
}
```

*404 Not Found* - User not found:
```json
{
  "error": "User not found with email: ..."
}
```

**Example cURL**:
```bash
curl -X GET http://localhost:8080/api/orders/my-history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get Order By ID (GET /api/orders/{orderid})

**Description**: Retrieves complete details of a specific order, including all order items. Verifies that the requesting user owns the order.

**Authentication**: Required (JWT)

**Path Parameters**:
- `orderid` (number, required): The order ID to retrieve

**Success Response (200 OK)**:
```json
{
  "orderid": 1,
  "total": 150.00,
  "status": "Pending",
  "placedAt": "2025-10-20T10:30:00.000+00:00",
  "userid": 2,
  "userDisplayName": "John Doe",
  "items": [
    {
      "opid": 1,
      "pid": 1,
      "productNameSnapshot": "Sunset Landscape Print",
      "unitPrice": 50.00,
      "quantity": 2,
      "lineTotal": 100.00
    },
    {
      "opid": 2,
      "pid": 3,
      "productNameSnapshot": "Abstract Digital Art",
      "unitPrice": 50.00,
      "quantity": 1,
      "lineTotal": 50.00
    }
  ]
}
```

**Response Fields**:
- `orderid` (number): Unique order ID
- `total` (number): Total order amount
- `status` (string): Order status
- `placedAt` (timestamp): When the order was placed
- `userid` (number): ID of the user who placed the order
- `userDisplayName` (string): Display name of the user
- `items` (array): List of order items
  - `opid` (number): Order-product ID
  - `pid` (number): Product ID
  - `productNameSnapshot` (string): Product name at time of order (preserved even if product is renamed)
  - `unitPrice` (number): Unit price at time of order (preserved even if product price changes)
  - `quantity` (number): Quantity ordered
  - `lineTotal` (number): Total for this item (unitPrice × quantity)

**Error Responses**:

*401 Unauthorized* - Missing or invalid JWT:
```json
{
  "error": "Unauthorized"
}
```

*403 Forbidden* - User doesn't own this order:
```json
{
  "error": "You do not have permission to view this order"
}
```

*404 Not Found* - Order doesn't exist:
```json
{
  "error": "Order not found with ID: 999"
}
```

**Example cURL**:
```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Data Models

### PlaceOrderRequest
```json
{
  "items": [OrderItemRequest]
}
```

### OrderItemRequest
```json
{
  "pid": number,
  "quantity": number
}
```

### OrderResponse
```json
{
  "orderid": number,
  "total": number,
  "status": string,
  "placedAt": timestamp,
  "userid": number,
  "userDisplayName": string,
  "items": [OrderProductResponse] | null
}
```

### OrderProductResponse
```json
{
  "opid": number,
  "pid": number,
  "productNameSnapshot": string,
  "unitPrice": number,
  "quantity": number,
  "lineTotal": number
}
```

---

## Business Rules

### Order Placement
1. **Authentication Required**: User must be logged in with valid JWT
2. **Minimum Items**: Order must contain at least one item
3. **Quantity Validation**: Each item quantity must be greater than 0
4. **Product Availability**: Products must exist and have status "Available"
5. **Inventory Check**: Sufficient stock must be available (qtyonhand - qtyreserved >= requested quantity)
6. **Inventory Decrement**: Stock is decremented when order is placed (SIMULATED - no transaction rollback)
7. **Snapshot Data**: Product name and price are captured at order time for historical accuracy
8. **Order Status**: New orders are created with status "Pending"

### Order Retrieval
1. **History Access**: Users can only view their own order history
2. **Detail Access**: Users can only view details of orders they placed
3. **Ownership Verification**: System verifies order ownership before returning data

### Inventory Simulation
**WARNING**: This is a simplified simulation:
- No transaction rollback if order fails after inventory decrement
- No race condition handling (multiple users ordering same product simultaneously)
- No stock reservation during checkout process
- No integration with real payment systems

In a production environment, you would need:
- Pessimistic or optimistic locking
- Stock reservation/release mechanisms
- Transaction management with rollback on failure
- Payment gateway integration with webhook handling

---

## Testing Examples

### Test Case 1: Place Order Successfully
```bash
# Prerequisite: Have JWT token and know product IDs with available stock

curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      { "pid": 1, "quantity": 1 }
    ]
  }'

# Expected: 201 Created with order details
```

### Test Case 2: Order With Insufficient Stock
```bash
# Prerequisite: Product 1 has limited stock (e.g., 5 units)

curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      { "pid": 1, "quantity": 100 }
    ]
  }'

# Expected: 400 Bad Request with "Insufficient stock" error
```

### Test Case 3: Get Order History
```bash
curl -X GET http://localhost:8080/api/orders/my-history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: 200 OK with array of orders (items = null)
```

### Test Case 4: Get Order Details
```bash
# Prerequisite: Know an order ID that belongs to the authenticated user

curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: 200 OK with complete order details including items
```

### Test Case 5: Unauthorized Access
```bash
curl -X GET http://localhost:8080/api/orders/my-history

# Expected: 401 Unauthorized (no token provided)
```

### Test Case 6: Access Other User's Order
```bash
# Prerequisite: Know an order ID that belongs to a different user

curl -X GET http://localhost:8080/api/orders/999 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected: 403 Forbidden or 404 Not Found
```

---

## Implementation Notes

### Key Components

**DTOs (Data Transfer Objects)**:
- `PlaceOrderRequest.java` - Request for placing orders
- `OrderItemRequest.java` - Individual order item in request
- `OrderResponse.java` - Response containing order data
- `OrderProductResponse.java` - Individual order item in response

**Service Layer**:
- `OrderService.java` - Business logic for order processing
  - `placeOrder()` - Simulated order placement
  - `getMyOrderHistory()` - Retrieve user's orders
  - `getOrderById()` - Retrieve specific order with ownership check

**Controller Layer**:
- `OrderController.java` - REST endpoints for order operations
  - Handles authentication extraction
  - Validates requests
  - Returns appropriate HTTP status codes

**Repository Layer**:
- `OrdersRepository.java` - JPA repository for Orders entity
- `OrderProductsRepository.java` - JPA repository for OrderProducts entity

### Snapshot Pattern
Order items use the "snapshot pattern" to preserve historical data:
- `productNameSnapshot` - Product name at order time
- `unitPrice` - Product price at order time

This ensures order history remains accurate even if:
- Product is renamed
- Product price changes
- Product is deleted

### Transaction Handling
The `placeOrder()` method uses `@Transactional` annotation to ensure:
- All database operations succeed or fail together
- Database consistency is maintained

However, the current implementation does NOT handle:
- Payment failure rollback (no payment integration)
- Inventory reservation race conditions
- Concurrent order processing

---

## Future Enhancements (Not Implemented)

### Admin Endpoints
The controller includes commented-out endpoints for future use:
- `GET /api/orders/all` - View all orders (admin only)
- `PUT /api/orders/{orderid}/status` - Update order status

These would require:
- Role-based access control (RBAC)
- Admin user roles
- Proper authorization checks

### Enhanced Features
In a production system, you would add:
- Order cancellation functionality
- Refund processing
- Order tracking/shipment integration
- Email notifications
- Invoice generation
- Order status workflow (Pending → Processing → Shipped → Delivered)
- Seller dashboard for order fulfillment
- Payment gateway integration
- Stock reservation system
- Concurrent order handling

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own orders
3. **Input Validation**: Request data is validated for:
   - Required fields
   - Data types
   - Business rules (e.g., quantity > 0)
4. **SQL Injection**: Protected by JPA/Hibernate parameterized queries
5. **XSS Protection**: JSON responses are sanitized by Spring Boot

---

## Error Handling

The API uses standard HTTP status codes:
- `200 OK` - Successful retrieval
- `201 Created` - Successful order placement
- `400 Bad Request` - Validation errors, business rule violations
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Unexpected server errors

All error responses include a JSON object with an `error` field containing a descriptive message.
