# 🚀 Quick Start - Deploy to Render in 10 Minutes

Fast deployment guide for Glyzier on Render.com

## Prerequisites

✅ Supabase PostgreSQL database (already set up)  
✅ GitHub repository access  
✅ Render.com account (free tier works!)

---

## Step 1: Create Web Service (2 minutes)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub: `seeudev/CSIT321-G7-glyzier`

**Service Configuration:**
```
Name:           glyzier
Region:         Oregon (US West)
Branch:         main
Root Directory: glyzier-backend
Runtime:        Java
Build Command:  ./mvnw clean package -DskipTests
Start Command:  java -jar target/glyzier-backend-0.0.1-SNAPSHOT.jar
Instance:       Free
```

---

## Step 2: Set Environment Variables (3 minutes)

Go to **Environment** tab and add these variables:

### Database (Replace with your Supabase credentials)
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://db.YOUR_PROJECT.supabase.co:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.YOUR_PROJECT
SPRING_DATASOURCE_PASSWORD=your_supabase_password
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
```

### JWT Security
```bash
JWT_SECRET=CHANGE_THIS_TO_YOUR_SECURE_RANDOM_SECRET_KEY_64_CHARS_MIN
JWT_EXPIRATION=86400000
```

### Application
```bash
SPRING_PROFILES_ACTIVE=supabase
SPRING_APPLICATION_NAME=glyzier
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

### Performance (Optional)
```bash
JAVA_TOOL_OPTIONS=-Xmx400m -Xms200m
SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
```

---

## Step 3: Deploy (5 minutes)

1. Click **"Create Web Service"**
2. Wait for build (watch Logs tab)
3. Look for: `BUILD SUCCESS` → `Started GlyzierApplication`
4. Status changes to **"Live"** ✅

Your app is now live at: `https://glyzier.onrender.com`

---

## Step 4: Test Deployment (2 minutes)

### Test API
```bash
curl https://glyzier.onrender.com/api/products
```

### Test Frontend
Visit: `https://glyzier.onrender.com`

1. Register new account
2. Browse products
3. Test messaging

---

## 🎉 That's It!

Your full-stack app is deployed:
- ✅ Spring Boot backend serving REST API
- ✅ React frontend (built and served from backend)
- ✅ PostgreSQL database (Supabase)
- ✅ JWT authentication
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push

---

## 🔧 Common Issues

### Build Fails?
- Check Java version: Should be 17+
- Verify build command includes `-DskipTests`
- Check Render logs for specific error

### Can't Connect to Database?
- Use port **6543** (Connection Pooler), not 5432
- Add `?sslmode=require` to database URL
- Verify credentials in Supabase dashboard

### Frontend Shows 404?
- Wait for full build completion
- Check logs for `npm run build` success
- Clear browser cache

### Service Spins Down?
- **Free tier**: Spins down after 15 min inactivity
- First request takes 30-60 seconds (cold start)
- Upgrade to paid tier for always-on ($7/mo)

---

## 📚 Full Documentation

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for complete guide including:
- Detailed environment variable explanations
- Performance optimization
- Security checklist
- Advanced troubleshooting
- Monitoring and maintenance

---

**Need Help?** Check Render logs first, then review the full deployment guide.

**Happy Deploying! 🚀**
