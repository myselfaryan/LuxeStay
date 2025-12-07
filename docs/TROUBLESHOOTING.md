# Troubleshooting Guide

## Overview

This guide helps you diagnose and resolve common issues with the LuxeStay Hub application. Issues are organized by category for easy navigation.

---

## Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Database Issues](#database-issues)
4. [Authentication Issues](#authentication-issues)
5. [External Services Issues](#external-services-issues)
6. [Deployment Issues](#deployment-issues)
7. [Common Error Messages](#common-error-messages)
8. [Debug Logging](#debug-logging)

---

## Backend Issues

### Application Won't Start

**Symptom:** Spring Boot application fails to start

**Common Causes & Solutions:**

1. **Port Already in Use**
   ```
   Error: Web server failed to start. Port 8080 was already in use.
   ```
   
   **Solution:**
   ```bash
   # Find process using port 8080
   lsof -i :8080
   # Kill the process
   kill -9 <PID>
   
   # Or use a different port in application.properties
   server.port=8081
   ```

2. **Database Connection Failed**
   ```
   Error: Unable to acquire JDBC Connection
   ```
   
   **Solution:**
   - Verify PostgreSQL is running: `pg_isready`
   - Check credentials in `application.properties`
   - Ensure database exists: `psql -c "\l" | grep luxestay_db`

3. **Missing Environment Variables**
   ```
   Error: Could not resolve placeholder 'jwt.secret'
   ```
   
   **Solution:**
   - Ensure all required properties are set in `application.properties`
   - Check for typos in property names

4. **Java Version Mismatch**
   ```
   Error: UnsupportedClassVersionError
   ```
   
   **Solution:**
   ```bash
   java -version  # Should be 21+
   # Install Java 21 if needed
   ```

### Maven Build Fails

**Symptom:** `./mvnw clean install` fails

**Solutions:**

1. **Clear Maven Cache**
   ```bash
   rm -rf ~/.m2/repository
   ./mvnw clean install -U
   ```

2. **Skip Tests Temporarily**
   ```bash
   ./mvnw clean install -DskipTests
   ```

3. **Check for Dependency Conflicts**
   ```bash
   ./mvnw dependency:tree
   ```

### API Returns 500 Error

**Symptom:** Internal Server Error on API calls

**Debugging Steps:**

1. Check application logs:
   ```bash
   # If running directly
   tail -f logs/application.log
   
   # If using systemd
   sudo journalctl -u luxestay -f
   ```

2. Enable debug logging in `application.properties`:
   ```properties
   logging.level.com.sanjo.backend=DEBUG
   logging.level.org.springframework.web=DEBUG
   ```

3. Common causes:
   - NullPointerException - check for null values
   - Database constraint violations
   - External service failures (Cloudinary, Gemini, Stripe)

---

## Frontend Issues

### npm install Fails

**Symptom:** Dependency installation errors

**Solutions:**

1. **Clear npm Cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use Different Node Version**
   ```bash
   nvm use 18
   npm install
   ```

3. **Check for Conflicting Dependencies**
   ```bash
   npm ls
   ```

### Vite Dev Server Won't Start

**Symptom:** `npm run dev` fails

**Solutions:**

1. **Port Already in Use**
   ```bash
   # Kill process on port 5173
   lsof -i :5173
   kill -9 <PID>
   
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Missing Dependencies**
   ```bash
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Check for type errors
   npx tsc --noEmit
   ```

### API Calls Failing

**Symptom:** Frontend can't communicate with backend

**Solutions:**

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:8080/rooms/all
   ```

2. **Check API_BASE_URL**
   - Verify `src/constants/index.ts` has correct URL
   - Ensure no trailing slash

3. **CORS Issues** (see [CORS Errors](#cors-errors))

### Blank Page / White Screen

**Symptom:** Application loads but shows nothing

**Solutions:**

1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for JavaScript errors

2. **Check Network Tab**
   - Look for failed API calls
   - Check for 401/403 errors

3. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R

### HashRouter Navigation Issues

**Symptom:** Routes not working correctly

**Solutions:**

1. **Verify Router Setup**
   - App.tsx should use `HashRouter`
   - URLs should include `#` (e.g., `/#/rooms`)

2. **Check Route Definitions**
   - Ensure all routes are defined in App.tsx
   - Check for typos in path names

---

## Database Issues

### Connection Timeout

**Symptom:** Database queries take too long or timeout

**Solutions:**

1. **Check Database Status**
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql
   
   # Check connections
   psql -c "SELECT count(*) FROM pg_stat_activity;"
   ```

2. **Increase Connection Pool**
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.connection-timeout=60000
   ```

3. **Check for Long-Running Queries**
   ```sql
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
   ```

### Schema Not Created

**Symptom:** Tables don't exist

**Solutions:**

1. **Check JPA Configuration**
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```

2. **Manual Schema Creation**
   - Run SQL scripts from DATABASE_SCHEMA.md

3. **Check Entity Annotations**
   - Ensure `@Entity` and `@Table` are present

### Data Not Persisting

**Symptom:** Data disappears after restart

**Solutions:**

1. **Check Transaction Management**
   - Ensure `@Transactional` on service methods

2. **Verify Database URL**
   - Not using in-memory database accidentally

3. **Check for Rollbacks**
   - Look for exceptions causing rollbacks in logs

---

## Authentication Issues

### Login Fails with Valid Credentials

**Symptom:** 401 Unauthorized on login

**Solutions:**

1. **Check Password Encoding**
   - Passwords must be BCrypt hashed in database
   - Raw passwords won't work

2. **Verify User Exists**
   ```sql
   SELECT * FROM users WHERE email = 'user@example.com';
   ```

3. **Check Password Match**
   - Use BCrypt online tool to verify hash

### JWT Token Invalid

**Symptom:** 401/403 on authenticated requests

**Solutions:**

1. **Check Token Expiration**
   - Tokens expire after 7 days
   - Log out and log back in

2. **Verify Token Format**
   - Must be `Bearer <token>` in header
   - No extra spaces

3. **Check JWT Secret**
   - Same secret must be used for generation and validation

### Access Denied (403 Forbidden)

**Symptom:** User gets 403 on certain endpoints

**Solutions:**

1. **Check User Role**
   ```sql
   SELECT role FROM users WHERE email = 'user@example.com';
   ```

2. **Verify Endpoint Permissions**
   - Check `@PreAuthorize` annotations
   - Admin endpoints require ADMIN role

3. **Frontend Role Check**
   - Verify role is stored correctly in localStorage

### Session/Token Lost

**Symptom:** User gets logged out unexpectedly

**Solutions:**

1. **Check localStorage**
   - Open DevTools → Application → Local Storage
   - Verify token exists

2. **Check for Errors**
   - API errors might clear auth state

3. **Token Expiration**
   - Token might have expired

---

## External Services Issues

### Cloudinary Upload Fails

**Symptom:** Image upload returns error

**Solutions:**

1. **Verify API Credentials**
   ```properties
   cloudinary.cloud-name=correct_name
   cloudinary.api-key=correct_key
   cloudinary.api-secret=correct_secret
   ```

2. **Check File Size**
   - Default limit is 10MB
   - Large files may timeout

3. **Check File Type**
   - Only images allowed (jpg, png, webp)

4. **Network Issues**
   - Verify internet connectivity
   - Check Cloudinary status page

### Gemini AI Not Responding

**Symptom:** AI chat returns errors

**Solutions:**

1. **Verify API Key**
   ```properties
   gemini.api.key=valid_key
   ```

2. **Check API Quota**
   - Free tier has rate limits
   - Check Google AI Studio dashboard

3. **Network Issues**
   - Verify connectivity to Google APIs

4. **Model Availability**
   - Gemini model might be updated
   - Check model name in GeminiService

### Stripe Payment Fails

**Symptom:** Payment intent creation fails

**Solutions:**

1. **Verify API Key**
   ```properties
   stripe.secret.key=sk_test_xxxxx
   ```

2. **Check Key Type**
   - Use test keys for development
   - Use live keys for production

3. **Amount Validation**
   - Amount must be positive
   - Check currency format

4. **Stripe Dashboard**
   - Check for errors in Stripe dashboard

---

## Deployment Issues

### Application Crashes on Startup

**Symptom:** Deployed app won't start

**Solutions:**

1. **Check Logs**
   ```bash
   # Systemd
   sudo journalctl -u luxestay -n 100
   
   # Docker
   docker logs luxestay-backend
   ```

2. **Verify Environment Variables**
   - All required variables must be set
   - No placeholder values

3. **Memory Issues**
   - Increase JVM heap size
   - Check available RAM

### CORS Errors

**Symptom:** Browser blocks API requests

```
Access to fetch at 'http://api.example.com' from origin 'http://frontend.example.com' 
has been blocked by CORS policy
```

**Solutions:**

1. **Update CorsConfig.java**
   ```java
   .allowedOrigins(
       "http://localhost:5173",
       "https://your-frontend-domain.com"
   )
   ```

2. **Redeploy Backend**
   - CORS changes require restart

3. **Check Preflight**
   - Ensure OPTIONS method is allowed

### SSL/HTTPS Issues

**Symptom:** HTTPS not working or mixed content

**Solutions:**

1. **Verify Certificates**
   ```bash
   sudo certbot certificates
   ```

2. **Renew Certificates**
   ```bash
   sudo certbot renew
   ```

3. **Update API URL**
   - Frontend must use `https://` for API calls

### Static Files Not Loading

**Symptom:** CSS/JS 404 errors

**Solutions:**

1. **Check Build Output**
   - Vite outputs to `dist/` folder
   - Ensure all files are uploaded

2. **Check Base URL**
   - HashRouter handles routing client-side

3. **Server Configuration**
   - Serve index.html for all routes

---

## Common Error Messages

### "Room not available for selected dates"

**Cause:** Room already booked for those dates

**Solution:**
- Choose different dates
- Check room availability calendar
- Try a different room

### "Invalid email or password"

**Cause:** Credentials don't match

**Solution:**
- Check for typos
- Reset password if forgotten
- Verify email is registered

### "User not found"

**Cause:** User doesn't exist in database

**Solution:**
- Register a new account
- Check email spelling

### "Token has expired"

**Cause:** JWT token expired (after 7 days)

**Solution:**
- Log out and log back in
- Token will be refreshed on login

### "Failed to upload image"

**Cause:** Cloudinary upload issue

**Solution:**
- Check file size (< 10MB)
- Verify file is an image
- Check Cloudinary credentials

---

## Debug Logging

### Enable Debug Mode

**Backend (application.properties):**
```properties
# General debug
logging.level.root=DEBUG

# Specific packages
logging.level.com.sanjo.backend=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

**Frontend:**
```typescript
// Add console logs in ApiService
console.log('Request:', endpoint, body);
console.log('Response:', response);
```

### View Logs

**Local Development:**
- Backend: Console output
- Frontend: Browser DevTools Console

**Production:**
```bash
# Systemd
sudo journalctl -u luxestay -f

# Docker
docker logs -f luxestay-backend

# File logs
tail -f /var/log/luxestay/application.log
```

---

## Preventive Measures

### Regular Maintenance

1. **Update Dependencies**
   ```bash
   # Backend
   ./mvnw versions:display-dependency-updates
   
   # Frontend
   npm outdated
   ```

2. **Monitor Application Health**
   - Set up health checks
   - Monitor error rates
   - Track response times

3. **Database Maintenance**
   ```sql
   -- Analyze tables
   ANALYZE;
   
   -- Vacuum to reclaim space
   VACUUM ANALYZE;
   ```

### Backup Strategy

1. **Database Backups**
   ```bash
   pg_dump luxestay_db > backup_$(date +%Y%m%d).sql
   ```

2. **Test Restore Procedure**
   - Regularly test backup restoration

---

## Getting Help

If you can't resolve an issue:

1. **Search Existing Issues**
   - Check GitHub issues for similar problems

2. **Gather Information**
   - Error messages
   - Log excerpts
   - Steps to reproduce

3. **Create an Issue**
   - Use the bug report template
   - Include all relevant details

4. **Community Support**
   - GitHub Discussions
   - Stack Overflow (tag: spring-boot, react)

---

**Last Updated:** 2025-12-08

**Author:** Aryan Sharma
