import BookingForm from '../components/booking/BookingForm'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import bookingsApi from '../api/bookingsApi'
import Header from '../components/dashboard/UserDashboard'
import Footer from '../components/dashboard/userFooter'
import { getBookingErrorMessage } from '../utils/bookingErrorMessages'

function BookingFormPage() {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const resourceIdParam = searchParams.get('resourceId')
  const resourceCodeParam = searchParams.get('resourceCode')

  const parsedResourceId = Number(resourceIdParam)
  const prefilledResourceId = Number.isFinite(parsedResourceId) && parsedResourceId > 0
    ? parsedResourceId
    : null

  const handleSubmit = async (payload) => {
    setLoading(true)

    try {
      const { data } = await bookingsApi.createBooking(payload)
      toast.success('Booking request submitted successfully.')
      return { ok: true, data }
    } catch (apiError) {
      const message = getBookingErrorMessage(
        apiError,
        'Could not submit booking right now. Please try again.',
      )
      toast.error(message)
      return { ok: false, message, status: apiError?.response?.status }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
        <section className="mx-auto max-w-2xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">New Booking</h1>
              <p className="text-base text-gray-600">
                Submit a booking request for a campus resource. Conflict and validation
                errors from backend are shown clearly.
              </p>
            </div>

            {/* <button
              type="button"
              onClick={() => navigate('/bookings/my-bookings')}
              className="rounded-xl border border-yellow-400 bg-white px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50"
            >
              See My Bookings
            </button> */}
          </div>

          {prefilledResourceId ? (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Booking for resource ID {prefilledResourceId}
              {resourceCodeParam ? ` (${resourceCodeParam})` : ''}.
            </div>
          ) : null}

          <BookingForm
            onSubmit={handleSubmit}
            loading={loading}
            initialResourceId={prefilledResourceId}
          />
        </section>
      </div>
      <Footer />
    </>
  )
}

export default BookingFormPage
