import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import bookingsApi from '../api/bookingsApi'
import BookingTable from '../components/booking/BookingTable'
import RescheduleBookingModal from '../components/booking/RescheduleBookingModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Header from '../components/dashboard/UserDashboard'
import Footer from '../components/dashboard/userFooter'
import { getBookingErrorMessage } from '../utils/bookingErrorMessages'

function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const fetchMyBookings = async () => {
    setLoading(true)

    try {
      const { data } = await bookingsApi.getMyBookings()
      setMyBookings(Array.isArray(data) ? data : [])
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to load your bookings right now.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    setLoading(true)

    try {
      await bookingsApi.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully.')
      await fetchMyBookings()
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to cancel this booking.'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookingId) => {
    setLoading(true)

    try {
      await bookingsApi.deleteBooking(bookingId)
      toast.success('Cancelled booking deleted successfully.')
      await fetchMyBookings()
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to delete this booking.'))
    } finally {
      setLoading(false)
    }
  }

  const handleReschedule = async (payload) => {
    if (!selectedBooking?.id) {
      return { ok: false }
    }

    setLoading(true)

    try {
      await bookingsApi.rescheduleBooking(selectedBooking.id, payload)
      toast.success('Booking rescheduled and moved to pending approval.')
      setSelectedBooking(null)
      await fetchMyBookings()
      return { ok: true }
    } catch (apiError) {
      const message = getBookingErrorMessage(apiError, 'Unable to reschedule this booking.')
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] py-12 px-4">
        <section className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-base text-gray-600">
              Track your booking requests and cancel pending or approved bookings.
            </p>
          </div>

          {loading ? <LoadingSpinner label="Loading your bookings..." /> : null}

          <BookingTable
            bookings={myBookings}
            loading={loading}
            isAdmin={false}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onApprove={() => {}}
            onOpenReject={() => {}}
            onOpenReschedule={setSelectedBooking}
          />

          <RescheduleBookingModal
            open={Boolean(selectedBooking)}
            booking={selectedBooking}
            loading={loading}
            onClose={() => setSelectedBooking(null)}
            onConfirm={handleReschedule}
          />
        </section>
      </div>
      <Footer />
    </>
  )
}

export default MyBookingsPage
