const STATUS_CLASS_MAP = {
  PENDING: 'border-amber-300 bg-amber-50 text-amber-700',
  APPROVED: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-red-300 bg-red-50 text-red-700',
  CANCELLED: 'border-slate-300 bg-slate-100 text-slate-700',
}

function BookingStatusBadge({ status = 'PENDING' }) {
  const normalizedStatus = String(status).toUpperCase()
  const className =
    STATUS_CLASS_MAP[normalizedStatus] || 'border-amber-300 bg-amber-50 text-amber-700'

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {normalizedStatus}
    </span>
  )
}

export default BookingStatusBadge
