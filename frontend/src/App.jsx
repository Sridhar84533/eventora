import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import EventsListing from './pages/public/EventsListing';
import EventDetail from './pages/public/EventDetail';
import CategoriesListing from './pages/public/CategoriesListing';
import VenuesListing from './pages/public/VenuesListing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import { ForgotPassword, ResetPassword } from './pages/public/ForgotPassword';

// User Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import UserTickets from './pages/user/UserTickets';
import UserFavourites from './pages/user/UserFavourites';
import UserProfile from './pages/user/UserProfile';

// Organizer Dashboard Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import OrganizerBookings from './pages/organizer/OrganizerBookings';
import OrganizerStaff from './pages/organizer/OrganizerStaff';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventApproval from './pages/admin/AdminEventApproval';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminCategoriesVenues from './pages/admin/AdminCategoriesVenues';
import AdminReports from './pages/admin/AdminReports';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/events" element={<EventsListing />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/categories" element={<CategoriesListing />} />
      <Route path="/venues" element={<VenuesListing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Distinct User Dashboard Routes */}
      <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/bookings" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />
      <Route path="/user/upcoming" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />
      <Route path="/user/past" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />
      <Route path="/user/tickets" element={<ProtectedRoute allowedRoles={['user']}><UserTickets /></ProtectedRoute>} />
      <Route path="/user/favourites" element={<ProtectedRoute allowedRoles={['user']}><UserFavourites /></ProtectedRoute>} />
      <Route path="/user/notifications" element={<ProtectedRoute allowedRoles={['user']}><UserBookings /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserProfile /></ProtectedRoute>} />
      <Route path="/user/settings" element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}><UserProfile /></ProtectedRoute>} />

      {/* Distinct Organizer Dashboard Routes */}
      <Route path="/organizer/dashboard" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/events" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerEvents /></ProtectedRoute>} />
      <Route path="/organizer/events/create" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateEvent /></ProtectedRoute>} />
      <Route path="/organizer/events/:id/edit" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateEvent /></ProtectedRoute>} />
      <Route path="/organizer/bookings" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerBookings /></ProtectedRoute>} />
      <Route path="/organizer/attendees" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerBookings /></ProtectedRoute>} />
      <Route path="/organizer/staff" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerStaff /></ProtectedRoute>} />
      <Route path="/organizer/revenue" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/notifications" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/profile" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><UserProfile /></ProtectedRoute>} />
      <Route path="/organizer/settings" element={<ProtectedRoute allowedRoles={['organizer', 'admin']}><UserProfile /></ProtectedRoute>} />

      {/* Distinct Admin Dashboard Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/organizers" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrganizers /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventApproval /></ProtectedRoute>} />
      <Route path="/admin/events/pending" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventApproval /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminCategoriesVenues /></ProtectedRoute>} />
      <Route path="/admin/venues" element={<ProtectedRoute allowedRoles={['admin']}><AdminCategoriesVenues /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventApproval /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><UserProfile /></ProtectedRoute>} />

      {/* Fallback Wildcard Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
