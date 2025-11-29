# Glyzier - Render Deployment Guide

Complete guide for deploying Glyzier (Spring Boot + React) to Render.com.

## 📋 Prerequisites

- [Render.com](https://render.com) account (free tier available)
- [Supabase](https://supabase.com) PostgreSQL database (already configured)
- GitHub repository access
- Java 17+ (for local testing)
- Node.js 18+ (for local testing)

---

## 🗄️ Database Setup (Supabase)

### 1. Verify Supabase Configuration

Your Supabase PostgreSQL database should already be set up. Verify you have:

- **Database URL**: `jdbc:postgresql://[HOST]:[PORT]/postgres`
- **Connection Pooler URL**: `jdbc:postgresql://[HOST]:[PORT]/postgres` (for production - 40 connection limit)
- **Username**: Your Supabase project username
- **Password**: Your Supabase project password

Example Supabase connection string format:
```
jdbc:postgresql://db.PROJECT_ID.supabase.co:5432/postgres
```

> **Note**: Use the **Connection Pooler** (port 6543) for production to stay within the 40-connection limit. Use direct connection (port 5432) for development only.

### 2. Database Tables

Your database tables will be automatically created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) on first deployment:

- `users` - User accounts
- `seller` - Seller profiles
- `products` - Product listings
- `inventory` - Product stock
- `cart` - Shopping carts
- `cart_items` - Cart contents
- `orders` - Order records
- `order_products` - Order line items
- `favorites` - User favorites/wishlist
- `conversations` - Message conversations
- `messages` - Chat messages

---

## 🚀 Deployment Steps

### Step 1: Create Web Service on Render

1. **Login to Render Dashboard**
   - Go to [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `seeudev/CSIT321-G7-glyzier`
   - Select the repository

3. **Configure Web Service**

   | Setting | Value |
   |---------|-------|
   | **Name** | `glyzier` (or your preferred name) |
   | **Region** | Choose closest to your users (e.g., Oregon, Singapore) |
   | **Branch** | `main` (or `feat/module16` for testing) |
   | **Root Directory** | `glyzier-backend` |
   | **Runtime** | `Java` |
   | **Build Command** | `./mvnw clean package -DskipTests` |
   | **Start Command** | `java -jar target/glyzier-backend-0.0.1-SNAPSHOT.jar` |
   | **Instance Type** | `Free` (or paid plan for better performance) |

4. **Advanced Settings**

   - **Auto-Deploy**: `Yes` (deploys automatically on git push)
   - **Health Check Path**: `/api/products` (public endpoint to verify app is running)

---

### Step 2: Configure Environment Variables

In the Render dashboard, go to your web service → **Environment** tab.

Add the following environment variables:

#### Database Configuration (Required)

```bash
# Supabase PostgreSQL Connection
SPRING_DATASOURCE_URL=jdbc:postgresql://db.PROJECT_ID.supabase.co:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.PROJECT_ID
SPRING_DATASOURCE_PASSWORD=your_supabase_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# JPA Configuration
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

**🔴 IMPORTANT**: 
- Replace `PROJECT_ID` with your actual Supabase project ID
- Replace `your_supabase_password` with your actual Supabase password
- Use **port 6543** (Connection Pooler) for production
- Add `?sslmode=require` to the URL for secure connection

#### JWT Configuration (Required)

```bash
# JWT Secret Key (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_KEY_AT_LEAST_64_CHARACTERS_LONG_FOR_PRODUCTION

# JWT Token Expiration (24 hours in milliseconds)
JWT_EXPIRATION=86400000
```

**🔐 Security Note**: Generate a strong random secret for production:
```bash
# Generate a secure random secret (run locally)
openssl rand -base64 64
```

#### Application Configuration (Required)

```bash
# Spring Boot Profile
SPRING_PROFILES_ACTIVE=supabase

# Application Name
SPRING_APPLICATION_NAME=glyzier

# Server Port (Render assigns this automatically)
PORT=8080
```

#### Optional: Performance Tuning

```bash
# JVM Memory Settings (for Free tier - 512MB RAM)
JAVA_TOOL_OPTIONS=-Xmx400m -Xms200m

# Database Connection Pool (to respect Supabase 40-connection limit)
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2

# Hibernate Performance
SPRING_JPA_PROPERTIES_HIBERNATE_JDBC_BATCH_SIZE=20
SPRING_JPA_PROPERTIES_HIBERNATE_ORDER_INSERTS=true
SPRING_JPA_PROPERTIES_HIBERNATE_ORDER_UPDATES=true
```

---

### Step 3: Deploy

1. **Click "Create Web Service"**
   - Render will start building your application
   - Build process takes ~5-10 minutes on first deploy

2. **Monitor Build Logs**
   - Watch the "Logs" tab for build progress
   - Look for: `BUILD SUCCESS` from Maven
   - Then: `Started GlyzierApplication` from Spring Boot

3. **Verify Deployment**
   - Once deployed, you'll see "Live" status
   - Your app will be available at: `https://glyzier.onrender.com` (or your chosen name)

---

## 🌐 Frontend Configuration

Your React frontend is already integrated! Spring Boot serves the built React app from the `static/` folder.

### Verify Frontend Build

The Maven build automatically:
1. Installs Node.js via `frontend-maven-plugin`
2. Runs `npm install` in `glyzier-frontend/`
3. Runs `npm run build` to create production build
4. Copies `dist/` to `glyzier-backend/target/classes/static/`
5. Packages everything into the JAR

### Access Your Application

- **Main Site**: `https://glyzier.onrender.com`
- **API Health Check**: `https://glyzier.onrender.com/api/products`
- **React Routes**: All handled by React Router (SPA)

**No CORS configuration needed** - Frontend and backend are served from the same origin!

---

## 🔧 Post-Deployment Configuration

### Test Your Deployment

1. **Test API Endpoints**
   ```bash
   # Health check
   curl https://glyzier.onrender.com/api/products
   
   # Register a user
   curl -X POST https://glyzier.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"displayname":"Test User","email":"test@example.com","password":"test123"}'
   ```

2. **Test Frontend**
   - Visit `https://glyzier.onrender.com`
   - Register a new account
   - Browse products
   - Test messaging system

### Update Frontend API Base URL (if needed)

If you need to separate frontend and backend in the future, update `glyzier-frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  // ...
});
```

Then set environment variable in Vite build:
```bash
VITE_API_URL=https://glyzier.onrender.com
```

---

## 📊 Monitoring & Maintenance

### Check Application Logs

In Render Dashboard → Your Web Service → **Logs** tab:

```
Look for:
✅ "Started GlyzierApplication in X seconds"
✅ "Tomcat started on port(s): 8080"
✅ "No errors during startup"

⚠️ Watch for:
- Database connection errors
- Memory issues (OutOfMemoryError)
- JWT token validation errors
```

### Monitor Database Connections

Keep database connections under 40 (Supabase limit):

Check logs for warnings:
```
WARN: HikariPool connection pool exhausted
```

If you see this, reduce `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE`.

### Performance Optimization

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds (cold start)
- 512MB RAM limit

**To improve performance:**
1. Upgrade to paid tier ($7/month) for always-on service
2. Use Redis for session storage (reduces DB load)
3. Enable Hibernate 2nd-level caching
4. Implement CDN for static assets

---

## 🔐 Security Checklist

Before going live, ensure:

- [ ] **JWT Secret** - Use a strong random secret (not the default!)
- [ ] **Database Password** - Strong password, not committed to Git
- [ ] **HTTPS** - Render provides automatic HTTPS
- [ ] **Environment Variables** - All secrets in Render env vars (not in code)
- [ ] **SQL Injection Protection** - Using JPA/Hibernate (already protected)
- [ ] **CORS** - Not needed (same origin), but verify in SecurityConfig if separating frontend
- [ ] **Input Validation** - Jakarta Validation annotations in DTOs (already implemented)
- [ ] **Rate Limiting** - Consider adding Spring rate limiter for auth endpoints

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Symptoms**: Maven build fails with errors

**Solutions**:
1. Check Java version in `pom.xml`: `<java.version>17</java.version>`
2. Verify build command: `./mvnw clean package -DskipTests`
3. Check build logs for specific errors
4. Ensure `mvnw` has execute permissions: `git update-index --chmod=+x mvnw`

### Issue: Database Connection Fails

**Symptoms**: 
```
org.postgresql.util.PSQLException: Connection refused
or
HikariPool: Connection is not available
```

**Solutions**:
1. Verify `SPRING_DATASOURCE_URL` format: `jdbc:postgresql://HOST:PORT/DATABASE`
2. Use Connection Pooler port **6543** (not 5432)
3. Add `?sslmode=require` to URL
4. Check Supabase dashboard - database running?
5. Verify username includes project ID: `postgres.PROJECT_ID`
6. Test connection locally first

### Issue: App Starts But Shows 404

**Symptoms**: Backend starts but React app not loading

**Solutions**:
1. Check frontend build in logs: `npm run build` successful?
2. Verify `static/` folder in JAR: `jar tf target/*.jar | grep static`
3. Check `SpaController.java` is forwarding routes correctly
4. Clear browser cache and retry

### Issue: Cold Start Timeout

**Symptoms**: First request after inactivity times out

**Solutions**:
1. **Free Tier Issue** - Service spins down after 15 minutes
2. Upgrade to paid tier for always-on service
3. Use external uptime monitor to ping every 10 minutes (keeps service alive)
4. Optimize startup time: reduce dependencies, lazy initialization

### Issue: Out of Memory Error

**Symptoms**: 
```
java.lang.OutOfMemoryError: Java heap space
```

**Solutions**:
1. Reduce JVM heap: `JAVA_TOOL_OPTIONS=-Xmx400m`
2. Optimize database queries (use LAZY loading - already implemented!)
3. Reduce connection pool size: `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=5`
4. Upgrade to larger instance (512MB → 2GB)

### Issue: Messages Not Polling

**Symptoms**: Messages don't update in real-time

**Solutions**:
1. Verify short polling is working (check browser network tab)
2. Check CORS if frontend is separate domain
3. Verify JWT token is valid and not expired
4. Check database connections available

---

## 🔄 Continuous Deployment

### Automatic Deploys

Render automatically deploys when you push to your configured branch:

```bash
git checkout main
git merge feat/module16
git push origin main
# Render automatically deploys!
```

### Manual Deploy

In Render Dashboard → Your Web Service → **Manual Deploy** button

---

## 📚 Additional Resources

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **Spring Boot on Render**: [https://render.com/docs/deploy-spring-boot](https://render.com/docs/deploy-spring-boot)
- **Supabase Connection Docs**: [https://supabase.com/docs/guides/database](https://supabase.com/docs/guides/database)
- **Project Documentation**: See `README.md` and `doc/API_DOCUMENTATION.md`

---

## 🎉 Success Checklist

Your deployment is successful when:

- [ ] Web service shows **"Live"** status in Render
- [ ] Homepage loads at `https://glyzier.onrender.com`
- [ ] Can register new user account
- [ ] Can login and see dashboard
- [ ] Can view products and shops
- [ ] Can send messages between users
- [ ] API endpoints respond correctly
- [ ] No errors in Render logs

---

## 📞 Support

If you encounter issues:

1. Check Render logs first
2. Review this troubleshooting guide
3. Verify environment variables are set correctly
4. Test locally with same configuration
5. Check Supabase database is accessible

**Deployed by**: Glyzier Team  
**Last Updated**: November 29, 2025  
**Deployment Platform**: Render.com  
**Framework**: Spring Boot 3.5.6 + React 19.1.1
