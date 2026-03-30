import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Users,
  Boxes,
  CalendarDays,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Home,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { currentUser, logout, auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/dashboard/admin' },
    { id: 'users', label: 'Users', icon: <Users size={18} />, path: '/dashboard/admin/users' },
    { id: 'resources', label: 'Resources', icon: <Boxes size={18} />, path: '/dashboard/admin/resources' },
    { id: 'bookings', label: 'Bookings', icon: <CalendarDays size={18} />, path: '/dashboard/admin/bookings' },
  ]

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

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard/admin/users':
        return 'User Management'
      case '/dashboard/admin/resources':
        return 'Resource Management'
      case '/dashboard/admin/bookings':
        return 'Booking Management'
      default:
        return 'Dashboard'
    }
  }

  const getBadgeTitle = () => {
    switch (location.pathname) {
      case '/dashboard/admin/users':
        return 'Users'
      case '/dashboard/admin/resources':
        return 'Resources'
      case '/dashboard/admin/bookings':
        return 'Bookings'
      default:
        return 'Admin Overview'
    }
  }

  const getSubtitle = () => {
    switch (location.pathname) {
      case '/dashboard/admin/users':
        return 'View and manage all system users.'
      case '/dashboard/admin/resources':
        return 'View and manage campus resources.'
      case '/dashboard/admin/bookings':
        return 'View and manage all booking records.'
      default:
        return 'Select a module from the sidebar to manage your campus platform.'
    }
  }

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex min-h-screen bg-white"
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r border-black transition-all duration-300"
        style={{
          width: sidebarOpen ? '240px' : '64px',
          minWidth: sidebarOpen ? '240px' : '64px',
          background: '#0a0a0a',
          color: '#fff',
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
          {sidebarOpen && (
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white">
              CampusHub
            </span>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#000' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  }
                }}
              >
                <span style={{ minWidth: '18px' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} style={{ minWidth: '18px' }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ background: '#f9f9f9' }}>
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 px-8 py-4"
          style={{ background: 'rgba(249,249,249,0.92)', backdropFilter: 'blur(12px)' }}
        >
          <div>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
              Admin Console
            </p>
            <h1 className="text-xl font-black leading-tight tracking-tight text-black">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: '#0a0a0a' }}
              >
                {currentUser?.email?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <span className="hidden max-w-[180px] truncate font-medium text-black/70 md:block">
                {currentUser?.email}
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl p-8">
          <div className="mb-6 flex items-center text-sm text-gray-600">
            <Home className="mr-2 h-4 w-4" />
            <span>Admin</span>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-gray-900">{getPageTitle()}</span>
          </div>

          <div className="mb-8">
            <div
              className="mb-4 inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest"
              style={{ background: '#0a0a0a', color: '#fff' }}
            >
              {getBadgeTitle()}
            </div>
            <p className="text-sm font-medium text-black/50">{getSubtitle()}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>

          <p className="mt-10 text-center text-xs tracking-wide text-black/25">
            Session auto-expires after 30 minutes of inactivity.
          </p>
        </div>
      </main>
    </div>
  )
}