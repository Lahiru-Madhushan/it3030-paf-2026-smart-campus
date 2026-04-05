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
      className="space-y-5 rounded-2xl border border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-900">Create Booking Request</h2>

      {formError ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          ⚠️ {formError}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Resource ID
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="number"
          name="resourceId"
          value={formData.resourceId}
          onChange={handleChange}
          placeholder="e.g. 1"
          min="1"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Booking Date
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={minDate}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Start Time
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          End Time
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Purpose
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          rows="4"
          placeholder="State your booking purpose"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Expected Attendees
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="number"
          name="expectedAttendees"
          value={formData.expectedAttendees}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 25"
        />
      </div>

      <button
        className="mt-2 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 text-sm font-bold text-white shadow-lg hover:from-yellow-500 hover:to-yellow-600 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
        type="submit"
        disabled={loading}
      >
        {loading ? '⏳ Submitting...' : '✓ Submit Booking'}
      </button>
    </form>
  )
}

export default BookingForm
