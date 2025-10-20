# 🎨 Glyzier - Artist Portfolio and Store Platform# Glyzier - Artist Portfolio and Store Platform



[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)## Project Overview

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)**Glyzier** is a university final project for CSIT321, designed as an artist portfolio and store platform where artists can showcase and sell their digital and physical artwork.

[![Java](https://img.shields.io/badge/Java-17-red.svg)](https://www.oracle.com/java/)

... (truncated)
**Glyzier** is a full-stack web application that serves as an artist portfolio and e-commerce platform. Artists can showcase their work, manage their stores, and sell digital/physical products. Built as a university final project (CSIT321-G7) with emphasis on clean code, extensive documentation, and educational value.

> ⚠️ **Educational Project Notice**: This is a simulated system for educational purposes. Payment processing, inventory management, and file uploads are simplified simulations, not production-ready implementations.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Development](#-development)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)

---

## ✨ Features

### For Users
- 🔐 **Authentication**: Secure registration and login with JWT tokens
- 🛍️ **Product Browsing**: Browse all available artworks and products
- 🛒 **Order Placement**: Purchase products (simulated checkout)
- 📜 **Order History**: View past orders with detailed information
- 👤 **User Profile**: Manage personal account information

### For Sellers (Artists)
- 🎨 **Seller Registration**: Convert user account to seller/artist profile
- ➕ **Product Management**: Create, update, and delete products
- 📦 **Inventory Control**: Set and manage product inventory (simulated)
- 🖼️ **Product Files**: Attach multiple images/files to products (simulated)
- 📊 **Store Profile**: Custom store name and bio

### System Features
- 🔒 **JWT Authentication**: Stateless, secure token-based authentication
- 🌐 **RESTful API**: Clean, well-documented REST endpoints
- 🗄️ **Relational Database**: Properly normalized MySQL schema
- 📱 **Responsive Frontend**: React-based SPA with React Router
- 🔄 **CORS Enabled**: Frontend-backend communication configured
- 💬 **Extensive Comments**: Every component heavily documented

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Security**: Spring Security + JWT (jjwt 0.11.5)
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Dev Tools**: Spring Boot DevTools

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Language**: JavaScript (ES6+)

### Development
- **Version Control**: Git + GitHub
- **IDE**: VS Code (recommended)
- **Database Tool**: MySQL Workbench / CLI

---

## 📁 Project Structure

```
CSIT321-G7-glyzier/
├── README.md                           # This file
├── .gitignore                          # Git ignore rules
│
├── doc/                                # Documentation
│   └── API_DOCUMENTATION.md            # Complete API reference
│
├── glyzier-backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/glyzier/
│   │   │   │   ├── config/            # Security & App configuration
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   │
│   │   │   │   ├── controller/        # REST API Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── SellerController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   └── OrderController.java
│   │   │   │   │
│   │   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── CreateProductRequest.java
│   │   │   │   │   ├── UpdateProductRequest.java
│   │   │   │   │   ├── SetInventoryRequest.java
│   │   │   │   │   ├── CreateSellerRequest.java
│   │   │   │   │   ├── PlaceOrderRequest.java
│   │   │   │   │   └── OrderItemRequest.java
│   │   │   │   │
│   │   │   │   ├── model/             # JPA Entities
│   │   │   │   │   ├── Users.java
│   │   │   │   │   ├── Seller.java
│   │   │   │   │   ├── Products.java
│   │   │   │   │   ├── ProductFiles.java
│   │   │   │   │   ├── Orders.java
│   │   │   │   │   ├── OrderProducts.java
│   │   │   │   │   └── Inventory.java
│   │   │   │   │
│   │   │   │   ├── repository/        # Spring Data JPA Repositories
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── SellerRepository.java
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   ├── ProductFilesRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   ├── OrderProductsRepository.java
│   │   │   │   │   └── InventoryRepository.java
│   │   │   │   │
│   │   │   │   ├── security/          # JWT & Auth components
│   │   │   │   │   ├── JwtUtil.java
│   │   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   │
│   │   │   │   ├── service/           # Business Logic Services
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── SellerService.java
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   └── OrderService.java
│   │   │   │   │
│   │   │   │   └── glyzier_backend/
│   │   │   │       └── GlyzierApplication.java  # Main Spring Boot App
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties       # Configuration
│   │   │
│   │   └── test/                      # Unit Tests
│   │
│   └── pom.xml                        # Maven dependencies
│
└── glyzier-frontend/                  # React Frontend
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx     # Route guard
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   │
    │   ├── pages/
    │   │   ├── HomePage.jsx           # Product listing
    │   │   ├── LoginPage.jsx          # Login form
    │   │   ├── RegisterPage.jsx       # Registration form
    │   │   └── DashboardPage.jsx      # User dashboard
    │   │
    │   ├── services/
    │   │   ├── api.js                 # Axios instance
    │   │   └── authService.js         # Auth API calls
    │   │
    │   ├── styles/
    │   │   └── common.js              # Shared styles
    │   │
    │   ├── App.jsx                    # Main app component
    │   ├── main.jsx                   # Entry point
    │   └── index.css                  # Global styles
    │
    ├── package.json                   # Node dependencies
    └── vite.config.js                 # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **MySQL 8.0** or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Maven** (or use the included Maven wrapper `./mvnw`)
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/seeudev/CSIT321-G7-glyzier.git
cd CSIT321-G7-glyzier
```

### 2️⃣ Setup Database

1. **Start MySQL Server**:
   ```bash
   sudo systemctl start mysql  # Linux
   # or
   brew services start mysql    # macOS
   ```

2. **Create Database**:
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE glyzier_db;
   EXIT;
   ```

3. **Configure Database Credentials**:
   
   Edit `glyzier-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/glyzier_db
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 3️⃣ Run the Backend

```bash
cd glyzier-backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend will start on **http://localhost:8080**

**Verify backend is running**:
```bash
curl http://localhost:8080/api/auth/login
# Should return: {"error":"Method 'GET' is not supported"}
# (This is expected - the endpoint requires POST)
```

### 4️⃣ Run the Frontend

Open a **new terminal** window:

```bash
cd glyzier-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173**

Open your browser and navigate to: **http://localhost:5173**

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Quick Reference

| Module | Endpoint | Method | Auth | Description |
|--------|----------|--------|------|-------------|
| **Auth** | `/auth/register` | POST | ❌ | Register new user |
| **Auth** | `/auth/login` | POST | ❌ | Login user |
| **User** | `/users/me` | GET | ✅ | Get current user |
| **Seller** | `/sellers/register` | POST | ✅ | Become a seller |
| **Seller** | `/sellers/{sid}` | GET | ❌ | Get seller info |
| **Seller** | `/sellers/me` | GET | ✅ | Get own seller profile |
| **Product** | `/products` | POST | ✅ | Create product (seller only) |
| **Product** | `/products` | GET | ❌ | Get all products |
| **Product** | `/products/{pid}` | GET | ❌ | Get product details |
| **Product** | `/products/{pid}` | PUT | ✅ | Update product (seller only) |
| **Product** | `/products/{pid}` | DELETE | ✅ | Delete product (seller only) |
| **Product** | `/products/{pid}/inventory` | POST | ✅ | Set inventory (seller only) |
| **Product** | `/products/seller/{sid}` | GET | ❌ | Get seller's products |
| **Order** | `/orders/place` | POST | ✅ | Place an order |
| **Order** | `/orders/my-history` | GET | ✅ | Get order history |
| **Order** | `/orders/{orderid}` | GET | ✅ | Get order details |

📖 **Complete API Documentation**: See [`doc/API_DOCUMENTATION.md`](./doc/API_DOCUMENTATION.md) for detailed request/response examples, validation rules, and error codes.

---

## 🗄️ Database Schema

### Entity Relationship Diagram (ERD)

```
Users (1) -------- (0..1) Seller
  |                         |
  |                         |
  | (1)                    | (1)
  |                         |
  | (N)                    | (N)
  |                         |
Orders                   Products (1) --- (1) Inventory
  |                         |
  | (1)                    | (1)
  |                         |
  | (N)                    | (N)
  |                         |
Order_Products -----------+
  
Products (1) -------- (N) ProductFiles
```

### Key Entities

#### Users
- **Primary Key**: `userid` (BIGINT)
- **Attributes**: email, displayname, password, created_at
- **Relationships**: 
  - May own one Seller (1:1)
  - Places many Orders (1:N)

#### Seller
- **Primary Key**: `sid` (BIGINT)
- **Foreign Key**: `userid` → Users
- **Attributes**: sellername, storebio, created_at
- **Relationships**:
  - Belongs to one User (1:1)
  - Offers many Products (1:N)

#### Products
- **Primary Key**: `pid` (BIGINT)
- **Foreign Key**: `sid` → Seller
- **Attributes**: productname, type, price, status, created_at
- **Relationships**:
  - Belongs to one Seller (N:1)
  - Has one Inventory (1:1)
  - Has many ProductFiles (1:N)
  - Referenced in many Order_Products (1:N)

#### Orders
- **Primary Key**: `orderid` (BIGINT)
- **Foreign Key**: `userid` → Users
- **Attributes**: total, status, placed_at
- **Relationships**:
  - Placed by one User (N:1)
  - Contains many Order_Products (1:N)

#### Order_Products (Join Table)
- **Primary Key**: `opid` (BIGINT)
- **Foreign Keys**: 
  - `orderid` → Orders
  - `pid` → Products
- **Attributes**: product_name_snapshot, unit_price, quantity
- **Purpose**: Links Orders to Products with snapshot data

#### Inventory
- **Primary Key**: `invid` (BIGINT)
- **Foreign Key**: `pid` → Products
- **Attributes**: qtyonhand, qtyreserved, updated_at
- **Relationships**: Belongs to one Product (1:1)

#### ProductFiles
- **Primary Key**: `pfileid` (BIGINT)
- **Foreign Key**: `pid` → Products
- **Attributes**: file_key, file_type, file_format, created_at
- **Relationships**: Belongs to one Product (N:1)

---

## 🔒 Security

### Authentication Flow

1. **User Registration** → Password encrypted with BCrypt → Stored in database
2. **User Login** → Credentials validated → JWT token generated
3. **Protected Request** → Token sent in header → Validated by JwtAuthFilter → Request processed

### Security Features

- ✅ **BCrypt Password Encryption**: All passwords hashed with strong algorithm
- ✅ **JWT Tokens**: Stateless authentication, 24-hour expiration
- ✅ **CORS Configuration**: Frontend allowed to access backend
- ✅ **Stateless Sessions**: No server-side session storage
- ✅ **Role-Based Access**: Sellers can only modify their own products
- ✅ **SQL Injection Prevention**: JPA parameterized queries
- ✅ **Input Validation**: Request DTOs validated with Spring Validation

### Security Configuration

**JWT Settings** (`application.properties`):
```properties
jwt.secret=glyzierSecretKey2024ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation
jwt.expiration=86400000  # 24 hours in milliseconds
```

**Public Endpoints** (No authentication required):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products/**`
- `GET /api/sellers/**`

**Protected Endpoints** (JWT required):
- All other `/api/**` endpoints

---

## 💻 Development

### Backend Development

#### Running Tests
```bash
cd glyzier-backend
./mvnw test
```

#### Build JAR
```bash
./mvnw clean package
java -jar target/glyzier-backend-0.0.1-SNAPSHOT.jar
```

#### View Database Tables
```bash
mysql -u YOUR_USERNAME -p glyzier_db
```
```sql
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
```

### Frontend Development

#### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Environment Configuration
Create `.env` in `glyzier-frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

Update `src/services/api.js` to use environment variable:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});
```

---

## 🧪 Testing

### Manual Testing with cURL

#### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayname": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Save the JWT token from the response!**

#### Get Current User
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Become a Seller
```bash
curl -X POST http://localhost:8080/api/sellers/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "sellername": "Art Studio",
    "storebio": "Professional digital artist"
  }'
```

### Frontend Testing

1. **Register a new account** → Check browser console for API calls
2. **Login** → Verify token stored in localStorage
3. **Browse products** → Public access should work
4. **Try protected routes** → Should redirect to login when not authenticated

---

## 🔧 Troubleshooting

### Backend Issues

#### MySQL Connection Failed
```
Error: Communications link failure
```
**Solution**:
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `application.properties`
- Test connection: `mysql -u USERNAME -p`

#### Port 8080 Already in Use
```
Error: Port 8080 is already in use
```
**Solution**:
```bash
# Find process using port 8080
lsof -ti:8080

# Kill the process
kill -9 $(lsof -ti:8080)

# Or change port in application.properties
server.port=8081
```

#### JWT Token Invalid
```
Error: 401 Unauthorized
```
**Solution**:
- Check token format: `Bearer <token>` (note the space)
- Verify token hasn't expired (24 hour limit)
- Login again to get a fresh token

### Frontend Issues

#### CORS Error
```
Error: CORS policy: No 'Access-Control-Allow-Origin' header
```
**Solution**:
- Verify backend `SecurityConfig.java` includes your frontend URL
- Check frontend is running on port 5173 or 3000
- Clear browser cache

#### API Calls Failing
```
Error: Network Error
```
**Solution**:
- Verify backend is running on `http://localhost:8080`
- Check `baseURL` in `src/services/api.js`
- Inspect browser DevTools Network tab

#### npm install Fails
```
Error: Cannot find module
```
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 🎓 Educational Notes

This project was built following a structured, module-based approach for educational purposes:

- ✅ **Module 0**: Project setup and database configuration
- ✅ **Module 1**: JPA entities and relationships (ERD implementation)
- ✅ **Module 2**: Authentication & JWT security
- ✅ **Module 3**: Seller & Product management
- ✅ **Module 4**: Order processing simulation
- ✅ **Module 5**: React frontend setup
- ✅ **Module 6**: Frontend authentication & pages

### Key Learning Objectives

1. **Full-Stack Development**: Experience building both backend and frontend
2. **RESTful API Design**: Proper HTTP methods, status codes, and response formats
3. **Database Design**: Normalized schema with proper relationships
4. **Security**: JWT authentication, password encryption, CORS
5. **Modern Frameworks**: Spring Boot and React ecosystem
6. **Git Workflow**: Proper commits, branching, and version control
7. **Code Documentation**: Extensive comments for educational clarity

### Simulation Notes

⚠️ **Not Production-Ready**:
- Payment processing is simulated (no real transactions)
- File uploads use string keys (no actual S3/storage integration)
- Inventory management is simplified (no race condition handling)
- No email verification or password reset
- No rate limiting or advanced security measures
- No automated testing or CI/CD

---

## 👥 Contributors

**CSIT321 - Group 7**

- **Project**: Glyzier - Artist Portfolio and Store
- **Institution**: University Project
- **Course**: CSIT321
- **Year**: 2025

---

## 📄 License

This is a university educational project. All rights reserved by CSIT321-G7 team.

---

## 📞 Support

For questions or issues related to this project:

1. Check the [API Documentation](./doc/API_DOCUMENTATION.md)
2. Review the [Troubleshooting](#-troubleshooting) section
3. Check the commit history for implementation details
4. Contact the development team

---

## 🎯 Project Status

**Current Status**: ✅ Modules 0-6 Complete

**Implemented Features**:
- ✅ User registration and authentication
- ✅ Seller registration and management
- ✅ Product CRUD operations
- ✅ Inventory management
- ✅ Order placement and history
- ✅ React frontend with authentication
- ✅ Protected routes and user dashboard

**Future Enhancements** (Not in scope for this project):
- Product search and filtering
- Seller dashboard with analytics
- Product reviews and ratings
- Shopping cart functionality
- Advanced order management
- Real file upload system
- Payment gateway integration
- Email notifications

---

**Built with ❤️ for CSIT321 - Group 7**
