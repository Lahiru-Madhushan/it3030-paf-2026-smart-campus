import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  UserCircle2,
  LogOut,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

export default function UserLayout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  const navItems = [
    { label: 'Home', path: '/user/home' },
    { label: 'Facilities', path: '/user/facilities' },
    { label: 'Booking', path: '/bookings/form' },
    { label: 'My Bookings', path: '/bookings/my-bookings' },
    { label: 'Ticket', path: '/user/ticket' },
  ]

  const isActive = (path) => {
    if (path === '/user') return location.pathname === '/user'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bg-white text-gray-800">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Campus Hub</h1>
              <p className="text-xs text-gray-500">Smart Student Services</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isActive(item.path)
                    ? 'bg-yellow-400 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button className="relative rounded-2xl bg-gray-100 p-3 text-gray-700 hover:bg-gray-200">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-yellow-400" />
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="rounded-2xl bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
            >
              <UserCircle2 size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-white hover:bg-yellow-500"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>

        {/* Mobile Nav */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 md:hidden">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`rounded-xl border px-4 py-2 text-sm ${
                  isActive(item.path)
                    ? 'border-yellow-400 bg-yellow-400 text-white'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </header>

    </div>
  )
}