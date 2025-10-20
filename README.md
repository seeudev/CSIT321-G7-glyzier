# Glyzier - Artist Portfolio and Store Platform

## Project Overview

**Glyzier** is a university final project for CSIT321, designed as an artist portfolio and store platform where artists can showcase and sell their digital and physical artwork.

### Technology Stack
- **Backend**: Spring Boot (Java 17)
- **Frontend**: React (To be implemented)
- **Database**: MySQL
- **Build Tool**: Maven

### Project Philosophy
This project emphasizes:
- **Simplicity**: Clear, understandable code structure
- **Extensive Documentation**: Heavy commenting throughout all code
- **Simulated Logic**: All payment, transaction, and inventory logic is simulated for educational purposes
- **No Real Integrations**: No real payment gateways or external services are implemented

---

## Project Structure

```
glyzier-backend/          # Spring Boot backend application
├── src/main/java/com/glyzier/
│   ├── model/           # JPA entity classes
│   │   ├── Users.java
│   │   ├── Seller.java
│   │   ├── Products.java
│   │   ├── ProductFiles.java
│   │   ├── Orders.java
│   │   ├── OrderProducts.java
│   │   └── Inventory.java
│   └── repository/      # Spring Data JPA repositories
│       ├── UserRepository.java
│       ├── SellerRepository.java
│       ├── ProductsRepository.java
│       ├── ProductFilesRepository.java
│       ├── OrdersRepository.java
│       ├── OrderProductsRepository.java
│       └── InventoryRepository.java
└── src/main/resources/
    └── application.properties  # Database configuration
```

---

## Database Configuration

### Prerequisites
1. MySQL Server installed and running on localhost:3306
2. Create a database named `glyzier_db`

```sql
CREATE DATABASE glyzier_db;
```

### Configuration
The application is configured to connect to MySQL with the following credentials:
- **Database**: glyzier_db
- **Username**: HARRY
- **Password**: SpringDB@8080

Update these in `application.properties` if your MySQL setup differs.

---

## Entity-Relationship Model

### Entities

1. **Users** - Platform users who can browse and purchase artwork
   - Fields: userid (PK), email, displayname, password, created_at
   - Relationships: May own one Seller account, can place many Orders

2. **Seller** - Artist/seller accounts that can offer products
   - Fields: sid (PK), sellername, storebio, userid (FK), created_at
   - Relationships: Owned by one User, offers many Products

3. **Products** - Items available for purchase
   - Fields: pid (PK), productname, type, price, status, sid (FK), created_at
   - Relationships: Offered by one Seller, has many ProductFiles, stocked by one Inventory

4. **ProductFiles** - Files associated with products (images, digital downloads)
   - Fields: pfileid (PK), file_key, file_type, file_format, pid (FK), created_at
   - Relationships: Belongs to one Product

5. **Orders** - Customer purchase orders
   - Fields: orderid (PK), total, status, userid (FK), placed_at
   - Relationships: Placed by one User, contains many OrderProducts

6. **OrderProducts** - Join table linking orders and products
   - Fields: opid (PK), product_name_snapshot, unit_price, quantity, orderid (FK), pid (FK)
   - Relationships: Contained in one Order, references one Product

7. **Inventory** - Stock tracking for products
   - Fields: invid (PK), qtyonhand, qtyreserved, pid (FK), updated_at
   - Relationships: Tracks stock for one Product

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CSIT321-G7-glyzier
```

### 2. Configure MySQL
Ensure MySQL is running and create the database:
```sql
CREATE DATABASE glyzier_db;
```

### 3. Update Configuration (if needed)
Edit `glyzier-backend/src/main/resources/application.properties` with your MySQL credentials.

### 4. Build and Run
```bash
cd glyzier-backend
./mvnw clean install
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### 5. Database Tables
On first run, Hibernate will automatically create all database tables based on the JPA entities (configured with `spring.jpa.hibernate.ddl-auto=update`).

---

## Development Progress

### ✅ Module 0: Project Setup (Completed)
- [x] Spring Boot project initialized with required dependencies
- [x] Git repository initialized with .gitignore
- [x] MySQL database configured in application.properties

### ✅ Module 1: ERD Implementation (Completed)
- [x] All 7 JPA entities created with proper relationships
- [x] All 7 JPA repository interfaces created
- [x] Extensive documentation and comments added to all code

### 🔄 Upcoming Modules
- Module 2: Service Layer Implementation
- Module 3: Controller Layer (REST APIs)
- Module 4: Security & Authentication
- Module 5: React Frontend

---

## Key Features (Planned)

1. **User Management**
   - User registration and authentication
   - Profile management

2. **Seller Dashboard**
   - Create and manage seller profile
   - Add/edit/delete products
   - View order history
   - Simulated inventory management

3. **Product Catalog**
   - Browse available artwork
   - Search and filter products
   - View product details and images

4. **Shopping & Checkout**
   - Add products to cart
   - Simulated checkout process
   - Order history and tracking

---

## Important Notes

⚠️ **This is an educational project**:
- All payment processing is **simulated** - no real money transactions
- File storage is **simulated** - no actual file uploads to cloud storage
- Inventory management is **simplified** - not production-ready
- Security implementation is **basic** - not for production use

---

## Team
- Group: CSIT321-G7
- Project: Glyzier Artist Portfolio and Store

---

## License
This is a university project for educational purposes.