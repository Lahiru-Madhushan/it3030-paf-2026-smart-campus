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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
      <section className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">New Booking</h1>
          <p className="text-base text-gray-600">
            Submit a booking request for a campus resource. Conflict and validation
            errors from backend are shown clearly.
          </p>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert message={success} />

        <BookingForm onSubmit={handleSubmit} loading={loading} />
      </section>
    </div>
  )
}

export default BookingFormPage
