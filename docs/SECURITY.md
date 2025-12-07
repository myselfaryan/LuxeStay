# Security Documentation

## Overview

LuxeStay Hub implements multiple layers of security to protect user data, ensure secure authentication, and prevent common web vulnerabilities.

---

## Authentication & Authorization

### JWT-Based Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication.

#### How It Works

1. **User Login:**
   - User submits credentials (email + password)
   - Backend validates credentials
   - If valid, generates JWT token with user info
   - Token returned to client (valid for 7 days)

2. **Subsequent Requests:**
   - Client includes token in Authorization header
   - Backend validates token on each request
   - If valid, request proceeds; if invalid, returns 401

#### Token Structure

```json
{
  "header": {
    "alg": "HS512",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "role": "USER",
    "id": "1",
    "iat": 1699000000,
    "exp": 1699604800
  },
  "signature": "..."
}
```

#### Token Generation

**Backend (JWTUtils.java):**
```java
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim("role", userDetails.getAuthorities())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSigningKey())
        .compact();
}
```

#### Token Validation

**Backend (JWTAuthFilter.java):**
```java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain filterChain) {
    String token = extractTokenFromRequest(request);
    if (token != null && jwtUtils.isTokenValid(token)) {
        String username = jwtUtils.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        // Set authentication in SecurityContext
    }
    filterChain.doFilter(request, response);
}
```

#### Frontend Token Management

**Token Storage:**
```typescript
// Store after login
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
localStorage.setItem('role', response.role);

// Include in requests (ApiService)
private static getHeaders() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
```

---

## Role-Based Access Control (RBAC)

### Roles

The application supports two roles:

1. **USER** - Regular customers
   - Can register and login
   - Can view rooms and availability
   - Can create bookings
   - Can view own booking history
   - Can cancel own bookings
   - Can use AI chatbot

2. **ADMIN** - Hotel managers
   - All USER permissions
   - Can add/update/delete rooms
   - Can view all bookings
   - Can view all users
   - Can cancel any booking
   - Can delete users

### Endpoint Protection

#### Backend (Spring Security)

```java
// Public endpoints (no authentication required)
@GetMapping("/rooms/all")
public ResponseEntity<Response> getAllRooms() { ... }

@PostMapping("/ai/chat")
public ResponseEntity<Response> chat(...) { ... }

// USER or ADMIN required
@PostMapping("/bookings/book-room/{roomId}/{userId}")
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
public ResponseEntity<Response> bookRoom(...) { ... }

// ADMIN only
@PostMapping("/rooms/add")
@PreAuthorize("hasAuthority('ADMIN')")
public ResponseEntity<Response> addRoom(...) { ... }
```

#### Frontend (Route Protection)

```tsx
// Protected route component in App.tsx
const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
```

---

## Password Security

### Hashing Algorithm

**BCrypt** with strength factor of 10

#### Why BCrypt?

- Adaptive algorithm (can increase cost factor over time)
- Built-in salt generation
- Resistant to rainbow table attacks
- Industry standard

#### Implementation

**Registration:**
```java
@Service
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Response register(User user) {
        // Hash password before storing
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return response;
    }
}
```

**Login:**
```java
public Response login(LoginRequest loginRequest) {
    // Spring Security automatically verifies password using BCrypt
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        )
    );
}
```

### Password Requirements

**Recommended requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Input Validation

### Backend Validation

**Using Jakarta Bean Validation:**
```java
@Entity
public class User {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

**Controller Validation:**
```java
@PostMapping("/register")
public ResponseEntity<Response> register(@Valid @RequestBody User user) {
    // @Valid triggers validation
    Response response = userService.register(user);
    return ResponseEntity.status(response.getStatusCode()).body(response);
}
```

### Frontend Validation

```tsx
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateBooking = (booking: Booking): string[] => {
  const errors: string[] = [];
  
  if (!booking.checkInDate) {
    errors.push('Check-in date is required');
  }
  
  if (!booking.checkOutDate) {
    errors.push('Check-out date is required');
  }
  
  if (new Date(booking.checkOutDate) <= new Date(booking.checkInDate)) {
    errors.push('Check-out date must be after check-in date');
  }
  
  return errors;
};
```

---

## CORS Policy

### Configuration

**Backend (CorsConfig.java):**
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
                        "https://your-production-domain.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

### Security Considerations

- Only allow trusted origins
- Avoid using wildcard (`*`) in production
- Set appropriate max age for preflight caching
- Enable credentials only when necessary

---

## SQL Injection Prevention

### Using JPA/Hibernate

JPA automatically uses prepared statements, preventing SQL injection:

```java
// Safe - uses prepared statements
Optional<User> findByEmail(String email);

// Safe - parameterized query
@Query("SELECT u FROM User u WHERE u.email = :email")
User findUserByEmail(@Param("email") String email);
```

### Avoid String Concatenation

```java
// UNSAFE - DO NOT DO THIS
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// SAFE - use parameters
@Query("SELECT u FROM User u WHERE u.email = ?1")
User findByEmail(String email);
```

---

## XSS (Cross-Site Scripting) Prevention

### Backend

**Automatic Escaping:**
- Spring Boot automatically escapes HTML in JSON responses
- Use `@RestController` for API endpoints

### Frontend

**React's Built-in Protection:**
- React automatically escapes values in JSX
- Prevents XSS by default

```tsx
// Safe - React escapes automatically
<div>{userInput}</div>

// UNSAFE - bypasses escaping (avoid)
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

---

## CSRF Protection

### Current Implementation

**Disabled for JWT-based API:**
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http.csrf(AbstractHttpConfigurer::disable);  // Disabled for stateless JWT
    // ...
}
```

### Why Disabled?

- JWT tokens are stored in localStorage (not cookies)
- No automatic cookie transmission
- CSRF attacks target cookie-based sessions
- For JWT APIs, CSRF protection is not needed

---

## File Upload Security

### Cloudinary Integration

**CloudinaryService.java:**
```java
public String uploadImage(MultipartFile photo) {
    try {
        // Validate file type
        String contentType = photo.getContentType();
        if (!isValidImageType(contentType)) {
            throw new OurException("Invalid file type");
        }
        
        // Validate file size
        if (photo.getSize() > MAX_FILE_SIZE) {
            throw new OurException("File too large");
        }
        
        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
            photo.getBytes(),
            ObjectUtils.asMap("resource_type", "image")
        );
        
        return uploadResult.get("secure_url").toString();
        
    } catch (IOException e) {
        throw new OurException("Failed to upload image");
    }
}

private boolean isValidImageType(String contentType) {
    return contentType != null && (
        contentType.equals("image/jpeg") ||
        contentType.equals("image/png") ||
        contentType.equals("image/jpg") ||
        contentType.equals("image/webp")
    );
}
```

### Security Best Practices

1. **Validate file types** - Only allow images
2. **Limit file size** - Prevent DoS attacks
3. **Use Cloudinary's secure URLs** - HTTPS by default
4. **Cloudinary handles transformations** - No local file processing

---

## Payment Security (Stripe)

### Secure Payment Flow

1. **Frontend** requests PaymentIntent from backend
2. **Backend** creates PaymentIntent with Stripe
3. **Backend** returns `clientSecret` to frontend
4. **Frontend** uses Stripe.js to complete payment
5. Card details never touch your servers

**PaymentService.java:**
```java
public PaymentIntent createPaymentIntent(BigDecimal amount) {
    Stripe.apiKey = stripeSecretKey;
    
    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
        .setAmount(amount.multiply(new BigDecimal(100)).longValue())
        .setCurrency("usd")
        .build();
    
    return PaymentIntent.create(params);
}
```

### Security Notes

- Never log or store card details
- Use HTTPS for all payment-related requests
- Use Stripe's test keys for development
- Verify webhook signatures in production

---

## Session Management

### Stateless Architecture

- No server-side sessions
- All state in JWT token
- Reduces server memory usage
- Improves scalability

### Token Expiration

```java
private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        // ...
}
```

### Logout

**Frontend (AuthContext):**
```typescript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  setUser(null);
  setIsAuthenticated(false);
};
```

**Note:** Server-side logout not needed for stateless JWT (token expires automatically)

---

## HTTPS/TLS

### Production Deployment

- **Frontend:** HTTPS via hosting provider (Hostinger, Vercel, etc.)
- **Backend:** HTTPS via reverse proxy (Nginx + Let's Encrypt)
- **Database:** SSL required for connections

### Development

- Local development uses HTTP
- Production must use HTTPS
- Update API URLs accordingly

---

## Environment Variables

### Security Best Practices

1. **Never commit secrets to Git**
2. **Use `.gitignore` for sensitive files**
3. **Use platform environment variables in production**
4. **Rotate secrets regularly**
5. **Use strong, random values**

### Sensitive Variables

```properties
# These should NEVER be in version control
jwt.secret=...
cloudinary.api-secret=...
gemini.api.key=...
stripe.secret.key=...
spring.datasource.password=...
```

---

## API Security

### AI Chat Security

The AI chatbot (Gemini) is configured with a system prompt that:
- Limits responses to hotel-related topics
- Prevents injection attacks via prompt
- Politely redirects off-topic questions

```java
String systemPrompt = "You are the AI Concierge for LuxeStay... " +
    "Do not answer questions unrelated to the hotel.";
```

### Rate Limiting

**Currently not implemented** - recommended for production:

```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 requests per second
}
```

---

## Security Headers

### Recommended Headers

```java
httpResponse.setHeader("X-Frame-Options", "DENY");
httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
httpResponse.setHeader("X-Content-Type-Options", "nosniff");
httpResponse.setHeader("Strict-Transport-Security", 
    "max-age=31536000; includeSubDomains");
```

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled on all services
- [ ] Strong JWT secret (256+ bits)
- [ ] BCrypt password hashing enabled
- [ ] CORS configured for production domains only
- [ ] File upload validation implemented
- [ ] Database SSL connection enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Stripe using production keys
- [ ] Cloudinary secure URLs enabled

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review access logs
- [ ] Monitor failed login attempts
- [ ] Backup database regularly
- [ ] Test disaster recovery plan

---

## Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Isolate affected systems
   - Revoke all JWT tokens (change JWT secret)
   - Reset affected user passwords
   - Review access logs

2. **Investigation:**
   - Identify breach vector
   - Assess data impact
   - Document timeline

3. **Recovery:**
   - Patch vulnerability
   - Restore from clean backup if needed
   - Notify affected users
   - Update security measures

4. **Post-Incident:**
   - Conduct security review
   - Update documentation
   - Implement additional controls
   - Train team on lessons learned

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Stripe Security](https://stripe.com/docs/security)
- [Cloudinary Security](https://cloudinary.com/documentation/security)

---

## Contact

For security issues, please contact the security team directly rather than opening a public issue.

**Author:** Aryan Sharma
