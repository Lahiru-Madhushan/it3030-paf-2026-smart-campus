import { Navigate, Route, Routes } from 'react-router-dom'
import { BookingProvider } from './contexts/BookingContext'
import { UserProvider } from './contexts/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
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
import UserBookingLayout from './layouts/UserBookingLayout'
// import ResourceManagement from './components/dashboard/ResourceManagement'
import { ROLES } from './utils/constants'
import UserProfile from './components/UserManagement/UserProfile'
import UserManagement from './components/UserManagement/UserManagement'
import UserHomePage from './components/UserHomePage'
import TicketList from './components/incidents/TicketList'
import TicketForm from './components/incidents/TicketForm'
import TicketDetail from './components/incidents/TicketDetail'

function App() {
 
 return (
  <UserProvider>
    <BookingProvider>
      <Routes>  
        <Route path="/" element={<LandingPage />} />  
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
        <Route path="/api/auth/oauth-success" element={<OAuthSuccessPage />} />
        <Route path="/api/auth/oauth-success/*" element={<OAuthSuccessPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/home" element={<UserHomePage />} />
        <Route path="/incidents" element={<TicketList />} />
        <Route path="/incidents/create" element={<TicketForm />} />
        <Route path="/incidents/:id" element={<TicketDetail />} />
        <Route path="/technician/incidents" element={<TicketList />} />
        <Route path="/technician/incidents/:id" element={<TicketDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />

          <Route path="/dashboard/user" element={<RoleRoute allowedRoles={[ROLES.USER]}><UserHomePage /></RoleRoute>} />

          <Route path="/dashboard/admin" element={<RoleRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></RoleRoute>}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
          </Route>

          <Route path="/dashboard/technician" element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]}><TechnicianDasboard /></RoleRoute>}>
            <Route path="incidents" element={<TicketList />} />
          </Route>

          <Route element={<UserBookingLayout />}>
            <Route path="/bookings/my" element={<MyBookingsPage />} />
            <Route path="/bookings/form" element={<BookingFormPage />} />
            <Route path="/bookings/new" element={<BookingFormPage />} />
          </Route>
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
