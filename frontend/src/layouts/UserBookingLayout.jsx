import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { LogOut, BookOpen, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function UserBookingLayout() {
  const { auth, logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (!auth?.token) {
      navigate('/')
      return
    }

    // Check if user is admin - redirect to admin bookings
    if (currentUser?.role === 'ADMIN') {
      navigate('/admin/bookings')
      return
    }

    const timer = setTimeout(() => {
      logout()
      alert('Session expired. Please login again.')
      navigate('/')
    }, 30 * 60 * 1000)

    return () => clearTimeout(timer)
  }, [auth, logout, navigate, currentUser?.role])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Campus Hub</h1>
              <p className="text-xs text-gray-500">Bookings</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="rounded-2xl bg-gray-100 p-3 text-gray-700 hover:bg-gray-200 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm md:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">
                {currentUser?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="max-w-[150px] truncate font-medium text-gray-700">
                {currentUser?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-white hover:bg-yellow-500 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-4 text-center text-xs text-gray-500">
        <p>Session auto-expires after 30 minutes of inactivity.</p>
      </footer>
    </div>
  )
}
