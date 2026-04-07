import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import bookingsApi from '../api/bookingsApi'
import BookingTable from '../components/booking/BookingTable'
import FilterBar from '../components/booking/FilterBar'
import RejectBookingModal from '../components/booking/RejectBookingModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { getBookingErrorMessage } from '../utils/bookingErrorMessages'

const INITIAL_FILTERS = {
  status: '',
  bookingDate: '',
  resourceId: '',
}

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const fetchAllBookings = async (apiFilters = {}) => {
    setLoading(true)

    try {
      const { data } = await bookingsApi.getAllBookings(apiFilters)
      setBookings(Array.isArray(data) ? data : [])
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to load bookings right now.'))
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

    try {
      await bookingsApi.approveBooking(bookingId)
      toast.success('Booking approved successfully.')
      await fetchAllBookings(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      )
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to approve this booking.'))
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (reason) => {
    if (!selectedBookingId) {
      return { ok: false }
    }

    setLoading(true)

    try {
      await bookingsApi.rejectBooking(selectedBookingId, reason)
      toast.success('Booking rejected successfully.')
      await fetchAllBookings(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      )
      setSelectedBookingId(null)
      return { ok: true }
    } catch (apiError) {
      const message = getBookingErrorMessage(apiError, 'Unable to reject this booking.')
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    setLoading(true)

    try {
      await bookingsApi.cancelBooking(bookingId)
      toast.success('Booking cancelled successfully.')
      await fetchAllBookings(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      )
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
      await fetchAllBookings(
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
      )
    } catch (apiError) {
      toast.error(getBookingErrorMessage(apiError, 'Unable to delete this booking.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
      <Toaster position="top-right" />
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Admin Booking Management</h1>
          <p className="text-base text-gray-600">
            Review all bookings, filter records, and approve, reject, or cancel as
            needed.
          </p>
        </div>

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
          onDelete={handleDelete}
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
