import { useNavigate } from 'react-router-dom'
import logo1 from '../../assets/logo1.png'

export default function Footer({ currentUser, handleLogout }) {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
        {/* About */}
        <div>
          <h5 className="text-lg font-bold text-gray-900">Campus Hub</h5>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            A smart platform for users to book services, explore facilities, and raise support
            tickets easily.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="text-sm font-semibold uppercase tracking-wide text-[#0A192F]">
            Quick Links
          </h6>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p className="cursor-pointer hover:text-[#0A192F]" onClick={() => navigate('/user')}>
              Home
            </p>
            <p
              className="cursor-pointer hover:text-[#0A192F]"
              onClick={() => navigate('/user/facilities')}
            >
              Facilities
            </p>
            <p
              className="cursor-pointer hover:text-[#0A192F]"
              onClick={() => navigate('/bookings/new')}
            >
              Booking
            </p>
            <p
              className="cursor-pointer hover:text-[#0A192F]"
              onClick={() => navigate('/user/ticket')}
            >
              Ticket
            </p>
          </div>
        </div>

        {/* Account */}
        <div>
          <h6 className="text-sm font-semibold uppercase tracking-wide text-[#0A192F]">
            Account
          </h6>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p>{currentUser?.email}</p>
            <p className="capitalize">{currentUser?.role}</p>
            <button
              onClick={handleLogout}
              className="mt-2 rounded-xl bg-[#0A192F] px-4 py-2 font-semibold text-white transition hover:bg-[#081425]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo1}
              alt="Campus Hub Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Campus Hub</p>
              <p className="text-xs text-gray-500">Smart Student Services</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">© 2026 Campus Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}