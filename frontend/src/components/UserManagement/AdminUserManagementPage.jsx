import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Users } from 'lucide-react'
import UserManagement from '../UserManagement/UserManagement'
import { useAuth } from '../../context/AuthContext'

export default function AdminUserManagementPage() {
  const { currentUser, logout, auth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    if (!auth?.token) {
      navigate('/')
      return
    }

    const timer = setTimeout(() => {
      logout()
      alert('Session expired. Please login again.')
      navigate('/')
    }, 30 * 60 * 1000)

    return () => clearTimeout(timer)
  }, [auth, logout, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-yellow-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
              <Users size={26} />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                Admin Panel
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage users, user roles, and permissions. Logged in as{' '}
                <strong>{currentUser?.email}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/dashboard/admin')}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* User management content */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <UserManagement />
        </div>
      </div>
    </div>
  )
}