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
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">Reject Booking</h3>
        <p className="text-sm text-slate-600">Please provide a reason for rejection.</p>

        <textarea
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows="4"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Enter rejection reason"
        />

        <div className="flex justify-end gap-2">
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Rejecting...' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RejectBookingModal
