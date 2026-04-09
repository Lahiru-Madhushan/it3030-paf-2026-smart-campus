import { useEffect, useMemo, useState } from 'react'

const EMPTY_FORM = {
  resourceId: '',
  bookingDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
}

function RescheduleBookingModal({ open, booking, loading, onClose, onConfirm }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    if (!booking) {
      setFormData(EMPTY_FORM)
      setFormError('')
      return
    }

    setFormData({
      resourceId: String(booking.resourceId ?? ''),
      bookingDate: booking.bookingDate ?? '',
      startTime: booking.startTime ?? '',
      endTime: booking.endTime ?? '',
      purpose: booking.purpose ?? '',
      expectedAttendees: String(booking.expectedAttendees ?? ''),
    })
    setFormError('')
  }, [booking])

  if (!open || !booking) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (
      !formData.resourceId ||
      !formData.bookingDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose ||
      !formData.expectedAttendees
    ) {
      return 'Please fill all fields before rescheduling.'
    }

    if (formData.startTime >= formData.endTime) {
      return 'Start time must be earlier than end time.'
    }

    if (Number(formData.expectedAttendees) <= 0) {
      return 'Expected attendees must be greater than zero.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationMessage = validate()
    if (validationMessage) {
      setFormError(validationMessage)
      return
    }

    setFormError('')

    const payload = {
      resourceId: Number(formData.resourceId),
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose.trim(),
      expectedAttendees: Number(formData.expectedAttendees),
    }

    const result = await onConfirm(payload)
    if (result?.ok) {
      onClose()
    } else if (result?.message) {
      setFormError(result.message)
    }
  }

  const handleClose = () => {
    setFormError('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">Reschedule Booking</h3>
          <p className="text-sm text-gray-600">
            Update booking date/time and details. This request will move back to pending approval.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              {formError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Resource ID</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                type="number"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Booking Date</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                min={minDate}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Start Time</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">End Time</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">Purpose</label>
              <textarea
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                rows="3"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">Expected Attendees</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-2xl border border-[#0A192F] bg-white px-4 py-2 text-sm font-semibold text-[#0A192F] transition hover:bg-[#e8edf5]"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              className="rounded-2xl bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#081425] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RescheduleBookingModal
