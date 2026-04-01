import { Navigate, Route, Routes } from 'react-router-dom'
import { BookingProvider } from './contexts/BookingContext'
import { UserProvider } from './contexts/UserContext'
import BookingModuleLayout from './routes/BookingModuleLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminBookingsPage from './pages/AdminBookingsPage'
import BookingFormPage from './pages/BookingFormPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './components/LandingPage'
import RegisterPage from './components/UserManagement/RegisterPage'
import LoginPage from './components/UserManagement/LoginPage'
import ForgotPasswordPage from './components/UserManagement/ForgotPasswordPage'
import OAuthSuccessPage from './components/UserManagement/OAuthSuccessPage'
import './App.css'
import AdminDashboard from './components/dashboard/AdminDashboard'
import TechnicianDasboard from './components/dashboard/TechnicianDashboard'
import RoleRoute from './components/RoleRoute'
import { ROLES } from './utils/constants'
import UserProfile from './components/UserManagement/UserProfile'
import UserManagement from './components/UserManagement/UserManagement'
import UserHomePage from './components/UserHomePage'

function App() {
  return (
    <UserProvider>
      <BookingProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />
          <Route path="/api/auth/oauth-success" element={<OAuthSuccessPage />} />
          <Route path="/api/auth/oauth-success/*" element={<OAuthSuccessPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/user/home" element={<UserHomePage />} />

            <Route path="/dashboard">
              <Route index element={<Navigate to="user" replace />} />
              <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
                <Route path="user" element={<UserHomePage />} />
              </Route>
              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="admin" element={<AdminDashboard />}>
                  <Route path="users" element={<UserManagement />} />
                </Route>
              </Route>
              <Route element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
                <Route path="technician" element={<TechnicianDasboard />} />
              </Route>
            </Route>
          </Route>

          {/* Booking Routes */}
          <Route element={<BookingModuleLayout />}>
            <Route path="/bookings/new" element={<ProtectedRoute allowedRoles={['USER']}><BookingFormPage /></ProtectedRoute>} />
            <Route path="/bookings/my" element={<ProtectedRoute allowedRoles={['USER']}><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookingsPage /></ProtectedRoute>} />
          </Route>

          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          <Route path="/admin/users" element={<Navigate to="/dashboard/admin/users" replace />} />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BookingProvider>
    </UserProvider>
  )
}

export default App
