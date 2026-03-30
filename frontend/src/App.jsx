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
     

    <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" >
          <Route index element={<Navigate to="user" replace />} />
          

          <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
            <Route path="user" element={<UserHomePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="admin" element={<AdminDashboard />}>
              
              <Route path="users" element={<UserManagement />} />

              {/* <Route path="resources" element={<ResourceManagement />} /> */}

              {/* <Route path="bookings" element={<BookingManagement />} /> */}

            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
            <Route path="technician" element={<TechnicianDasboard />} />
          </Route>
       </Route>
        </Route>
      <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="/admin/users" element={<Navigate to="/dashboard/admin/users" replace />} />
     {/* <Route path="/admin/resources" element={<Navigate to="/dashboard/admin/resources" replace />} />
      <Route path="/admin/bookings" element={<Navigate to="/dashboard/admin/bookings" replace />} />   */}
      <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
  )
}

export default App
