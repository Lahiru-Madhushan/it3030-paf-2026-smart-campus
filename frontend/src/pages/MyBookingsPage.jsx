import { useEffect, useState } from 'react'
import bookingsApi from '../api/bookingsApi'
import BookingTable from '../components/booking/BookingTable'
import ErrorAlert from '../components/common/ErrorAlert'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SuccessAlert from '../components/common/SuccessAlert'

function getFriendlyError(error, fallbackMessage) {
  const responseData = error?.response?.data

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (responseData?.message) {
    return responseData.message
  }

  if (responseData?.error) {
    return responseData.error
  }

  return fallbackMessage
}

function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchMyBookings = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await bookingsApi.getMyBookings()
      setMyBookings(Array.isArray(data) ? data : [])
    } catch (apiError) {
      setError(getFriendlyError(apiError, 'Failed to fetch your bookings.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.cancelBooking(bookingId)
      setSuccess('Booking cancelled successfully.')
      fetchMyBookings()
    } catch (apiError) {
      setError(getFriendlyError(apiError, 'Failed to cancel booking.'))
    } finally {
      setLoading(false)
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
