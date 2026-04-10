import { useNavigate } from 'react-router-dom'
import logo2 from '../../assets/logo2.png'
import { useAuth } from '../../context/AuthContext'

export default function Footer({ currentUser: currentUserProp, handleLogout: handleLogoutProp }) {
  const navigate = useNavigate()
  const { currentUser: authUser, logout } = useAuth()
  const currentUser = currentUserProp ?? authUser

  const handleLogout = () => {
    if (typeof handleLogoutProp === 'function') {
      handleLogoutProp()
      return
    }
    logout()
    navigate('/')
  }

  const linkClass =
    'cursor-pointer rounded-lg px-1 py-0.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white'

  return (
    <footer className="border-t border-white/10 bg-[#0A192F] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        {/* About */}
        <div>
          <h5 className="text-lg font-bold text-white">Campus Hub</h5>
          <p className="mt-2 text-sm leading-6 text-white/75">
            A smart platform for users to book services, explore facilities, and raise support
            tickets easily.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="text-sm font-semibold uppercase tracking-wide text-white/90">
            Quick Links
          </h6>
          <div className="mt-3 space-y-2">
            <p className={linkClass} onClick={() => navigate('/user/home')}>
              Home
            </p>
            <p className={linkClass} onClick={() => navigate('/user/facilities')}>
              Facilities
            </p>
            <p className={linkClass} onClick={() => navigate('/bookings/new')}>
              Booking
            </p>
            <p className={linkClass} onClick={() => navigate('/incidents')}>
              Ticket
            </p>
          </div>
        </div>

        {/* Account */}
        <div>
          <h6 className="text-sm font-semibold uppercase tracking-wide text-white/90">
            Account
          </h6>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            {currentUser?.email ? (
              <p className="break-all">{currentUser.email}</p>
            ) : null}
            {currentUser?.role ? (
              <p className="capitalize text-white/90">{String(currentUser.role).replace(/^ROLE_/, '')}</p>
            ) : null}
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0A192F] shadow-sm transition hover:bg-white/95"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={logo2}
              alt=""
              className="h-10 w-10  object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Campus Hub</p>
              <p className="text-xs text-white/70">Smart Student Services</p>
            </div>
          </div>

          <p className="text-center text-sm text-white/60 sm:text-right">
            © 2026 Campus Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
