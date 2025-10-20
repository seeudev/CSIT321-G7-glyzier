# Glyzier# Glyzier# Glyzier - Artist Portfolio and Store Platform# 🎨 Glyzier - Artist Portfolio and Store Platform# Glyzier - Artist Portfolio and Store Platform



Artist portfolio and e-commerce platform for selling digital and physical artwork. Built with Spring Boot, React, and MySQL.



**Note**: Educational project with simulated payment, inventory, and file upload systems.Artist portfolio and e-commerce platform for selling digital/physical artwork. Built with Spring Boot, React, and MySQL.



## Technology Stack



**Backend****Note**: Educational project with simulated payment, inventory, and file upload.Full-stack web application for artists to showcase and sell their work. Built as CSIT321-G7 university final project.

- Spring Boot 3.5.6

- Java 17

- Spring Security + JWT (jjwt 0.11.5)

- MySQL 8.0## Technology Stack

- Spring Data JPA / Hibernate

- Maven



**Frontend****Backend****Note**: Educational project with simulated payment processing, inventory management, and file uploads.[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)## Project Overview

- React 19.1.1

- Vite 7.1.7- Spring Boot 3.5.6

- React Router DOM 7.9.4

- Axios 1.12.2- Java 17



## Setup & Run Instructions- Spring Security + JWT (jjwt 0.11.5)



### Prerequisites- MySQL 8.0---[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)



- Java 17+- Spring Data JPA / Hibernate

- MySQL 8.0+

- Node.js 18+- Maven

- Maven



### 1. Database Setup

**Frontend**## Project Information[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)**Glyzier** is a university final project for CSIT321, designed as an artist portfolio and store platform where artists can showcase and sell their digital and physical artwork.

Start MySQL and create database:

- React 19.1.1

```sql

CREATE DATABASE glyzier_db;- Vite 7.1.7

```

- React Router DOM 7.9.4

Configure credentials in `glyzier-backend/src/main/resources/application.properties`:

- Axios 1.12.2**Course**: CSIT321  [![Java](https://img.shields.io/badge/Java-17-red.svg)](https://www.oracle.com/java/)

```properties

spring.datasource.url=jdbc:mysql://localhost:3306/glyzier_db

spring.datasource.username=YOUR_USERNAME

spring.datasource.password=YOUR_PASSWORD## Setup & Run Instructions**Group**: G7  

```



### 2. Run Backend

### Prerequisites**Institution**: [Institution Name]  ... (truncated)

```bash

cd glyzier-backend

./mvnw clean install

./mvnw spring-boot:run- Java 17+**Year**: 2025**Glyzier** is a full-stack web application that serves as an artist portfolio and e-commerce platform. Artists can showcase their work, manage their stores, and sell digital/physical products. Built as a university final project (CSIT321-G7) with emphasis on clean code, extensive documentation, and educational value.

```

- MySQL 8.0+

Backend runs on: http://localhost:8080

- Node.js 18+

### 3. Run Frontend

- Maven

```bash

cd glyzier-frontend**Deployed Application**: [Deployment URL - To be added]> ⚠️ **Educational Project Notice**: This is a simulated system for educational purposes. Payment processing, inventory management, and file uploads are simplified simulations, not production-ready implementations.

npm install

npm run dev### 1. Database Setup

```



Frontend runs on: http://localhost:5173

Start MySQL and create database:

## Team Members

**Repository**: https://github.com/seeudev/CSIT321-G7-glyzier---

| Name | Student ID | Role | Email |

|------|------------|------|-------|```sql

| [Name 1] | [ID] | [Role] | [Email] |

| [Name 2] | [ID] | [Role] | [Email] |CREATE DATABASE glyzier_db;

| [Name 3] | [ID] | [Role] | [Email] |

| [Name 4] | [ID] | [Role] | [Email] |```



## Deployed Link---## 📋 Table of Contents



[Deployment URL - To be added]Configure credentials in `glyzier-backend/src/main/resources/application.properties`:



## Additional Project Details- [Features](#-features)



### Database Schema```properties



**Users**spring.datasource.url=jdbc:mysql://localhost:3306/glyzier_db## Team Members- [Tech Stack](#-tech-stack)

- userid (PK), email (UNIQUE), displayname, password, created_at

spring.datasource.username=YOUR_USERNAME

**Seller**

- sid (PK), userid (FK, UNIQUE), sellername (UNIQUE), storebio, created_atspring.datasource.password=YOUR_PASSWORD- [Project Structure](#-project-structure)



**Products**```

- pid (PK), sid (FK), productname, type, price, status, created_at

| Name | Student ID | Role | Contact |- [Getting Started](#-getting-started)

**ProductFiles**

- pfileid (PK), pid (FK), file_key, file_type, file_format, created_at### 2. Run Backend



**Inventory**|------|------------|------|---------|- [API Documentation](#-api-documentation)

- invid (PK), pid (FK, UNIQUE), qtyonhand, qtyreserved, updated_at

```bash

**Orders**

- orderid (PK), userid (FK), total, status, placed_atcd glyzier-backend| [Name 1] | [ID] | [Role] | [Email] |- [Database Schema](#-database-schema)



**OrderProducts**./mvnw clean install

- opid (PK), orderid (FK), pid (FK), product_name_snapshot, unit_price, quantity

./mvnw spring-boot:run| [Name 2] | [ID] | [Role] | [Email] |- [Security](#-security)

**Relationships**:

- Users (1) --- (0..1) Seller```

- Users (1) --- (N) Orders

- Seller (1) --- (N) Products| [Name 3] | [ID] | [Role] | [Email] |- [Development](#-development)

- Products (1) --- (1) Inventory

- Products (1) --- (N) ProductFilesBackend runs on: http://localhost:8080

- Orders (1) --- (N) OrderProducts

- Products (1) --- (N) OrderProducts| [Name 4] | [ID] | [Role] | [Email] |- [Testing](#-testing)



### Features### 3. Run Frontend



**Public Features**- [Troubleshooting](#-troubleshooting)

- Browse products (no authentication)

- View product details```bash

- View seller profiles

cd glyzier-frontend---- [Contributors](#-contributors)

**User Features** (requires authentication)

- Register and login (JWT-based)npm install

- View user profile

- Place orders (simulated checkout)npm run dev

- View order history

```

**Seller Features** (requires seller account)

- Register as seller## Technology Stack---

- Create, update, delete products

- Set product inventory (simulated)Frontend runs on: http://localhost:5173

- Add product images (simulated file keys)



**Technical Features**

- JWT authentication (24-hour expiration)## Team Members

- BCrypt password encryption

- RESTful API architecture### Backend## ✨ Features

- CORS enabled for localhost

- Input validation| Name | Student ID | Role | Email |

- SQL injection prevention (JPA)

|------|------------|------|-------|- Spring Boot 3.5.6

### API Endpoints

| [Name 1] | [ID] | [Role] | [Email] |

**Base URL**: `http://localhost:8080/api`

| [Name 2] | [ID] | [Role] | [Email] |- Java 17### For Users

| Endpoint | Method | Auth | Description |

|----------|--------|------|-------------|| [Name 3] | [ID] | [Role] | [Email] |

| /auth/register | POST | No | Register user |

| /auth/login | POST | No | Login user || [Name 4] | [ID] | [Role] | [Email] |- Spring Security + JWT (jjwt 0.11.5)- 🔐 **Authentication**: Secure registration and login with JWT tokens

| /users/me | GET | Yes | Get current user |

| /sellers/register | POST | Yes | Become seller |

| /sellers/{sid} | GET | No | Get seller info |

| /sellers/me | GET | Yes | Get own seller profile |## Deployed Link- MySQL 8.0- 🛍️ **Product Browsing**: Browse all available artworks and products

| /sellers/check | GET | Yes | Check seller status |

| /products | POST | Yes | Create product (seller) |

| /products | GET | No | List all products |

| /products/{pid} | GET | No | Get product details |[Deployment URL - To be added]- Spring Data JPA / Hibernate- 🛒 **Order Placement**: Purchase products (simulated checkout)

| /products/{pid} | PUT | Yes | Update product (owner) |

| /products/{pid} | DELETE | Yes | Delete product (owner) |

| /products/{pid}/inventory | POST | Yes | Set inventory (seller) |

| /products/seller/{sid} | GET | No | Get seller's products |## Additional Project Details- Maven- 📜 **Order History**: View past orders with detailed information

| /orders/place | POST | Yes | Place order |

| /orders/my-history | GET | Yes | Get order history |

| /orders/{orderid} | GET | Yes | Get order details (owner) |

### Database Schema- 👤 **User Profile**: Manage personal account information

Full API documentation: [doc/API_DOCUMENTATION.md](./doc/API_DOCUMENTATION.md)



### Project Structure

**Users**### Frontend

```

glyzier-backend/- userid (PK), email (UNIQUE), displayname, password, created_at

├── src/main/java/com/glyzier/

│   ├── config/              SecurityConfig- React 19.1.1### For Sellers (Artists)

│   ├── controller/          REST endpoints

│   ├── dto/                 Request/Response objects**Seller**

│   ├── model/               JPA entities

│   ├── repository/          Data access layer- sid (PK), userid (FK, UNIQUE), sellername (UNIQUE), storebio, created_at- Vite 7.1.7- 🎨 **Seller Registration**: Convert user account to seller/artist profile

│   ├── security/            JWT utilities

│   └── service/             Business logic

└── src/main/resources/

    └── application.properties**Products**- React Router DOM 7.9.4- ➕ **Product Management**: Create, update, and delete products



glyzier-frontend/- pid (PK), sid (FK), productname, type, price, status, created_at

├── src/

│   ├── components/          ProtectedRoute- Axios 1.12.2- 📦 **Inventory Control**: Set and manage product inventory (simulated)

│   ├── context/             AuthContext

│   ├── pages/               HomePage, LoginPage, RegisterPage, DashboardPage**ProductFiles**

│   ├── services/            api.js, authService.js

│   └── styles/              common.js- pfileid (PK), pid (FK), file_key, file_type, file_format, created_at- 🖼️ **Product Files**: Attach multiple images/files to products (simulated)

└── package.json

```



### Key Design Decisions**Inventory**---- 📊 **Store Profile**: Custom store name and bio



**Backend**:- invid (PK), pid (FK, UNIQUE), qtyonhand, qtyreserved, updated_at

- Service layer pattern for business logic

- DTO pattern for API requests/responses

- Repository pattern for data access

- JWT stateless authentication**Orders**

- BCrypt for password hashing

- Simulated file upload (string keys)- orderid (PK), userid (FK), total, status, placed_at## Features### System Features

- Simulated inventory (no race condition handling)

- Simulated payment (no gateway integration)



**Frontend**:**OrderProducts**- 🔒 **JWT Authentication**: Stateless, secure token-based authentication

- Context API for global auth state

- Protected routes for authenticated pages- opid (PK), orderid (FK), pid (FK), product_name_snapshot, unit_price, quantity

- Axios for HTTP requests

- React Router for navigation### User Features- 🌐 **RESTful API**: Clean, well-documented REST endpoints

- localStorage for JWT persistence

**Relationships**:

### Security Configuration

- Users (1) --- (0..1) Seller- User registration and authentication (JWT-based)- 🗄️ **Relational Database**: Properly normalized MySQL schema

**JWT Settings** (`application.properties`):

```properties- Users (1) --- (N) Orders

jwt.secret=glyzierSecretKey2024ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation

jwt.expiration=86400000  # 24 hours- Seller (1) --- (N) Products- Browse products from all sellers- 📱 **Responsive Frontend**: React-based SPA with React Router

```

- Products (1) --- (1) Inventory

**Public Endpoints**:

- POST /api/auth/register- Products (1) --- (N) ProductFiles- Place orders (simulated checkout)- 🔄 **CORS Enabled**: Frontend-backend communication configured

- POST /api/auth/login

- GET /api/products/**- Orders (1) --- (N) OrderProducts

- GET /api/sellers/**

- Products (1) --- (N) OrderProducts- View order history- 💬 **Extensive Comments**: Every component heavily documented

**Protected Endpoints**:

- All other /api/** endpoints



### Testing### Features- User profile management



**Quick API Test**:



```bash**Public Features**---

# Register

curl -X POST http://localhost:8080/api/auth/register \- Browse products (no authentication)

  -H "Content-Type: application/json" \

  -d '{"displayname":"Test","email":"test@example.com","password":"Test123"}'- View product details### Seller Features



# Login- View seller profiles

curl -X POST http://localhost:8080/api/auth/login \

  -H "Content-Type: application/json" \- Register as seller/artist## 🛠️ Tech Stack

  -d '{"email":"test@example.com","password":"Test123"}'

**User Features** (requires authentication)

# Get user (replace TOKEN)

curl -X GET http://localhost:8080/api/users/me \- Register and login (JWT-based)- Create, update, delete products

  -H "Authorization: Bearer TOKEN"

```- View user profile



### Development Workflow- Place orders (simulated checkout)- Manage product inventory (simulated)### Backend



1. Backend changes:- View order history

   - Modify models → Update repositories → Update services → Update controllers

   - Run: `./mvnw spring-boot:run`- Add product images/files (simulated)- **Framework**: Spring Boot 3.5.6



2. Frontend changes:**Seller Features** (requires seller account)

   - Modify components/pages → Update services if needed

   - Run: `npm run dev`- Register as seller- Custom store profile with bio- **Language**: Java 17



3. Database schema changes:- Create, update, delete products

   - Modify JPA entities

   - Restart backend (JPA auto-updates schema)- Set product inventory (simulated)- **Security**: Spring Security + JWT (jjwt 0.11.5)



### Troubleshooting- Add product images (simulated file keys)



**MySQL Connection Failed**:### Technical Features- **Database**: MySQL 8.0

- Verify MySQL is running

- Check credentials in application.properties**Technical Features**



**Port 8080 in use**:- JWT authentication (24-hour expiration)- JWT stateless authentication- **ORM**: Spring Data JPA / Hibernate

```bash

lsof -ti:8080 | xargs kill -9- BCrypt password encryption

```

- RESTful API architecture- RESTful API architecture- **Build Tool**: Maven

**CORS errors**:

- Verify SecurityConfig allows frontend URL- CORS enabled for localhost

- Check frontend runs on port 5173 or 3000

- Input validation- Normalized relational database schema- **Dev Tools**: Spring Boot DevTools

**JWT 401 errors**:

- Check token format: `Bearer <token>`- SQL injection prevention (JPA)

- Token expires after 24 hours

- Login again for fresh token- CORS-enabled frontend-backend communication



## License### API Endpoints



Educational project for CSIT321-G7.- BCrypt password encryption### Frontend


**Base URL**: `http://localhost:8080/api`

- Input validation and error handling- **Framework**: React 19.1.1

| Endpoint | Method | Auth | Description |

|----------|--------|------|-------------|- **Build Tool**: Vite 7.1.7

| /auth/register | POST | No | Register user |

| /auth/login | POST | No | Login user |---- **Routing**: React Router DOM 7.9.4

| /users/me | GET | Yes | Get current user |

| /sellers/register | POST | Yes | Become seller |- **HTTP Client**: Axios 1.12.2

| /sellers/{sid} | GET | No | Get seller info |

| /sellers/me | GET | Yes | Get own seller profile |## Database Schema- **Language**: JavaScript (ES6+)

| /sellers/check | GET | Yes | Check seller status |

| /products | POST | Yes | Create product (seller) |

| /products | GET | No | List all products |

| /products/{pid} | GET | No | Get product details |### Entity Relationships### Development

| /products/{pid} | PUT | Yes | Update product (owner) |

| /products/{pid} | DELETE | Yes | Delete product (owner) |- **Version Control**: Git + GitHub

| /products/{pid}/inventory | POST | Yes | Set inventory (seller) |

| /products/seller/{sid} | GET | No | Get seller's products |```- **IDE**: VS Code (recommended)

| /orders/place | POST | Yes | Place order |

| /orders/my-history | GET | Yes | Get order history |Users (1) -------- (0..1) Seller- **Database Tool**: MySQL Workbench / CLI

| /orders/{orderid} | GET | Yes | Get order details (owner) |

  |                         |

Full API documentation: [doc/API_DOCUMENTATION.md](./doc/API_DOCUMENTATION.md)

  | (1:N)                  | (1:N)---

### Project Structure

  |                         |

```

glyzier-backend/Orders                   Products (1) --- (1) Inventory## 📁 Project Structure

├── src/main/java/com/glyzier/

│   ├── config/              SecurityConfig  |                         |

│   ├── controller/          AuthController, UserController, SellerController, ProductController, OrderController

│   ├── dto/                 Request/Response objects  | (1:N)                  | (1:N)```

│   ├── model/               JPA entities (Users, Seller, Products, Orders, etc.)

│   ├── repository/          Spring Data JPA repositories  |                         |CSIT321-G7-glyzier/

│   ├── security/            JwtUtil, JwtAuthFilter, CustomUserDetailsService

│   └── service/             Business logic servicesOrder_Products -----------+├── README.md                           # This file

└── src/main/resources/

    └── application.properties├── .gitignore                          # Git ignore rules



glyzier-frontend/Products (1) -------- (N) ProductFiles│

├── src/

│   ├── components/          ProtectedRoute```├── doc/                                # Documentation

│   ├── context/             AuthContext

│   ├── pages/               HomePage, LoginPage, RegisterPage, DashboardPage│   └── API_DOCUMENTATION.md            # Complete API reference

│   ├── services/            api.js, authService.js

│   └── styles/              common.js### Tables│

└── package.json

```├── glyzier-backend/                    # Spring Boot Backend



### Key Design Decisions**users**│   ├── src/



**Backend**:- userid (PK, BIGINT)│   │   ├── main/

- Service layer pattern for business logic

- DTO pattern for API requests/responses- email (VARCHAR, UNIQUE)│   │   │   ├── java/com/glyzier/

- Repository pattern for data access

- JWT stateless authentication- displayname (VARCHAR)│   │   │   │   ├── config/            # Security & App configuration

- BCrypt for password hashing

- Simulated file upload (string keys)- password (VARCHAR, BCrypt hashed)│   │   │   │   │   └── SecurityConfig.java

- Simulated inventory (no race condition handling)

- Simulated payment (no gateway integration)- created_at (TIMESTAMP)│   │   │   │   │



**Frontend**:│   │   │   │   ├── controller/        # REST API Controllers

- Context API for global auth state

- Protected routes for authenticated pages**seller**│   │   │   │   │   ├── AuthController.java

- Axios for HTTP requests

- React Router for navigation- sid (PK, BIGINT)│   │   │   │   │   ├── UserController.java

- localStorage for JWT persistence

- userid (FK → users.userid, UNIQUE)│   │   │   │   │   ├── SellerController.java

### Security Configuration

- sellername (VARCHAR, UNIQUE)│   │   │   │   │   ├── ProductController.java

**JWT Settings** (`application.properties`):

```properties- storebio (TEXT)│   │   │   │   │   └── OrderController.java

jwt.secret=glyzierSecretKey2024ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation

jwt.expiration=86400000  # 24 hours- created_at (TIMESTAMP)│   │   │   │   │

```

│   │   │   │   ├── dto/               # Data Transfer Objects

**Public Endpoints**:

- POST /api/auth/register**products**│   │   │   │   │   ├── RegisterRequest.java

- POST /api/auth/login

- GET /api/products/**- pid (PK, BIGINT)│   │   │   │   │   ├── LoginRequest.java

- GET /api/sellers/**

- sid (FK → seller.sid)│   │   │   │   │   ├── AuthResponse.java

**Protected Endpoints**:

- All other /api/** endpoints- productname (VARCHAR)│   │   │   │   │   ├── CreateProductRequest.java



### Testing- type (VARCHAR)│   │   │   │   │   ├── UpdateProductRequest.java



**Quick API Test**:- price (DECIMAL)│   │   │   │   │   ├── SetInventoryRequest.java



```bash- status (VARCHAR)│   │   │   │   │   ├── CreateSellerRequest.java

# Register

curl -X POST http://localhost:8080/api/auth/register \- created_at (TIMESTAMP)│   │   │   │   │   ├── PlaceOrderRequest.java

  -H "Content-Type: application/json" \

  -d '{"displayname":"Test","email":"test@example.com","password":"Test123"}'│   │   │   │   │   └── OrderItemRequest.java



# Login**product_files**│   │   │   │   │

curl -X POST http://localhost:8080/api/auth/login \

  -H "Content-Type: application/json" \- pfileid (PK, BIGINT)│   │   │   │   ├── model/             # JPA Entities

  -d '{"email":"test@example.com","password":"Test123"}'

- pid (FK → products.pid)│   │   │   │   │   ├── Users.java

# Get user (replace TOKEN)

curl -X GET http://localhost:8080/api/users/me \- file_key (VARCHAR)│   │   │   │   │   ├── Seller.java

  -H "Authorization: Bearer TOKEN"

```- file_type (VARCHAR)│   │   │   │   │   ├── Products.java



### Development Workflow- file_format (VARCHAR)│   │   │   │   │   ├── ProductFiles.java



1. Backend changes:- created_at (TIMESTAMP)│   │   │   │   │   ├── Orders.java

   - Modify models → Update repositories → Update services → Update controllers

   - Run: `./mvnw spring-boot:run`│   │   │   │   │   ├── OrderProducts.java



2. Frontend changes:**inventory**│   │   │   │   │   └── Inventory.java

   - Modify components/pages → Update services if needed

   - Run: `npm run dev`- invid (PK, BIGINT)│   │   │   │   │



3. Database schema changes:- pid (FK → products.pid, UNIQUE)│   │   │   │   ├── repository/        # Spring Data JPA Repositories

   - Modify JPA entities

   - Restart backend (JPA auto-updates schema)- qtyonhand (INT)│   │   │   │   │   ├── UserRepository.java



### Troubleshooting- qtyreserved (INT)│   │   │   │   │   ├── SellerRepository.java



**MySQL Connection Failed**:- updated_at (TIMESTAMP)│   │   │   │   │   ├── ProductRepository.java

- Verify MySQL is running

- Check credentials in application.properties│   │   │   │   │   ├── ProductFilesRepository.java



**Port 8080 in use**:**orders**│   │   │   │   │   ├── OrderRepository.java

```bash

lsof -ti:8080 | xargs kill -9- orderid (PK, BIGINT)│   │   │   │   │   ├── OrderProductsRepository.java

```

- userid (FK → users.userid)│   │   │   │   │   └── InventoryRepository.java

**CORS errors**:

- Verify SecurityConfig allows frontend URL- total (DECIMAL)│   │   │   │   │

- Check frontend runs on port 5173 or 3000

- status (VARCHAR)│   │   │   │   ├── security/          # JWT & Auth components

**JWT 401 errors**:

- Check token format: `Bearer <token>`- placed_at (TIMESTAMP)│   │   │   │   │   ├── JwtUtil.java

- Token expires after 24 hours

- Login again for fresh token│   │   │   │   │   ├── JwtAuthFilter.java



## License**order_products**│   │   │   │   │   └── CustomUserDetailsService.java



Educational project for CSIT321-G7.- opid (PK, BIGINT)│   │   │   │   │


- orderid (FK → orders.orderid)│   │   │   │   ├── service/           # Business Logic Services

- pid (FK → products.pid)│   │   │   │   │   ├── AuthService.java

- product_name_snapshot (VARCHAR)│   │   │   │   │   ├── UserService.java

- unit_price (DECIMAL)│   │   │   │   │   ├── SellerService.java

- quantity (INT)│   │   │   │   │   ├── ProductService.java

│   │   │   │   │   └── OrderService.java

---│   │   │   │   │

│   │   │   │   └── glyzier_backend/

## Project Structure│   │   │   │       └── GlyzierApplication.java  # Main Spring Boot App

│   │   │   │

```│   │   │   └── resources/

glyzier-backend/│   │   │       └── application.properties       # Configuration

├── src/main/java/com/glyzier/│   │   │

│   ├── config/              # SecurityConfig│   │   └── test/                      # Unit Tests

│   ├── controller/          # REST endpoints│   │

│   ├── dto/                 # Request/Response objects│   └── pom.xml                        # Maven dependencies

│   ├── model/               # JPA entities│

│   ├── repository/          # Data access layer└── glyzier-frontend/                  # React Frontend

│   ├── security/            # JWT utilities    ├── src/

│   └── service/             # Business logic    │   ├── components/

└── src/main/resources/    │   │   └── ProtectedRoute.jsx     # Route guard

    └── application.properties    │   │

    │   ├── context/

glyzier-frontend/    │   │   └── AuthContext.jsx        # Global auth state

├── src/    │   │

│   ├── components/          # React components    │   ├── pages/

│   ├── context/             # Global state (AuthContext)    │   │   ├── HomePage.jsx           # Product listing

│   ├── pages/               # Route pages    │   │   ├── LoginPage.jsx          # Login form

│   ├── services/            # API calls    │   │   ├── RegisterPage.jsx       # Registration form

│   └── styles/              # CSS/styling    │   │   └── DashboardPage.jsx      # User dashboard

└── package.json    │   │

```    │   ├── services/

    │   │   ├── api.js                 # Axios instance

---    │   │   └── authService.js         # Auth API calls

    │   │

## Setup and Run Instructions    │   ├── styles/

    │   │   └── common.js              # Shared styles

### Prerequisites    │   │

    │   ├── App.jsx                    # Main app component

- Java 17 or higher    │   ├── main.jsx                   # Entry point

- MySQL 8.0 or higher    │   └── index.css                  # Global styles

- Node.js 18+ and npm    │

- Maven (or use included wrapper)    ├── package.json                   # Node dependencies

    └── vite.config.js                 # Vite configuration

### Database Setup```



1. Start MySQL server---

2. Create database:

```sql## 🚀 Getting Started

CREATE DATABASE glyzier_db;

```### Prerequisites



3. Configure credentials in `glyzier-backend/src/main/resources/application.properties`:Before running the application, ensure you have the following installed:

```properties

spring.datasource.url=jdbc:mysql://localhost:3306/glyzier_db- **Java 17** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))

spring.datasource.username=YOUR_USERNAME- **MySQL 8.0** or higher ([Download](https://dev.mysql.com/downloads/mysql/))

spring.datasource.password=YOUR_PASSWORD- **Node.js 18+** and npm ([Download](https://nodejs.org/))

```- **Maven** (or use the included Maven wrapper `./mvnw`)

- **Git** ([Download](https://git-scm.com/))

### Backend Setup

### 1️⃣ Clone the Repository

```bash

cd glyzier-backend```bash

./mvnw clean installgit clone https://github.com/seeudev/CSIT321-G7-glyzier.git

./mvnw spring-boot:runcd CSIT321-G7-glyzier

``````



Backend runs on: http://localhost:8080### 2️⃣ Setup Database



### Frontend Setup1. **Start MySQL Server**:

   ```bash

```bash   sudo systemctl start mysql  # Linux

cd glyzier-frontend   # or

npm install   brew services start mysql    # macOS

npm run dev   ```

```

2. **Create Database**:

Frontend runs on: http://localhost:5173   ```bash

   mysql -u root -p

---   ```

   ```sql

## API Documentation   CREATE DATABASE glyzier_db;

   EXIT;

Complete API reference: [doc/API_DOCUMENTATION.md](./doc/API_DOCUMENTATION.md)   ```



### Quick Reference3. **Configure Database Credentials**:

   

**Base URL**: `http://localhost:8080/api`   Edit `glyzier-backend/src/main/resources/application.properties`:

   ```properties

**Authentication**: Include JWT in header: `Authorization: Bearer <token>`   spring.datasource.url=jdbc:mysql://localhost:3306/glyzier_db

   spring.datasource.username=YOUR_MYSQL_USERNAME

### Endpoints Summary   spring.datasource.password=YOUR_MYSQL_PASSWORD

   ```

| Endpoint | Method | Auth | Description |

|----------|--------|------|-------------|### 3️⃣ Run the Backend

| /auth/register | POST | No | Register new user |

| /auth/login | POST | No | Login user, get JWT |```bash

| /users/me | GET | Yes | Get current user info |cd glyzier-backend

| /sellers/register | POST | Yes | Become a seller |

| /sellers/{sid} | GET | No | Get seller info |# Build the project

| /sellers/me | GET | Yes | Get own seller profile |./mvnw clean install

| /products | POST | Yes | Create product (seller) |

| /products | GET | No | List all products |# Run the application

| /products/{pid} | GET | No | Get product details |./mvnw spring-boot:run

| /products/{pid} | PUT | Yes | Update product (owner) |```

| /products/{pid} | DELETE | Yes | Delete product (owner) |

| /products/{pid}/inventory | POST | Yes | Set inventory (seller) |The backend will start on **http://localhost:8080**

| /products/seller/{sid} | GET | No | Get seller's products |

| /orders/place | POST | Yes | Place an order |**Verify backend is running**:

| /orders/my-history | GET | Yes | Get user's orders |```bash

| /orders/{orderid} | GET | Yes | Get order details |curl http://localhost:8080/api/auth/login

# Should return: {"error":"Method 'GET' is not supported"}

---# (This is expected - the endpoint requires POST)

```

## Security

### 4️⃣ Run the Frontend

- Passwords encrypted with BCrypt

- JWT tokens with 24-hour expirationOpen a **new terminal** window:

- Stateless session management

- CORS configured for localhost development```bash

- Input validation on all endpointscd glyzier-frontend

- SQL injection prevention via JPA

# Install dependencies

**JWT Configuration** (application.properties):npm install

```properties

jwt.secret=glyzierSecretKey2024ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation# Start development server

jwt.expiration=86400000npm run dev

``````



---The frontend will start on **http://localhost:5173**



## TestingOpen your browser and navigate to: **http://localhost:5173**



### Manual API Testing---



1. Register user:## 📚 API Documentation

```bash

curl -X POST http://localhost:8080/api/auth/register \### Base URL

  -H "Content-Type: application/json" \```

  -d '{"displayname":"Test User","email":"test@example.com","password":"Test123"}'http://localhost:8080/api

``````



2. Login and save token:### Authentication

```bashMost endpoints require a JWT token. Include it in the Authorization header:

curl -X POST http://localhost:8080/api/auth/login \```

  -H "Content-Type: application/json" \Authorization: Bearer <your_jwt_token>

  -d '{"email":"test@example.com","password":"Test123"}'```

```

### Quick Reference

3. Access protected endpoint:

```bash| Module | Endpoint | Method | Auth | Description |

curl -X GET http://localhost:8080/api/users/me \|--------|----------|--------|------|-------------|

  -H "Authorization: Bearer YOUR_TOKEN_HERE"| **Auth** | `/auth/register` | POST | ❌ | Register new user |

```| **Auth** | `/auth/login` | POST | ❌ | Login user |

| **User** | `/users/me` | GET | ✅ | Get current user |

---| **Seller** | `/sellers/register` | POST | ✅ | Become a seller |

| **Seller** | `/sellers/{sid}` | GET | ❌ | Get seller info |

## Development Notes| **Seller** | `/sellers/me` | GET | ✅ | Get own seller profile |

| **Product** | `/products` | POST | ✅ | Create product (seller only) |

### Module Implementation Order| **Product** | `/products` | GET | ❌ | Get all products |

| **Product** | `/products/{pid}` | GET | ❌ | Get product details |

- Module 0: Project setup, database configuration| **Product** | `/products/{pid}` | PUT | ✅ | Update product (seller only) |

- Module 1: JPA entities and relationships| **Product** | `/products/{pid}` | DELETE | ✅ | Delete product (seller only) |

- Module 2: Authentication and JWT security| **Product** | `/products/{pid}/inventory` | POST | ✅ | Set inventory (seller only) |

- Module 3: Seller and product management| **Product** | `/products/seller/{sid}` | GET | ❌ | Get seller's products |

- Module 4: Order processing simulation| **Order** | `/orders/place` | POST | ✅ | Place an order |

- Module 5: React frontend setup| **Order** | `/orders/my-history` | GET | ✅ | Get order history |

- Module 6: Frontend authentication and pages| **Order** | `/orders/{orderid}` | GET | ✅ | Get order details |



### Simulation Notes📖 **Complete API Documentation**: See [`doc/API_DOCUMENTATION.md`](./doc/API_DOCUMENTATION.md) for detailed request/response examples, validation rules, and error codes.



This project uses simulated implementations for educational purposes:---

- File uploads: String-based file keys instead of actual file storage

- Inventory: Simple quantity decrement without race condition handling## 🗄️ Database Schema

- Payments: No real payment gateway integration

- Not production-ready### Entity Relationship Diagram (ERD)



---```

Users (1) -------- (0..1) Seller

## Troubleshooting  |                         |

  |                         |

### MySQL Connection Failed  | (1)                    | (1)

- Verify MySQL is running: `sudo systemctl status mysql`  |                         |

- Check credentials in application.properties  | (N)                    | (N)

- Ensure database exists: `SHOW DATABASES;`  |                         |

Orders                   Products (1) --- (1) Inventory

### Port 8080 Already in Use  |                         |

```bash  | (1)                    | (1)

lsof -ti:8080 | xargs kill -9  |                         |

```  | (N)                    | (N)

Or change port in application.properties: `server.port=8081`  |                         |

Order_Products -----------+

### CORS Errors  

- Verify backend SecurityConfig allows frontend URLProducts (1) -------- (N) ProductFiles

- Check frontend runs on port 5173 or 3000```

- Clear browser cache

### Key Entities

### JWT Token Invalid (401)

- Check token format: `Bearer <token>` with space#### Users

- Token expires after 24 hours- **Primary Key**: `userid` (BIGINT)

- Login again to get fresh token- **Attributes**: email, displayname, password, created_at

- **Relationships**: 

---  - May own one Seller (1:1)

  - Places many Orders (1:N)

## License

#### Seller

University educational project. All rights reserved by CSIT321-G7 team.- **Primary Key**: `sid` (BIGINT)

- **Foreign Key**: `userid` → Users

---- **Attributes**: sellername, storebio, created_at

- **Relationships**:

## Contact  - Belongs to one User (1:1)

  - Offers many Products (1:N)

For questions or issues, refer to:

1. API Documentation: [doc/API_DOCUMENTATION.md](./doc/API_DOCUMENTATION.md)#### Products

2. Git commit history for implementation details- **Primary Key**: `pid` (BIGINT)

3. Project team members listed above- **Foreign Key**: `sid` → Seller

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
