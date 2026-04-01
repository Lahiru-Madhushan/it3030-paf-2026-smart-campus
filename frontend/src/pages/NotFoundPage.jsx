import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">This route does not exist in the Booking Management module.</p>
      <Link
        className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        to="/bookings/my"
      >
        Go to My Bookings
      </Link>
    </section>
  )
}

export default NotFoundPage
