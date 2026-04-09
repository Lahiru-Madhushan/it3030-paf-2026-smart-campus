import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Ticket,
  CalendarCheck2,
  ShieldAlert,
  ArrowRight,
  UserCircle2,
} from 'lucide-react'
import logo1 from '../assets/logo1.png'
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
      <section className="bg-gradient-to-br from-white via-slate-50 to-[#e8edf5]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <img
                src={logo1}
                alt="Campus Hub Logo"
                className="h-16 w-16 rounded-2xl object-contain shadow-sm"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A192F]">
                  User Dashboard
                </p>
                <h2 className="text-4xl font-bold leading-tight text-gray-900">
                  Welcome, {currentUser?.name || 'User'}
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
              Access booking services, browse available facilities, and raise support tickets
              through one clean, modern, and easy-to-use dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/bookings/new')}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0A192F] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#081425]"
              >
                Start Booking
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/user/facilities')}
                className="rounded-2xl border border-[#0A192F] bg-white px-5 py-3 font-semibold text-[#0A192F] transition hover:bg-[#e8edf5]"
              >
                View Facilities
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 transition hover:shadow-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8edf5] text-[#0A192F]">
                  <CalendarCheck2 size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Easy Booking</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Reserve resources and services quickly with a simple and smooth booking flow.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 transition hover:shadow-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8edf5] text-[#0A192F]">
                  <LayoutGrid size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Facilities Access</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Explore available facilities and campus resources in one organized place.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 transition hover:shadow-md sm:col-span-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8edf5] text-[#0A192F]">
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
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0A192F]">
            Quick Actions
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            What would you like to do today?
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <button
            onClick={() => navigate('/bookings/new')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8edf5] text-[#0A192F]">
              <CalendarCheck2 size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Booking</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Make a new booking for available campus services and facilities.
            </p>
          </button>

          <button
            onClick={() => navigate('/user/facilities')}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A192F] shadow-sm">
              <LayoutGrid size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Facilities</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Browse facilities, services, and available campus resources quickly.
            </p>
          </button>

          <button
            onClick={() => navigate('/incidents')}
            className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8edf5] text-[#0A192F]">
              <Ticket size={24} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Ticket</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Submit an issue or request support whenever you need assistance.
            </p>
          </button>
        </div>
      </section>

      {/* Profile summary */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0A192F] shadow-sm">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0A192F]">
                Profile Summary
              </p>
              <h4 className="text-xl font-bold text-gray-900">Your Account</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Name</p>
              <p className="mt-1 font-semibold text-gray-900">{currentUser?.name || 'N/A'}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-semibold text-gray-900">{currentUser?.email || 'N/A'}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
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