import { useEffect, useState } from 'react'
import bookingsApi from '../api/bookingsApi'
import BookingTable from '../components/booking/BookingTable'
import FilterBar from '../components/booking/FilterBar'
import RejectBookingModal from '../components/booking/RejectBookingModal'
import ErrorAlert from '../components/common/ErrorAlert'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SuccessAlert from '../components/common/SuccessAlert'

const INITIAL_FILTERS = {
  status: '',
  bookingDate: '',
  resourceId: '',
}

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

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const fetchAllBookings = async (apiFilters = {}) => {
    setLoading(true)
    setError('')

    try {
      const { data } = await bookingsApi.getAllBookings(apiFilters)
      setBookings(Array.isArray(data) ? data : [])
    } catch (apiError) {
      setError(getFriendlyError(apiError, 'Failed to fetch bookings.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllBookings({})
  }, [])

  const applyFilters = () => {
    const apiFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== ''),
    )
    fetchAllBookings(apiFilters)
  }

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS)
    fetchAllBookings({})
  }

  const handleApprove = async (bookingId) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.approveBooking(bookingId)
      setSuccess('Booking approved successfully.')
      applyFilters()
    } catch (apiError) {
      setError(getFriendlyError(apiError, 'Failed to approve booking.'))
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (reason) => {
    if (!selectedBookingId) {
      return { ok: false }
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.rejectBooking(selectedBookingId, reason)
      setSuccess('Booking rejected successfully.')
      applyFilters()
      setSelectedBookingId(null)
      return { ok: true }
    } catch (apiError) {
      const message = getFriendlyError(apiError, 'Failed to reject booking.')
      setError(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.cancelBooking(bookingId)
      setSuccess('Booking cancelled successfully.')
      applyFilters()
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
          <h1 className="text-4xl font-bold text-gray-900">Admin Booking Management</h1>
          <p className="text-base text-gray-600">
            Review all bookings, filter records, and approve, reject, or cancel as
            needed.
          </p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {loading ? <LoadingSpinner label="Loading all bookings..." /> : null}

        <BookingTable
          bookings={bookings}
          loading={loading}
          isAdmin
          onApprove={handleApprove}
          onOpenReject={setSelectedBookingId}
          onCancel={handleCancel}
        />

        <RejectBookingModal
          open={Boolean(selectedBookingId)}
          loading={loading}
          onClose={() => setSelectedBookingId(null)}
          onConfirm={handleReject}
        />
      </section>
    </div>
  )
}

export default AdminBookingsPage
