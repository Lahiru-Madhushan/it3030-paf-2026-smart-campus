import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import bookingsApi from '../api/bookingsApi'

const BookingContext = createContext(null)

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

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  const fetchMyBookings = useCallback(async () => {
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
  }, [])

  const fetchAllBookings = useCallback(async (filters = {}) => {
    setLoading(true)
    setError('')

    try {
      const { data } = await bookingsApi.getAllBookings(filters)
      setBookings(Array.isArray(data) ? data : [])
    } catch (apiError) {
      setError(getFriendlyError(apiError, 'Failed to fetch bookings.'))
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (payload) => {
    setLoading(true)
    setError('')
    setSuccess('')

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
  }, [])

  const approveBooking = useCallback(async (bookingId) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.approveBooking(bookingId)
      setSuccess('Booking approved successfully.')
      return { ok: true }
    } catch (apiError) {
      const message = getFriendlyError(apiError, 'Failed to approve booking.')
      setError(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const rejectBooking = useCallback(async (bookingId, reason) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.rejectBooking(bookingId, reason)
      setSuccess('Booking rejected successfully.')
      return { ok: true }
    } catch (apiError) {
      const message = getFriendlyError(apiError, 'Failed to reject booking.')
      setError(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await bookingsApi.cancelBooking(bookingId)
      setSuccess('Booking cancelled successfully.')
      return { ok: true }
    } catch (apiError) {
      const message = getFriendlyError(apiError, 'Failed to cancel booking.')
      setError(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      bookings,
      myBookings,
      loading,
      error,
      success,
      clearMessages,
      fetchMyBookings,
      fetchAllBookings,
      createBooking,
      approveBooking,
      rejectBooking,
      cancelBooking,
      setBookings,
      setMyBookings,
    }),
    [
      bookings,
      myBookings,
      loading,
      error,
      success,
      clearMessages,
      fetchMyBookings,
      fetchAllBookings,
      createBooking,
      approveBooking,
      rejectBooking,
      cancelBooking,
    ],
  )

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)

  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }

  return context
}
