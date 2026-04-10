import { useLocation, useNavigate } from 'react-router-dom'
import { UserCircle2, LogOut } from 'lucide-react'
import logo1 from '../../assets/logo2.png'
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
    { label: 'Home', path: '/user/home', matchPaths: ['/user/home', '/dashboard/user'] },
    { label: 'Facilities', path: '/user/facilities' },
    { label: 'Booking', path: '/bookings/new' },
    { label: 'My Bookings', path: '/bookings/my-bookings' },
    { label: 'Ticket', path: '/incidents' },
  ]

  const isActive = (item) => {
    const path = item.path
    if (item.matchPaths?.length) {
      return item.matchPaths.some((p) => location.pathname === p)
    }
    if (path === '/incidents') {
      return (
        location.pathname === '/incidents' || location.pathname.startsWith('/incidents/')
      )
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const navButtonClass = (active) =>
    active
      ? 'bg-white text-[#0A192F] shadow-sm'
      : 'text-white hover:bg-white/10'

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A192F] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate('/user/home')}
          className="flex min-w-0 flex-shrink-0 items-center gap-3 text-left transition hover:opacity-90"
        >
          <img
            src={logo1}
            alt=""
             className="h-13 w-12 shrink-0 object-cover sm:h-14 sm:w-14"
          />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-white sm:text-lg">
              Campus Hub
            </h1>
            <p className="truncate text-xs text-white/80 sm:text-[13px]">
              Smart Student Services
            </p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${navButtonClass(active)}`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <NotificationBell variant="dark" />

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25"
            aria-label="Profile"
          >
            <UserCircle2 size={20} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#0A192F] shadow-sm transition hover:bg-white/95 sm:px-4 sm:py-2.5"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="border-t border-white/10 px-3 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${navButtonClass(active)}`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
