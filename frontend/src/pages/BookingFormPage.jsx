import BookingForm from '../components/booking/BookingForm'
import { useState } from 'react'
import bookingsApi from '../api/bookingsApi'
import ErrorAlert from '../components/common/ErrorAlert'
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

function BookingFormPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (payload) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { data } = await bookingsApi.createBooking(payload)
      setSuccess('Booking request submitted successfully.')
      return { ok: true, data }
    } catch (apiError) {
      const isConflict = apiError?.response?.status === 409
      const fallback = isConflict
        ? 'Booking conflict detected. Please select another time slot.'
        : 'Failed to create booking request.'

      const message = getFriendlyError(apiError, fallback)
      setError(message)
      return { ok: false, message, status: apiError?.response?.status }
    } finally {
      setLoading(false)
    }
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
