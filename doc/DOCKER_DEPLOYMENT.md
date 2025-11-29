# 🐳 Docker Deployment Guide for Glyzier

Complete guide for deploying Glyzier using Docker on Render.com

## Why Docker?

Render's free tier doesn't include Java runtime, so we use Docker to:
- ✅ Bundle Java runtime with the application
- ✅ Build frontend and backend in one container
- ✅ Reduce deployment complexity
- ✅ Ensure consistent environment across platforms

---

## 📋 Files Overview

### 1. `Dockerfile` (Multi-stage build)

**Stage 1: Frontend Build**
- Uses Node.js 18 Alpine (lightweight)
- Installs npm dependencies
- Builds React app with Vite
- Outputs to `dist/` folder

**Stage 2: Backend Build**
- Uses Maven 3.9 with Eclipse Temurin 17
- Downloads Maven dependencies (cached layer)
- Copies frontend build to `static/` resources
- Builds Spring Boot JAR

**Stage 3: Runtime**
- Uses Eclipse Temurin 17 JRE (smaller than JDK)
- Copies only the JAR file
- Runs as non-root user (security)
- Includes health check

### 2. `.dockerignore`

Excludes unnecessary files from Docker build:
- Git files
- Documentation
- IDE configs
- Node modules (installed fresh)
- Maven target (built fresh)

### 3. `.env`

Environment variables for production:
- Database credentials
- JWT secret
- Connection pool settings
- Performance tuning

### 4. `docker-compose.yml`

For local testing:
```bash
docker-compose up --build
```

---

## 🚀 Deploy to Render

### Step 1: Prepare Repository

Ensure these files exist in your repo:
```
CSIT321-G7-glyzier/
├── Dockerfile
├── .dockerignore
├── .env (for local testing only - DO NOT commit!)
├── docker-compose.yml
└── render.yaml (updated for Docker)
```

### Step 2: Update .gitignore

Make sure `.env` is in `.gitignore`:
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to gitignore"
```

### Step 3: Push to GitHub

```bash
git add Dockerfile .dockerignore docker-compose.yml render.yaml
git commit -m "feat: add Docker support for Render deployment"
git push origin main
```

### Step 4: Create Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   ```
   Name:              glyzier
   Region:            Singapore (ap-south-1)
   Branch:            main
   Runtime:           Docker
   Dockerfile Path:   ./Dockerfile
   Docker Context:    ./
   Instance Type:     Free
   ```

### Step 5: Set Environment Variables

In Render Dashboard → Environment tab, add:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres.yyavmyittkbueafovaoe
SPRING_DATASOURCE_PASSWORD=glyzierDB@8080
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=2

# JWT
JWT_SECRET=glyzierSecretKey2024ThisIsAVeryLongSecretKeyForJWTTokenGenerationAndValidation
JWT_EXPIRATION=86400000

# Application
SPRING_PROFILES_ACTIVE=supabase
SPRING_APPLICATION_NAME=glyzier
PORT=8080

# Performance
JAVA_TOOL_OPTIONS=-Xmx512m -Xms256m
```

### Step 6: Deploy

Click **"Create Web Service"**

Render will:
1. Clone your repository
2. Build Docker image (3 stages)
3. Push image to Render registry
4. Deploy container
5. Run health checks

**Build time**: ~10-15 minutes (first build)

---

## 🧪 Test Locally

### Build and Run with Docker

```bash
# Build the image
docker build -t glyzier:latest .

# Run the container
docker run -p 8080:8080 --env-file .env glyzier:latest
```

### Or use Docker Compose

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at: http://localhost:8080

---

## 📊 Docker Image Details

### Image Sizes

- **Frontend Build Stage**: ~300MB (Node.js + dependencies)
- **Backend Build Stage**: ~400MB (Maven + JDK)
- **Final Runtime Image**: ~180MB (JRE + JAR only)

### Build Optimization

**Layer Caching**:
```dockerfile
# Dependencies downloaded first (changes rarely)
COPY glyzier-backend/pom.xml ./
RUN ./mvnw dependency:go-offline -B

# Source code copied later (changes frequently)
COPY glyzier-backend/src ./src
RUN ./mvnw clean package -DskipTests -B
```

This means:
- First build: ~10-15 minutes
- Subsequent builds: ~3-5 minutes (if only code changes)

---

## 🔧 Troubleshooting

### Build Fails - Frontend

**Issue**: `npm install` fails or `npm run build` fails

**Solutions**:
1. Check `glyzier-frontend/package.json` exists
2. Verify Node.js version: `node:18-alpine`
3. Check Vite config is correct
4. Clear Docker cache: `docker build --no-cache -t glyzier:latest .`

### Build Fails - Backend

**Issue**: Maven build fails

**Solutions**:
1. Check Java version matches: `eclipse-temurin-17`
2. Verify `pom.xml` is correct
3. Check dependencies are available
4. Try: `docker build --no-cache -t glyzier:latest .`

### Container Starts But Crashes

**Issue**: Container exits immediately

**Solutions**:
1. Check logs: `docker logs <container-id>`
2. Verify database connection:
   - URL is correct
   - Credentials are valid
   - Database is accessible from container
3. Check environment variables are set
4. Verify JAR file exists in image:
   ```bash
   docker run -it glyzier:latest ls -la /app
   ```

### Health Check Fails

**Issue**: Render marks service as unhealthy

**Solutions**:
1. Check `/api/products` endpoint is accessible
2. Verify Spring Boot started successfully
3. Check database connection is working
4. Increase health check timeout in Render

### Out of Memory

**Issue**: Container killed due to memory

**Solutions**:
1. Reduce JVM heap: `JAVA_TOOL_OPTIONS=-Xmx400m -Xms200m`
2. Reduce connection pool: `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=5`
3. Upgrade to paid tier (512MB → 2GB)

### Slow Cold Starts

**Issue**: First request takes 30-60 seconds

**Solutions**:
1. **Free Tier Issue**: Service spins down after 15 minutes
2. Optimize Dockerfile layers for faster builds
3. Use smaller base images (already using Alpine)
4. Upgrade to paid tier for always-on service

---

## 🎯 Production Checklist

Before going live:

- [ ] **Security**: Change JWT secret to strong random value
- [ ] **Database**: Using Supabase connection pooler (port 5432 or 6543)
- [ ] **SSL**: Enabled in database URL (`sslmode=require` if needed)
- [ ] **Logs**: Set `SPRING_JPA_SHOW_SQL=false` in production
- [ ] **Memory**: JVM heap size appropriate for instance
- [ ] **Health Check**: `/api/products` endpoint working
- [ ] **CORS**: Not needed (same origin deployment)
- [ ] **Environment Variables**: All secrets in Render env vars (not in code)
- [ ] **.env File**: NOT committed to Git
- [ ] **Docker Image**: Builds successfully locally
- [ ] **Tests**: Application works in local Docker container

---

## 📚 Additional Resources

- **Render Docker Guide**: https://render.com/docs/docker
- **Dockerfile Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Spring Boot Docker**: https://spring.io/guides/topicals/spring-boot-docker/
- **Multi-stage Builds**: https://docs.docker.com/build/building/multi-stage/

---

## 🎉 Success!

Your Dockerized Glyzier app should now be:
- ✅ Building successfully
- ✅ Running in container
- ✅ Accessible at your Render URL
- ✅ Connected to Supabase database
- ✅ Serving React frontend
- ✅ Processing API requests

**Next**: Test all features (register, login, products, orders, messages)

Happy Deploying! 🚀
