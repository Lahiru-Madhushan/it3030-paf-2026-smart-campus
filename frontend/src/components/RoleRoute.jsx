import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath } from '../utils/roleRedirect'

export default function RoleRoute({ allowedRoles, children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="screen-message">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  return children || <Outlet />
}
