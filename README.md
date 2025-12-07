# 🏨 LuxeStay Hub

**LuxeStay Hub** is a premium, full-stack hotel management and booking platform designed to deliver a seamless experience for guests and efficient operations for hotel managers.

Powered by **Java Spring Boot** and **React**, it features a robust booking engine, secure payments, and an intelligent **AI Concierge** built with **Gemini API** and **LangChain** to assist guests in real-time.

---

## 🚀 Tech Stack

### **Backend**
*   **Framework:** Java Spring Boot (v3.x)
*   **Language:** Java 21
*   **Database:** PostgreSQL
*   **Security:** Spring Security & JWT (JSON Web Tokens)
*   **AI & ML:** Google Gemini API integrated with **LangChain** for context-aware chat
*   **Payments:** Stripe API
*   **Image Storage:** Cloudinary
*   **Build Tool:** Maven

### **Frontend**
*   **Framework:** React (Vite)
*   **Styling:** Custom CSS / Styled Components
*   **Icons:** Lucide React
*   **State Management:** React Context API
*   **HTTP Client:** Fetch API / Axios

### **Deployment**
*   **Platform:** Hostinger (VPS / Cloud Hosting)
*   **Containerization:** Docker support available

---

## ✨ Key Features

*   **🤖 AI Concierge (LangChain + Gemini):** Smart chatbot that answers guest queries about amenities, policies, and room recommendations.
*   **📅 Smart Booking System:** Real-time availability checks, date selection, and instant booking confirmation.
*   **💳 Secure Payments:** Integrated Stripe payment gateway for safe and easy transactions.
*   **🛡️ Role-Based Access:**
    *   **Admin:** Manage rooms, bookings, and users.
    *   **User:** Browse rooms, book stays, and view booking history.
*   **🖼️ Media Management:** Seamless image uploads for rooms using Cloudinary.
*   **📱 Responsive Design:** Optimized for mobile, tablet, and desktop devices.

---

## 🛠️ Environment Variables

Create a `.env` file in the `backend/src/main/resources/` directory (or root depending on setup) with the following:

```properties
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/luxestay_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_must_be_long_enough
JWT_EXPIRATION=86400000

# AWS / Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
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
The frontend will start on `http://localhost:5173` (or similar).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
