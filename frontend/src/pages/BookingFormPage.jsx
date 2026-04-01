import BookingForm from '../components/booking/BookingForm'
import ErrorAlert from '../components/common/ErrorAlert'
import SuccessAlert from '../components/common/SuccessAlert'
import { useBooking } from '../contexts/BookingContext'

function BookingFormPage() {
  const { createBooking, loading, error, success, clearMessages } = useBooking()

  const handleSubmit = async (payload) => {
    clearMessages()
    return createBooking(payload)
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">New Booking</h1>
      <p className="text-sm text-slate-600">
        Submit a booking request for a campus resource. Conflict and validation
        errors from backend are shown clearly.
      </p>

      <ErrorAlert message={error} />
      <SuccessAlert message={success} />

      <BookingForm onSubmit={handleSubmit} loading={loading} />
    </section>
  )
}

export default BookingFormPage
