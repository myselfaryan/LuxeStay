import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import Profile from './pages/Profile';
import FindBooking from './pages/FindBooking.tsx';
import ManageRooms from './pages/admin/ManageRooms';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import PaymentPage from './component/common/PaymentPage';
import BookingSuccess from './pages/BookingSuccess';
import Chatbot from './components/Chatbot';
import FindMyRoom from './pages/FindMyRoom';

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

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
          <Route path="/find-my-room" element={<FindMyRoom />} />
          <Route path="/find-booking" element={<FindBooking />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/rooms" element={<ManageRooms />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Chatbot />
      </Router>
    </AuthProvider>
  );
};

export default App;