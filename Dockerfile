# Glyzier - Multi-stage Dockerfile for Render.com
# Optimized build with frontend and backend in single container

# ============================================
# Stage 1: Build Frontend (React + Vite)
# ============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY glyzier-frontend/package*.json ./

# Install frontend dependencies (including devDependencies like Vite)
# Note: Vite is a devDependency required for building
RUN npm ci

# Copy frontend source
COPY glyzier-frontend/ ./

# Build frontend for production
RUN npm run build

# ============================================
# Stage 2: Build Backend (Spring Boot + Maven)
# ============================================
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-build

WORKDIR /app

# Copy backend pom.xml and download dependencies (cache layer)
COPY glyzier-backend/pom.xml ./
COPY glyzier-backend/.mvn ./.mvn
COPY glyzier-backend/mvnw ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy backend source
COPY glyzier-backend/src ./src

# Copy built frontend to Spring Boot static resources
# This replaces the maven-resources-plugin copy step
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

# Build Spring Boot application with docker profile (skips frontend plugins)
# Tests are also skipped for faster build
RUN ./mvnw clean package -DskipTests -P docker -B

# ============================================
# Stage 3: Runtime (Production)
# ============================================
FROM eclipse-temurin:17-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S glyzier && \
    adduser -u 1001 -S glyzier -G glyzier

# Set working directory
WORKDIR /app

# Copy built JAR from backend-build stage
COPY --from=backend-build /app/target/glyzier-backend-*.jar app.jar

# Change ownership to non-root user
RUN chown -R glyzier:glyzier /app

# Switch to non-root user
USER glyzier

# Expose port (Render sets PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/products || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
