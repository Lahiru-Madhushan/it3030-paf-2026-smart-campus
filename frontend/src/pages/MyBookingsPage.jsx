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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-base text-gray-600">
            Track your booking requests and cancel pending or approved bookings.
          </p>
        </div>

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
    </div>
  )
}

export default MyBookingsPage
