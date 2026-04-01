import { useEffect } from 'react'
import BookingTable from '../components/booking/BookingTable'
import ErrorAlert from '../components/common/ErrorAlert'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SuccessAlert from '../components/common/SuccessAlert'
import { useBooking } from '../contexts/BookingContext'

function MyBookingsPage() {
  const {
    myBookings,
    loading,
    error,
    success,
    fetchMyBookings,
    cancelBooking,
  } = useBooking()

  useEffect(() => {
    fetchMyBookings()
  }, [fetchMyBookings])

  const handleCancel = async (bookingId) => {
    const result = await cancelBooking(bookingId)
    if (result.ok) {
      fetchMyBookings()
    }
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">My Bookings</h1>
      <p className="text-sm text-slate-600">
        Track your booking requests and cancel pending or approved bookings.
      </p>

      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      {loading ? <LoadingSpinner label="Loading your bookings..." /> : null}

      <BookingTable
        bookings={myBookings}
        loading={loading}
        isAdmin={false}
        onCancel={handleCancel}
        onApprove={() => {}}
        onOpenReject={() => {}}
      />
    </section>
  )
}

export default MyBookingsPage
