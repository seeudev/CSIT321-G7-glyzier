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

... (truncated)