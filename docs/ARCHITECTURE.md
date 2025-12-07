# Architecture Documentation

## Overview

LuxeStay Hub is a full-stack hotel management and booking platform built using modern web technologies. The application follows a three-tier architecture pattern with clear separation between presentation, business logic, and data layers.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Components │ TypeScript │ React Router (Hash)  │  │
│  │  Custom CSS │ Fetch API │ Context API                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↕ HTTP/REST                        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controllers (REST Endpoints)                         │  │
│  │         ↕                                             │  │
│  │  Services (Business Logic)                            │  │
│  │         ↕                                             │  │
│  │  Repositories (Data Access)                           │  │
│  │         ↕                                             │  │
│  │  Entities (JPA Models)                                │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Security (JWT + Spring Security)                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          ↕                ↕                    ↕
┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
│   PostgreSQL     │ │  Cloudinary  │ │  External APIs  │
│   (Database)     │ │  (Images)    │ │ Stripe, Gemini  │
└──────────────────┘ └──────────────┘ └─────────────────┘
```

---

## Backend Architecture

### Technology Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 21
- **Build Tool:** Maven
- **ORM:** Spring Data JPA (Hibernate)
- **Database:** PostgreSQL
- **Security:** Spring Security + JWT
- **Image Storage:** Cloudinary
- **Payments:** Stripe API
- **AI Integration:** Google Gemini API
- **Password Encryption:** BCrypt

### Layer Structure

#### 1. Controller Layer

**Location:** `src/main/java/com/sanjo/backend/controller/`

Controllers handle HTTP requests and responses. They are responsible for:
- Request validation
- Delegating business logic to services
- Returning appropriate HTTP responses

**Controllers:**
- `AuthController` - User authentication (login, register)
- `RoomController` - Room management operations
- `BookingController` - Booking operations
- `UserController` - User management
- `ChatController` - AI chatbot endpoints (Gemini)
- `PaymentController` - Stripe payment processing

**Key Annotations:**
```java
@RestController
@RequestMapping("/endpoint")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE')")
```

#### 2. Service Layer

**Location:** `src/main/java/com/sanjo/backend/service/`

Services contain the business logic. They:
- Process data from controllers
- Interact with repositories
- Handle complex operations
- Implement business rules

**Structure:**
- `interfac/` - Service interfaces
- `implementation/` - Service implementations

**Services:**
- `UserService` - User management logic
- `RoomService` - Room management logic
- `BookingService` - Booking management logic
- `CloudinaryService` - Cloudinary image upload integration
- `GeminiService` - Google Gemini AI chat integration
- `PaymentService` - Stripe payment processing

#### 3. Repository Layer

**Location:** `src/main/java/com/sanjo/backend/repository/`

Repositories handle database operations using Spring Data JPA:
- CRUD operations
- Custom queries
- Database transactions

**Repositories:**
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByRoomType(String roomType);
}

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingConfirmationCode(String code);
}
```

#### 4. Entity Layer

**Location:** `src/main/java/com/sanjo/backend/entity/`

Entities represent database tables:
- `User` - User information and authentication
- `Room` - Room details and pricing
- `Booking` - Booking information

**Relationships:**
- User → Bookings (One-to-Many)
- Room → Bookings (One-to-Many)
- Booking → User (Many-to-One)
- Booking → Room (Many-to-One)

```java
@Entity
@Table(name = "room")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private String roomType;
    private BigDecimal roomPrice;
    private String roomPhotoUrl;
    private String roomDescription;
    
    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
```

#### 5. Security Layer

**Location:** `src/main/java/com/sanjo/backend/security/`

Security components:
- `JWTUtils` - JWT token generation and validation
- `JWTAuthFilter` - Request authentication filter
- `CustomUserDetailsService` - User authentication service
- `Utils` - Security utility functions

**Security Flow:**
1. User sends credentials to `/auth/login`
2. Backend validates credentials
3. JWT token generated and returned
4. Client includes token in subsequent requests
5. `JWTAuthFilter` validates token for each request

#### 6. DTO Layer

**Location:** `src/main/java/com/sanjo/backend/dto/`

Data Transfer Objects for API communication:
- `Response` - Standard API response wrapper
- `UserDTO` - User data transfer
- `RoomDTO` - Room data transfer
- `BookingDTO` - Booking data transfer
- `LoginRequest` - Login credentials

#### 7. Configuration

**Location:** `src/main/java/com/sanjo/backend/config/`

Configuration classes:
- `CorsConfig` - CORS policy configuration

---

## Frontend Architecture

### Technology Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router DOM 6+ (HashRouter)
- **HTTP Client:** Fetch API (ApiService class)
- **Styling:** Custom CSS
- **Icons:** Lucide React
- **State Management:** React Context API

### Project Structure

```
frontend/src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── RoomCard.tsx
│   ├── Chatbot.tsx
│   └── ConfirmationModal.tsx
├── component/        # Feature-specific components
│   └── common/
│       └── PaymentPage.tsx
├── pages/            # Page components (routes)
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AllRooms.tsx
│   ├── RoomDetails.tsx
│   ├── FindMyRoom.tsx
│   ├── FindBooking.tsx
│   ├── Profile.tsx
│   ├── BookingSuccess.tsx
│   └── admin/
│       ├── ManageRooms.tsx
│       ├── ManageBookings.tsx
│       └── ManageUsers.tsx
├── services/         # API integration layer
│   └── apiService.ts
├── context/          # React Context providers
│   └── AuthContext.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── constants/        # App constants
│   └── index.ts
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

### Component Structure

#### Pages

**Location:** `src/pages/`

Page components represent different routes:
- `Home.tsx` - Landing page with featured rooms
- `AllRooms.tsx` - Browse all rooms
- `RoomDetails.tsx` - View room details and book
- `FindMyRoom.tsx` - AI-powered room finder
- `FindBooking.tsx` - Search bookings by confirmation code
- `Login.tsx` - User login
- `Register.tsx` - User registration
- `Profile.tsx` - User profile and booking history
- `BookingSuccess.tsx` - Booking confirmation page
- `admin/ManageRooms.tsx` - Admin room management
- `admin/ManageBookings.tsx` - Admin booking management
- `admin/ManageUsers.tsx` - Admin user management

#### Components

**Location:** `src/components/`

Reusable components:
- `Navbar.tsx` - Navigation bar with auth state
- `Footer.tsx` - Page footer
- `RoomCard.tsx` - Room display card
- `Chatbot.tsx` - AI Concierge floating chatbot
- `ConfirmationModal.tsx` - Confirmation dialogs

#### Services

**Location:** `src/services/apiService.ts`

Centralized API integration using Fetch API:

```typescript
export class ApiService {
  private static getHeaders(isMultipart = false) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  // Authentication
  static async login(data: any) { ... }
  static async register(data: any) { ... }

  // Rooms
  static async getAllRooms() { ... }
  static async getRoomById(roomId: string) { ... }
  static async getAvailableRoomsByDateAndType(...) { ... }

  // Bookings
  static async bookRoom(roomId: number, userId: number, bookingData: any) { ... }
  static async getBookingByConfirmationCode(code: string) { ... }

  // AI Chat
  static async sendChatMessage(message: string) { ... }
  static async getRoomRecommendations(query: string) { ... }
}
```

#### Context

**Location:** `src/context/AuthContext.tsx`

Authentication context for managing user state:
- `isAuthenticated` - Login status
- `isAdmin` - Admin role check
- `user` - Current user data
- `login/logout` - Auth actions

#### Types

**Location:** `src/types/index.ts`

TypeScript interfaces for type safety:
- API responses
- User, Room, Booking models
- Request/Response types

### Routing

React Router configuration in `App.tsx` using **HashRouter**:

```typescript
Routes:
  /                    - Home (public)
  /rooms               - Browse all rooms (public)
  /rooms/:roomId       - Room details (public)
  /find-my-room        - AI room finder (public)
  /find-booking        - Find booking (public)
  /login               - Login (public)
  /register            - Register (public)
  /profile             - User profile (protected)
  /payment             - Payment page (protected)
  /booking-success     - Booking confirmation (protected)
  /admin/rooms         - Manage rooms (admin only)
  /admin/bookings      - Manage bookings (admin only)
  /admin/users         - Manage users (admin only)
```

---

## Database Schema

### Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL
);
```

#### Rooms Table
```sql
CREATE TABLE room (
    id BIGSERIAL PRIMARY KEY,
    room_type VARCHAR(100) NOT NULL,
    room_price DECIMAL(10,2) NOT NULL,
    room_photo_url TEXT,
    room_description TEXT
);
```

#### Bookings Table
```sql
CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_of_adults INT NOT NULL,
    num_of_children INT NOT NULL,
    total_num_of_guest INT NOT NULL,
    booking_confirmation_code VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    room_id BIGINT REFERENCES room(id)
);
```

---

## Security Architecture

### Authentication Flow

1. **Registration:**
   - User submits registration form
   - Password hashed with BCrypt
   - User stored in database with USER role

2. **Login:**
   - User submits credentials
   - Backend validates credentials
   - JWT token generated with user details and role
   - Token returned to client (valid for 7 days)

3. **Authorization:**
   - Client includes token in Authorization header
   - `JWTAuthFilter` intercepts requests
   - Token validated and user authenticated
   - Role-based access control enforced

### Role-Based Access Control

**Roles:**
- `USER` - Regular customers (can book rooms, view profile)
- `ADMIN` - Hotel managers (full access to all operations)

**Access Patterns:**
```java
@PreAuthorize("hasAuthority('ADMIN')")          // Admin only
@PreAuthorize("hasAuthority('USER')")           // User only
@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')") // Both
```

### Password Security

- Passwords hashed using BCrypt
- Salt automatically generated per password
- Never stored or transmitted in plain text

---

## Cloud Services Integration

### Cloudinary

**Purpose:** Store and serve room images

**Implementation:**
- `CloudinaryService` handles image operations
- Upload images during room creation/update
- Return public URLs for frontend display
- Automatic optimization and transformations

**Configuration:**
```properties
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

### Stripe

**Purpose:** Secure payment processing

**Implementation:**
- `PaymentService` handles payment operations
- Create PaymentIntent for booking payments
- Return client secret for frontend processing
- Webhook handling for payment confirmation

**Configuration:**
```properties
stripe.secret.key=your_stripe_secret_key
```

### Google Gemini API

**Purpose:** AI-powered concierge and room recommendations

**Implementation:**
- `GeminiService` handles AI interactions
- Chat endpoint for guest queries
- Room recommendation based on natural language
- Context-aware responses about hotel amenities

**Configuration:**
```properties
gemini.api.key=your_gemini_api_key
```

---

## Deployment Architecture

### Frontend

- Built with Vite for optimized production bundle
- Static file hosting
- CDN distribution
- HTTPS enabled

### Backend

- Spring Boot JAR deployment
- Container-based deployment (Docker support)
- Environment-based configuration
- Health checks

### Database

- PostgreSQL database
- Connection pooling
- SSL connections

---

## API Communication

### Request/Response Flow

```
Frontend → API Request → Backend Controller
                    ↓
                Service Layer (Business Logic)
                    ↓
                Repository (Database Query)
                    ↓
                Database Response
                    ↓
                Service Processing
                    ↓
Frontend ← API Response ← Controller
```

### Response Format

All API responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "message": "Operation description",
  "data": { /* relevant data */ }
}
```

---

## Performance Considerations

### Backend Optimizations

- Lazy loading for entity relationships
- Connection pooling for database
- JWT stateless authentication (no server sessions)
- Efficient query design

### Frontend Optimizations

- Vite build optimization
- Code splitting with React lazy loading
- Optimized images from Cloudinary
- Local storage for auth tokens
- Conditional rendering

---

## Error Handling

### Backend

- Global exception handler
- Custom `OurException` class
- Consistent error responses
- Proper HTTP status codes

### Frontend

- Try-catch in API calls
- User-friendly error messages
- Loading states
- Network error recovery

---

## Future Enhancements

- Email notifications
- Advanced search filters
- Analytics dashboard
- Multi-language support
- Mobile applications
- Real-time availability updates
