import { useMemo, useState } from 'react'

const DEFAULT_FORM = {
  resourceId: '',
  bookingDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
}

function BookingForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [formError, setFormError] = useState('')

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (
      !formData.resourceId ||
      !formData.bookingDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose ||
      !formData.expectedAttendees
    ) {
      return 'Please fill all booking fields.'
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

    const validationMessage = validateForm()
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

    const result = await onSubmit(payload)

    if (result?.ok) {
      setFormData(DEFAULT_FORM)
    }
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold text-slate-900">Create Booking Request</h2>

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Resource ID
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="number"
          name="resourceId"
          value={formData.resourceId}
          onChange={handleChange}
          placeholder="e.g. 1"
          min="1"
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Booking Date
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={minDate}
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Start Time
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        End Time
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Purpose
        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          rows="3"
          placeholder="State your booking purpose"
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Expected Attendees
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="number"
          name="expectedAttendees"
          value={formData.expectedAttendees}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 25"
        />
      </label>

      <button
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Booking'}
      </button>
    </form>
  )
}

export default BookingForm
