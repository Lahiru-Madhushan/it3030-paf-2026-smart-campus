import LandingPage from './components/LandingPage'
import RegisterPage from './components/UserManagement/RegisterPage'
import LoginPage from './components/UserManagement/LoginPage'
import ForgotPasswordPage from './components/UserManagement/ForgotPasswordPage'
import OAuthSuccessPage from './components/UserManagement/OAuthSuccessPage'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/dashboard/AdminDashboard'
import TechnicianDasboard from './components/dashboard/TechnicianDashboard'
import UserDashboard from './components/dashboard/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import { ROLES } from './utils/constants'
import UserProfile from './components/UserManagement/UserProfile'
import UserManagement from './components/UserManagement/UserManagement'
import UserHomePage from './components/UserHomePage'
import TicketList from './components/incidents/TicketList'
import TicketForm from './components/incidents/TicketForm'
import TicketDetail from './components/incidents/TicketDetail'
import AdminOverviewContent from './components/dashboard/AdminOverviewContent'
import AdminBookingsPage from './pages/AdminBookingsPage'
import BookingFormPage from './pages/BookingFormPage'
import MyBookingsPage from './pages/MyBookingsPage'

function App() {
  return (
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
      <Route path="/bookings/form" element={<BookingFormPage />} />
      <Route path="/bookings/my-bookings" element={<MyBookingsPage />} />
      <Route path="/incidents" element={<TicketList />} />
      <Route path="/incidents/create" element={<TicketForm />} />
      <Route path="/incidents/:id" element={<TicketDetail />} />
      <Route path="/technician/incidents" element={<TicketList />} />
      <Route path="/technician/incidents/:id" element={<TicketDetail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard">
          <Route index element={<Navigate to="user" replace />} />
          <Route path="user" element={<UserDashboard />} />

          <Route
            path="admin"
            element={<RoleRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></RoleRoute>}
          >
            <Route index element={<AdminOverviewContent />} />
            <Route path="users" element={<UserManagement />} />
            <Route
              path="resources"
              element={
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                  Resource management is under construction.
                </div>
              }
            />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="incidents" element={<TicketList />} />
          </Route>

          <Route
            path="technician"
            element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]}><TechnicianDasboard /></RoleRoute>}
          >
            <Route index element={null} />
            <Route path="incidents" element={<TicketList />} />
          </Route>
        </Route>
      </Route>

      <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="/admin/users" element={<Navigate to="/dashboard/admin/users" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
