# 🏨 LuxeStay Hub

**LuxeStay Hub** is a premium, full-stack hotel management and booking platform designed to deliver a seamless experience for guests and efficient operations for hotel managers.

Powered by **Java Spring Boot** and **React (Vite)**, it features a robust booking engine, secure payments via **Stripe**, and an intelligent **AI Concierge** powered by **Google Gemini API** to assist guests in real-time.

---

## 🚀 Tech Stack

### **Backend**
*   **Framework:** Java Spring Boot (v3.x)
*   **Language:** Java 21
*   **Database:** PostgreSQL
*   **Security:** Spring Security & JWT (JSON Web Tokens)
*   **AI Integration:** Google Gemini API for intelligent chatbot & room recommendations
*   **Payments:** Stripe API for secure payment processing
*   **Image Storage:** Cloudinary for media management
*   **Build Tool:** Maven

### **Frontend**
*   **Framework:** React 18+ with Vite
*   **Language:** TypeScript
*   **Routing:** React Router DOM (HashRouter)
*   **Styling:** Custom CSS
*   **Icons:** Lucide React
*   **State Management:** React Context API
*   **HTTP Client:** Fetch API

### **Deployment**
*   **Platform:** Hostinger (VPS / Cloud Hosting)
*   **Containerization:** Docker support available

---

## ✨ Key Features

*   **🤖 AI Concierge (Gemini):** Smart chatbot that answers guest queries about amenities, policies, and provides personalized room recommendations.
*   **🔍 AI Room Finder:** Natural language room search - describe your ideal stay and get AI-powered recommendations with match scores.
*   **📅 Smart Booking System:** Real-time availability checks, date selection, and instant booking confirmation.
*   **💳 Secure Payments:** Integrated Stripe payment gateway for safe and easy transactions.
*   **🛡️ Role-Based Access:**
    *   **Admin:** Manage rooms, bookings, and users.
    *   **User:** Browse rooms, book stays, and view booking history.
*   **🖼️ Media Management:** Seamless image uploads for rooms using Cloudinary.
*   **📱 Responsive Design:** Optimized for mobile, tablet, and desktop devices.

---

## 🛠️ Environment Variables

Create an `application.properties` file in `backend/src/main/resources/` with the following:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/luxestay_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

# JWT Security
jwt.secret=your_super_secret_jwt_key_must_be_long_enough
jwt.expiration=86400000

# Cloudinary (Image Storage)
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# Google Gemini AI
gemini.api.key=your_gemini_api_key

# Stripe Payments
stripe.secret.key=your_stripe_secret_key
```

---

## 🏃‍♂️ Getting Started

### 1. Backend Setup
```bash
cd backend
# Install dependencies and run
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev
```
The frontend will start on `http://localhost:5173`.

---

## 📁 Project Structure

```
LuxeStay-Hub/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/sanjo/backend/
│   │       ├── controller/     # REST API Controllers
│   │       ├── service/        # Business Logic
│   │       ├── repository/     # Data Access Layer
│   │       ├── entity/         # JPA Entities
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── security/       # JWT & Security Config
│   │       └── config/         # App Configuration
│   └── src/main/resources/     # Properties & Config
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API Service Layer
│   │   ├── context/            # React Context
│   │   ├── types/              # TypeScript Types
│   │   └── constants/          # App Constants
│   └── public/                 # Static Assets
├── docs/                       # Documentation
└── docker-compose.yml          # Docker Configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aryan Sharma**
- GitHub: [@myselfaryan](https://github.com/myselfaryan)
