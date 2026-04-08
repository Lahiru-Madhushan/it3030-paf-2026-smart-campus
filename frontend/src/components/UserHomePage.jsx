import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Ticket,
  CalendarCheck2,
  ShieldAlert,
  ArrowRight,
  UserCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Header from './dashboard/UserDashboard'
import Footer from './dashboard/userFooter'

export default function UserHomePage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <>
    <Header />
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-yellow-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
              User Dashboard
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-gray-900">
              Welcome, {currentUser?.name || 'User'}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Access booking services, browse available facilities, and raise support tickets
              through one clean and modern dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/bookings/new')}
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-yellow-500"
              >
                Start Booking
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/user/facilities')}
                className="rounded-2xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                View Facilities
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-100 p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <CalendarCheck2 size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Easy Booking</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Reserve resources and services quickly with a simple booking flow.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <LayoutGrid size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Facilities Access</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore available facilities and campus resources in one place.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-5 sm:col-span-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <ShieldAlert size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Need help? Raise a ticket and keep track of your support requests easily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
            Quick Actions
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            What would you like to do today?
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <button
            onClick={() => navigate('/bookings/new')}
            className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
              <CalendarCheck2 size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Booking</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Make a new booking for available campus services and facilities.
            </p>
          </button>

          <button
            onClick={() => navigate('/user/facilities')}
            className="group rounded-3xl border border-gray-200 bg-gray-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-700">
              <LayoutGrid size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Facilities</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Browse facilities, services, and available campus resources quickly.
            </p>
          </button>

          <button
            onClick={() => navigate('/incidents')}
            className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
              <Ticket size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Ticket</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Submit an issue or request support when you need assistance.
            </p>
          </button>
        </div>
      </section>

      {/* Profile summary */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
                Profile Summary
              </p>
              <h4 className="text-xl font-bold text-gray-900">Your Account</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-gray-500">Name</p>
              <p className="mt-1 font-semibold text-gray-900">{currentUser?.name || 'N/A'}</p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-semibold text-gray-900">{currentUser?.email || 'N/A'}</p>
            </div>

            <div className="rounded-2xl bg-white p-4">
              <p className="text-sm text-gray-500">Role</p>
              <p className="mt-1 font-semibold capitalize text-gray-900">
                {currentUser?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}