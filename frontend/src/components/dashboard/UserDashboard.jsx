import { useLocation, useNavigate } from 'react-router-dom'
import {
  UserCircle2,
  LogOut,
} from 'lucide-react'
import logo1 from '../../assets/logo1.png'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'

export default function UserLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { label: 'Home', path: '/user/home' },
    { label: 'Facilities', path: '/user/facilities' },
    { label: 'Booking', path: '/bookings/new' },
    { label: 'My Bookings', path: '/bookings/my-bookings' },
    { label: 'Ticket', path: '/incidents' },
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
            <img
              src={logo1}
              alt="Campus Hub Logo"
              className="h-11 w-11 object-contain"
            />
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
                    ? 'bg-[#0A192F] text-white'
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

            <button
              onClick={() => navigate('/profile')}
              className="rounded-2xl bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
            >
              <UserCircle2 size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0A192F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#081425]"
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
                    ? 'border-[#0A192F] bg-[#0A192F] text-white'
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