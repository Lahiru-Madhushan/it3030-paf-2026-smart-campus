import { BrowserRouter } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BookingProvider } from './contexts/BookingContext'
import { UserProvider } from './contexts/UserContext'
import BookingModuleLayout from './routes/BookingModuleLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminBookingsPage from './pages/AdminBookingsPage'
import BookingFormPage from './pages/BookingFormPage'
import MyBookingsPage from './pages/MyBookingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BookingProvider>
          <BookingModuleLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/bookings/my" replace />} />

              <Route
                path="/bookings/new"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <BookingFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bookings/my"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminBookingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BookingModuleLayout>
        </BookingProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
