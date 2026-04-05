import { useEffect, useState } from 'react'
import BookingTable from '../components/booking/BookingTable'
import FilterBar from '../components/booking/FilterBar'
import RejectBookingModal from '../components/booking/RejectBookingModal'
import ErrorAlert from '../components/common/ErrorAlert'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SuccessAlert from '../components/common/SuccessAlert'
import { useBooking } from '../contexts/BookingContext'

const INITIAL_FILTERS = {
  status: '',
  bookingDate: '',
  resourceId: '',
}

function AdminBookingsPage() {
  const {
    bookings,
    loading,
    error,
    success,
    fetchAllBookings,
    approveBooking,
    rejectBooking,
    cancelBooking,
  } = useBooking()

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  useEffect(() => {
    fetchAllBookings({})
  }, [fetchAllBookings])

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
    const result = await approveBooking(bookingId)
    if (result.ok) {
      applyFilters()
    }
  }

  const handleReject = async (reason) => {
    if (!selectedBookingId) {
      return { ok: false }
    }

    const result = await rejectBooking(selectedBookingId, reason)
    if (result.ok) {
      applyFilters()
      setSelectedBookingId(null)
    }

    return result
  }

  const handleCancel = async (bookingId) => {
    const result = await cancelBooking(bookingId)
    if (result.ok) {
      applyFilters()
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
