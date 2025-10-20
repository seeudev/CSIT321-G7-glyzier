# Quick Start Guide - Glyzier Project

## ✅ What's Been Completed

### Module 0: Project Setup
- Git repository structure ready
- MySQL database configuration complete
- .gitignore configured for Spring Boot and React

### Module 1: ERD Implementation
- 7 JPA entity classes with full relationships
- 7 Spring Data JPA repositories with custom queries
- Comprehensive documentation and comments
- Zero compilation errors

---

## 🚀 Next Steps

### 1. Initialize Git and Create Commits

Run the git setup script:
```bash
cd /home/seeudev/Projects/CSIT321-G7-glyzier
chmod +x git-setup.sh
./git-setup.sh
```

Or manually execute:
```bash
cd /home/seeudev/Projects/CSIT321-G7-glyzier

# Initialize Git (if needed)
git init

# Stage all files
git add .

# Commit Module 0
git commit -m "feat: Module 0 - Project Setup with MySQL configuration"

# Commit Module 1 (or combine with Module 0)
git commit -m "feat: Module 1 - Implement JPA entities and repositories"

# Add remote repository
git remote add origin <your-repo-url>

# Push to main branch
git push -u origin main
```

### 2. Set Up MySQL Database

Before running the application:
```sql
-- Log into MySQL
mysql -u root -p

-- Create the database
CREATE DATABASE glyzier_db;

-- Exit MySQL
exit;
```

### 3. Run the Application

```bash
cd glyzier-backend

# Clean and build
./mvnw clean install

# Run the Spring Boot application
./mvnw spring-boot:run
```

The application will:
- Start on `http://localhost:8080`
- Automatically create all database tables
- Be ready for testing

### 4. Verify Database Tables Created

After running the application, check MySQL:
```sql
USE glyzier_db;
SHOW TABLES;

-- You should see:
-- users, seller, products, product_files, orders, order_products, inventory
```

---

## 📋 Upcoming Module 2: Service Layer

When you're ready to continue, Module 2 will include:

1. **Service Classes to Create**:
   - UserService
   - SellerService
   - ProductService
   - OrderService
   - InventoryService

2. **Key Functionality**:
   - User registration and authentication logic
   - Seller profile management
   - Product CRUD operations
   - Order placement (simulated checkout)
   - Inventory management (simulated reserve/fulfill)

3. **Additional Components**:
   - DTO (Data Transfer Objects) classes
   - Service exception handling
   - Transaction management with @Transactional

---

## 📚 Key Files Reference

### Configuration
- **Database Config**: `glyzier-backend/src/main/resources/application.properties`

### Models (Entities)
- **Location**: `glyzier-backend/src/main/java/com/glyzier/model/`
- Files: Users, Seller, Products, ProductFiles, Orders, OrderProducts, Inventory

### Repositories
- **Location**: `glyzier-backend/src/main/java/com/glyzier/repository/`
- Files: UserRepository, SellerRepository, ProductsRepository, etc.

### Documentation
- **README.md**: Complete project overview
- **MODULE_COMPLETION_SUMMARY.md**: Detailed module completion info
- **PROJECT_STRUCTURE.md**: Complete file structure
- **QUICK_START.md**: This file

---

## 🔧 Troubleshooting

### MySQL Connection Issues
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `application.properties`
- Ensure database exists: `SHOW DATABASES;`

### Build Issues
- Clean Maven cache: `./mvnw clean`
- Update dependencies: `./mvnw dependency:resolve`

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`
- Or kill process on port 8080: `lsof -ti:8080 | xargs kill -9`

---

## 📞 Project Information

- **Project Name**: Glyzier - Artist Portfolio and Store
- **Course**: CSIT321
- **Group**: G7
- **Tech Stack**: Spring Boot + React + MySQL
- **Purpose**: University Final Project (Educational/Simulated)

---

## ✨ Features Implemented So Far

✅ Database schema designed and implemented  
✅ Entity relationships configured  
✅ Repository layer with custom queries  
✅ Extensive code documentation  
✅ Simulated inventory management logic  

**Status**: Ready for Service Layer Implementation (Module 2)

---

*Last Updated: Module 0 & 1 Completion*