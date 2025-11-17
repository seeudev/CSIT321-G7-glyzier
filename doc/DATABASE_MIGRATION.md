# Database Migration Guide: MySQL → Supabase PostgreSQL

## Overview
This document describes the migration from local MySQL to Supabase PostgreSQL (completed on branch: `db/mysql-to-pg`).

## What Changed

### 1. Dependencies (`glyzier-backend/pom.xml`)
- ✅ **Added**: PostgreSQL JDBC driver (`org.postgresql:postgresql`)
- ❌ **Deprecated**: MySQL connector (commented out, can be removed after verification)

### 2. Database Configuration

#### Active Profile
The application now uses **`spring.profiles.active=supabase`** by default.

#### Configuration Files
| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `application.properties` | Default config with template values | ✅ Yes |
| `application-supabase.properties` | **Production Supabase credentials** | ❌ **NO - Gitignored** |
| `application-supabase.properties.template` | Template for developers | ✅ Yes |
| `application-local.properties` | Legacy MySQL config (deprecated) | ❌ NO - Gitignored |

### 3. Key Configuration Changes

#### PostgreSQL-Specific Settings
```properties
# Driver class
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection pooling optimized for Supabase
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
```

#### Supabase Connection
```properties
# Supabase Session Pooler (production)
spring.datasource.url=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres
spring.datasource.username=postgres.yyavmyittkbueafovaoe
spring.datasource.password=glyzierDB@8080
```

## Setup Instructions

### For New Developers

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd glyzier-backend
   ```

2. **Create your local Supabase config**
   ```bash
   cd src/main/resources
   cp application-supabase.properties.template application-supabase.properties
   ```

3. **Fill in actual credentials**
   - Edit `application-supabase.properties` with your Supabase connection details
   - This file is gitignored and won't be committed

4. **Install dependencies and run**
   ```bash
   cd ../../..  # Back to glyzier-backend root
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

### For Existing Developers (Migrating from MySQL)

1. **Pull the latest changes**
   ```bash
   git checkout db/mysql-to-pg
   git pull origin db/mysql-to-pg
   ```

2. **Maven will auto-download PostgreSQL driver**
   ```bash
   ./mvnw clean install
   ```

3. **Set up Supabase credentials**
   - Copy `application-supabase.properties.template` to `application-supabase.properties`
   - Update with actual Supabase connection details

4. **Verify the migration**
   ```bash
   ./mvnw spring-boot:run
   ```
   - Check console for successful PostgreSQL connection
   - Verify tables are created in Supabase

## Database Schema Migration

### Automatic Schema Creation
Spring Boot's `spring.jpa.hibernate.ddl-auto=update` will automatically:
- Create tables if they don't exist
- Add new columns to existing tables
- Preserve existing data

### Manual Data Migration (if needed)
If you need to migrate data from MySQL to PostgreSQL:

1. **Export from MySQL**
   ```bash
   mysqldump -u HARRY -p glyzier_db > mysql_dump.sql
   ```

2. **Convert MySQL dump to PostgreSQL format**
   - Use tools like `pgloader` or manual conversion
   - Handle syntax differences (AUTO_INCREMENT → SERIAL, etc.)

3. **Import to Supabase**
   - Use Supabase SQL Editor or `psql` client

## SQL Dialect Differences

### MySQL → PostgreSQL Changes
| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto-increment | `AUTO_INCREMENT` | `SERIAL` or `IDENTITY` |
| String concat | `CONCAT()` | `\|\|` operator |
| Limit syntax | `LIMIT n, m` | `LIMIT n OFFSET m` |
| Date functions | `NOW()` | `CURRENT_TIMESTAMP` |
| Case sensitivity | Depends on config | Case-sensitive by default |

**Note**: Since we're using JPA/Hibernate, most of these differences are handled automatically by the PostgreSQL dialect.

## Verification Checklist

After migration, verify:

- [ ] Application starts without errors
- [ ] Database tables are created in Supabase
- [ ] User registration works
- [ ] User login and JWT authentication works
- [ ] Seller registration works
- [ ] Product creation works
- [ ] Order placement works
- [ ] All endpoints return expected responses

## Troubleshooting

### Connection Refused
**Problem**: Can't connect to Supabase
**Solution**: 
- Verify pooler URL is correct
- Check Supabase project is active
- Confirm firewall/network allows port 5432

### Authentication Failed
**Problem**: Login fails with 401
**Solution**:
- Verify `application-supabase.properties` exists
- Check credentials are correct (copy-paste to avoid typos)

### Schema Sync Issues
**Problem**: Tables not created or missing columns
**Solution**:
- Check `spring.jpa.hibernate.ddl-auto=update` is set
- Review console logs for Hibernate errors
- Manually verify table structure in Supabase SQL Editor

### Connection Pool Exhausted
**Problem**: "Connection timeout" errors under load
**Solution**:
- Adjust HikariCP pool settings in `application-supabase.properties`
- Consider upgrading Supabase plan for more connections

## Security Notes

### ⚠️ NEVER Commit Credentials
The following files contain sensitive data and are gitignored:
- `application-supabase.properties`
- `application-local.properties`
- Any `application-*.properties` with actual credentials

### ✅ Safe to Commit
- `application.properties` (template values only)
- `application-supabase.properties.template` (template for documentation)
- This migration guide

### Production Deployment
For production environments:
- Use environment variables instead of property files
- Rotate credentials regularly
- Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Enable SSL/TLS for database connections

## Rollback Plan

If you need to rollback to MySQL:

1. **Switch Git branch**
   ```bash
   git checkout main  # Or previous branch before migration
   ```

2. **Restore MySQL connector**
   - Uncomment MySQL dependency in `pom.xml`
   - Comment out PostgreSQL dependency

3. **Restore MySQL configuration**
   ```bash
   # In application.properties
   spring.profiles.active=local
   ```

4. **Clean and rebuild**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/)
- [HikariCP Configuration](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)

## Support

For issues or questions:
1. Check this guide first
2. Review Supabase dashboard for connection issues
3. Check Spring Boot console logs
4. Contact team lead or DevOps

---
**Migration completed**: November 17, 2025  
**Branch**: `db/mysql-to-pg`  
**Status**: ✅ Ready for testing
