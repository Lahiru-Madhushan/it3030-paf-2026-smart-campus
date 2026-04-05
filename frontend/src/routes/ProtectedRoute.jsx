import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useUser()

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'ADMIN' ? '/admin/bookings' : '/bookings/my'} replace />
  }

  return children
}

export default ProtectedRoute
