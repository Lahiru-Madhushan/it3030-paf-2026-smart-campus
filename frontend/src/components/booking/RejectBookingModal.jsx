import { useState } from 'react'

function RejectBookingModal({ open, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('')

  if (!open) return null

  const handleConfirm = async () => {
    if (!reason.trim()) {
      return
    }

    const result = await onConfirm(reason.trim())
    if (result?.ok) {
      setReason('')
      onClose()
    }
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg space-y-5 rounded-2xl border border-white/60 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">⚠️ Reject Booking</h3>
          <p className="text-sm text-gray-600">Please provide a reason for this rejection. This action cannot be undone.</p>
        </div>

        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          rows="5"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Clearly state the reason for rejecting this booking request..."
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
            type="button"
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
          >
            {loading ? '⏳ Rejecting...' : '✗ Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RejectBookingModal
