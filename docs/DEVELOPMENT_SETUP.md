# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements

- **Java Development Kit (JDK) 21** or higher
  - Download from: https://adoptium.net/
  - Verify installation: `java -version`

- **Maven 3.6+** (included with the project wrapper)
  - Verify installation: `./mvnw -version`

- **PostgreSQL 12+** (for local development)
  - Download from: https://www.postgresql.org/download/
  - Alternative: Use Docker for PostgreSQL

### Frontend Requirements

- **Node.js 18+** and **npm 9+**
  - Download from: https://nodejs.org/
  - Verify installation: 
    ```bash
    node -v
    npm -v
    ```

### Optional Tools

- **Git** - Version control
- **Docker** - For containerized PostgreSQL
- **Postman** or **Insomnia** - API testing
- **VS Code** or **IntelliJ IDEA** - Code editors

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/myselfaryan/LuxeStay-Hub.git
cd LuxeStay-Hub
```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Configure Environment Variables

Create or update `application.properties` in `backend/src/main/resources/`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/luxestay_db
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_256_bits
jwt.expiration=604800000

# Cloudinary Configuration
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# Google Gemini AI Configuration
gemini.api.key=your_gemini_api_key

# Stripe Payment Configuration
stripe.secret.key=your_stripe_secret_key
```

### 3. Set Up Local Database

#### Option A: Using PostgreSQL directly

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE luxestay_db;
   ```
3. Update `application.properties` with your PostgreSQL credentials

#### Option B: Using Docker

```bash
docker run --name luxestay-postgres \
  -e POSTGRES_DB=luxestay_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:14
```

Or use the provided docker-compose:
```bash
docker-compose up -d
```

### 4. Build the Project

```bash
./mvnw clean install
```

This will:
- Download dependencies
- Compile the code
- Run tests
- Create executable JAR

### 5. Run the Application

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify the backend is running:**
```bash
curl http://localhost:8080/rooms/all
```

### 6. Database Schema

Spring Boot will automatically:
1. Create the database schema on first run using JPA/Hibernate
2. Apply any pending migrations

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`.

### 3. Configure API Base URL

The API base URL is configured in `src/constants/index.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8080';
```

For production, update this to your deployed backend URL.

### 4. Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port).

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

Build output will be in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

---

## Running Tests

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Development Workflow

### 1. Starting the Full Application

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Making Changes

- **Backend changes:** Spring Boot DevTools will auto-reload (if included in dependencies)
- **Frontend changes:** Vite HMR provides instant updates

### 3. API Testing

Use the following test credentials after creating accounts:

**Demo User:**
- Email: `user@example.com`
- Password: `password123`
- Role: USER

**Demo Admin:**
Create an admin user by registering and then manually updating the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your_admin@email.com';
```

---

## Common Development Tasks

### Adding a New Entity

1. Create entity class in `backend/src/main/java/com/sanjo/backend/entity/`
2. Create repository interface in `repository/`
3. Create DTO class in `dto/`
4. Create service interface in `service/interfac/`
5. Create service implementation in `service/implementation/`
6. Create controller endpoints in `controller/`
7. Add TypeScript types in `frontend/src/types/`
8. Create API service functions in `apiService.ts`
9. Build UI components

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Navbar.tsx`
4. Create necessary API calls

### Adding a New API Endpoint

1. Add method to appropriate controller
2. Implement business logic in service
3. Add corresponding frontend API method
4. Update API documentation

---

## External Services Setup

### Cloudinary (Image Storage)

1. Create account at https://cloudinary.com/
2. Get your cloud name, API key, and API secret from the dashboard
3. Add to `application.properties`:
   ```properties
   cloudinary.cloud-name=your_cloud_name
   cloudinary.api-key=your_api_key
   cloudinary.api-secret=your_api_secret
   ```

### Google Gemini AI

1. Get API key from https://ai.google.dev/
2. Add to `application.properties`:
   ```properties
   gemini.api.key=your_gemini_api_key
   ```

### Stripe Payments

1. Create account at https://stripe.com/
2. Get your secret key from the dashboard (use test key for development)
3. Add to `application.properties`:
   ```properties
   stripe.secret.key=sk_test_xxxxxxxxxxxx
   ```

---

## Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

**Problem:** Database connection failed
- Verify PostgreSQL is running
- Check database credentials in `application.properties`
- Ensure database exists: `CREATE DATABASE luxestay_db;`

**Problem:** JWT token errors
- Ensure `jwt.secret` is set in `application.properties`
- Secret should be at least 256 bits (32 characters)

**Problem:** Maven build fails
```bash
# Clean and rebuild
./mvnw clean install -U
```

**Problem:** Cloudinary/Gemini/Stripe errors
- Verify API keys are correct
- Check internet connectivity
- Review service-specific error messages in logs

### Frontend Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**Problem:** Port 5173 already in use
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

**Problem:** API calls failing
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify API_BASE_URL in `constants/index.ts`

**Problem:** TypeScript errors
```bash
# Check for type errors
npm run build
```

---

## IDE Configuration

### IntelliJ IDEA

1. Open the `backend` folder as a Maven project
2. Enable annotation processing for Lombok:
   - Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check "Enable annotation processing"
3. Install Lombok plugin

### VS Code

**Recommended Extensions:**
- Language Support for Java
- Spring Boot Extension Pack
- Lombok Annotations Support
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Vite

**Backend Configuration:**
Create `.vscode/settings.json`:
```json
{
  "java.configuration.updateBuildConfiguration": "automatic",
  "spring-boot.ls.java.home": "/path/to/jdk-21"
}
```

---

## Environment Variables Reference

### Backend (application.properties)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| spring.datasource.url | PostgreSQL connection URL | Yes | jdbc:postgresql://localhost:5432/luxestay_db |
| spring.datasource.username | Database username | Yes | postgres |
| spring.datasource.password | Database password | Yes | mypassword |
| jwt.secret | Secret key for JWT tokens | Yes | my_secret_key_256_bits_long |
| cloudinary.cloud-name | Cloudinary cloud name | Yes | my-cloud |
| cloudinary.api-key | Cloudinary API key | Yes | 123456789 |
| cloudinary.api-secret | Cloudinary API secret | Yes | abcdefghijk |
| gemini.api.key | Google Gemini API key | Yes | AIzaSy... |
| stripe.secret.key | Stripe secret key | Yes | sk_test_... |

### Frontend

| Variable | Description | File |
|----------|-------------|------|
| API_BASE_URL | Backend API URL | src/constants/index.ts |

---

## Next Steps

After setting up the development environment:

1. Review the [API Documentation](./API_DOCUMENTATION.md)
2. Understand the [Architecture](./ARCHITECTURE.md)
3. Check [Contributing Guidelines](./CONTRIBUTING.md)
4. Explore the codebase and start developing!

---

## Getting Help

- Check existing issues on GitHub
- Review troubleshooting section
- Contact the development team
- Consult Spring Boot, React, and Vite documentation

Happy coding! 🚀
