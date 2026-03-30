import { useNavigate } from 'react-router-dom'

export default function Footer({ currentUser, handleLogout }) {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-gray-200 bg-gray-100">
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
          <h6 className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
            Quick Links
          </h6>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/user')}>
              Home
            </p>
            <p
              className="cursor-pointer hover:text-gray-900"
              onClick={() => navigate('/user/facilities')}
            >
              Facilities
            </p>
            <p
              className="cursor-pointer hover:text-gray-900"
              onClick={() => navigate('/user/booking')}
            >
              Booking
            </p>
            <p
              className="cursor-pointer hover:text-gray-900"
              onClick={() => navigate('/user/ticket')}
            >
              Ticket
            </p>
          </div>
        </div>

        {/* Account */}
        <div>
          <h6 className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
            Account
          </h6>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p>{currentUser?.email}</p>
            <p className="capitalize">{currentUser?.role}</p>
            <button
              onClick={handleLogout}
              className="mt-2 rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-white transition hover:bg-yellow-500"
            >
              Logout
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        © 2026 Campus Hub. All rights reserved.
      </div>
    </footer>
  )
}