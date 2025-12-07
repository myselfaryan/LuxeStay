# Deployment Guide

## Overview

This guide covers deploying the LuxeStay Hub application to production. The recommended production setup uses:

- **Frontend:** Static hosting (Hostinger, Vercel, Netlify)
- **Backend:** VPS or Cloud hosting (Hostinger VPS, Render, Railway)
- **Database:** PostgreSQL (managed or self-hosted)
- **Image Storage:** Cloudinary
- **Payments:** Stripe
- **AI:** Google Gemini API

---

## Prerequisites

- GitHub account with repository access
- Hosting account (Hostinger, Vercel, Render, etc.)
- PostgreSQL database access
- Cloudinary account
- Stripe account
- Google AI Studio account (for Gemini API)

---

## Database Deployment

### Option 1: Managed PostgreSQL (Recommended)

**NeonDB (Free tier available):**
1. Visit [NeonDB Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a name: `luxestay-hub`
4. Select region (choose closest to your backend deployment)
5. Note down the connection details

**Supabase:**
1. Visit [Supabase](https://supabase.com/)
2. Create a new project
3. Get PostgreSQL connection string from Settings → Database

### Option 2: Self-hosted PostgreSQL

If using a VPS, install PostgreSQL:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE luxestay_db;
CREATE USER luxestay_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE luxestay_db TO luxestay_user;
```

### Connection String Format

```
jdbc:postgresql://hostname:5432/luxestay_db?sslmode=require
```

---

## Cloudinary Setup

### 1. Create Cloudinary Account

1. Sign up at https://cloudinary.com/
2. Verify your email
3. Navigate to Dashboard

### 2. Get API Credentials

From the Cloudinary Dashboard, note:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Configure Upload Preset (Optional)

For additional security, create an upload preset:
1. Go to Settings → Upload
2. Create a new unsigned upload preset
3. Configure allowed formats (jpg, png, webp)

---

## Backend Deployment

### Option 1: Hostinger VPS

#### 1. Prepare Your VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install openjdk-21-jdk -y

# Verify installation
java -version
```

#### 2. Upload Your Application

Build the JAR file locally:
```bash
cd backend
./mvnw clean package -DskipTests
```

Upload to VPS:
```bash
scp target/*.jar user@your-vps-ip:/home/user/app/
```

#### 3. Create Environment File

Create `/home/user/app/.env`:
```bash
# Database
DB_URL=jdbc:postgresql://your-db-host:5432/luxestay_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_production_jwt_secret_256_bits_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_key

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
```

#### 4. Create Systemd Service

Create `/etc/systemd/system/luxestay.service`:
```ini
[Unit]
Description=LuxeStay Hub Backend
After=network.target

[Service]
User=user
WorkingDirectory=/home/user/app
ExecStart=/usr/bin/java -jar /home/user/app/backend-0.0.1-SNAPSHOT.jar
EnvironmentFile=/home/user/app/.env
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 5. Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable luxestay
sudo systemctl start luxestay
sudo systemctl status luxestay
```

#### 6. Configure Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 7. Enable HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile (Already in project)

```dockerfile
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 2. Build and Run

```bash
# Build JAR
./mvnw clean package -DskipTests

# Build Docker image
docker build -t luxestay-backend .

# Run container
docker run -d \
  --name luxestay-backend \
  -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host:5432/luxestay_db \
  -e DB_USER=user \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=your_secret \
  -e CLOUDINARY_CLOUD_NAME=your_cloud \
  -e CLOUDINARY_API_KEY=your_key \
  -e CLOUDINARY_API_SECRET=your_secret \
  -e GEMINI_API_KEY=your_gemini_key \
  -e STRIPE_SECRET_KEY=your_stripe_key \
  luxestay-backend
```

### Option 3: Render (Easy Deployment)

1. Log in to [Render](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `luxestay-backend`
   - **Environment:** Docker
   - **Region:** Choose appropriate region
   - **Branch:** `main`
   - **Root Directory:** `backend`
5. Add environment variables
6. Deploy

---

## Frontend Deployment

### Option 1: Hostinger

#### 1. Build the Frontend

```bash
cd frontend
npm install
npm run build
```

#### 2. Update API URL

Before building, update `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'https://api.yourdomain.com';
```

#### 3. Upload to Hostinger

Upload the contents of `dist/` folder to your Hostinger file manager or via FTP.

#### 4. Configure for SPA (HashRouter)

Since the app uses HashRouter, no special server configuration is needed. All routes work with `index.html`.

### Option 2: Vercel

1. Log in to [Vercel](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Deploy

### Option 3: Netlify

1. Log in to [Netlify](https://netlify.com/)
2. Drag and drop `dist/` folder
3. Or connect to GitHub for automatic deployments

---

## Post-Deployment Configuration

### 1. Update CORS Configuration

Update `backend/src/main/java/com/sanjo/backend/config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "https://yourdomain.com",
                            "https://www.yourdomain.com"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

### 2. Test the Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Login with the user
4. Browse rooms
5. Test AI chatbot
6. Create a booking (with Stripe test keys)
7. Test admin functions (if you have admin access)

---

## Environment Variables Summary

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `spring.datasource.url` | Database URL | `jdbc:postgresql://host:5432/db` |
| `spring.datasource.username` | DB username | `postgres` |
| `spring.datasource.password` | DB password | `secure_password` |
| `jwt.secret` | JWT signing key | `long_random_string` |
| `cloudinary.cloud-name` | Cloudinary cloud | `my-cloud` |
| `cloudinary.api-key` | Cloudinary key | `123456789` |
| `cloudinary.api-secret` | Cloudinary secret | `abcdefghijk` |
| `gemini.api.key` | Gemini API key | `AIzaSy...` |
| `stripe.secret.key` | Stripe secret | `sk_live_...` |

### Frontend

Update in `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'https://api.yourdomain.com';
```

---

## Monitoring and Maintenance

### Application Logs

**Systemd:**
```bash
sudo journalctl -u luxestay -f
```

**Docker:**
```bash
docker logs -f luxestay-backend
```

### Health Check

Create a simple health endpoint check:
```bash
curl https://api.yourdomain.com/rooms/all
```

### Database Backup

```bash
# Backup
pg_dump -h hostname -U username -d luxestay_db > backup_$(date +%Y%m%d).sql

# Restore
psql -h hostname -U username -d luxestay_db < backup.sql
```

---

## Security Checklist

- [ ] HTTPS enabled on all services
- [ ] Strong JWT secret (256+ bits)
- [ ] Database password is secure and not committed
- [ ] CORS configured for production domains only
- [ ] Stripe using production keys (sk_live_)
- [ ] All API keys secured as environment variables
- [ ] Regular backups configured

---

## Troubleshooting

### Backend Not Starting

1. Check logs: `sudo journalctl -u luxestay -n 100`
2. Verify database connection
3. Ensure all environment variables are set

### CORS Errors

1. Verify frontend domain is in allowed origins
2. Check if backend is actually running
3. Try clearing browser cache

### Database Connection Issues

1. Verify database is running
2. Check connection string format
3. Ensure SSL mode is correct
4. Verify firewall allows connection

### Cloudinary Upload Fails

1. Verify API credentials
2. Check file size limits
3. Ensure file format is supported

### Stripe Payment Fails

1. Verify using correct keys (test vs live)
2. Check Stripe dashboard for error logs
3. Ensure webhook endpoints are configured (if used)

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Run multiple backend instances
- Use sticky sessions or stateless JWT

### Database Scaling

- Enable connection pooling (HikariCP configured by default)
- Add read replicas for heavy read workloads
- Consider database caching (Redis)

### CDN

- Use Cloudinary's built-in CDN for images
- Consider CDN for static frontend assets

---

## Deployment Checklist

- [ ] Database deployed and accessible
- [ ] Cloudinary account configured
- [ ] Stripe account configured (with correct keys)
- [ ] Gemini API key obtained
- [ ] Backend deployed with all environment variables
- [ ] Frontend built with production API URL
- [ ] Frontend deployed to hosting
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Monitoring set up

---

Congratulations! Your LuxeStay Hub application is now deployed to production! 🎉
