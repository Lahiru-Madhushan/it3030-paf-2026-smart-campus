import BookingStatusBadge from './BookingStatusBadge'

function BookingTable({
  bookings,
  loading,
  isAdmin,
  onApprove,
  onOpenReject,
  onCancel,
  onDelete,
  onOpenReschedule,
}) {
  if (!bookings.length && !loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <p className="text-base font-medium text-gray-600">📭 No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
      <table className="min-w-full text-left text-sm text-gray-700">
        <thead>
          <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">ID</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Resource</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Date</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Time</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Purpose</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Attendees</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => {
            const canCancel =
              booking.status === 'APPROVED' || booking.status === 'PENDING'
            const canReschedule =
              booking.status === 'APPROVED' || booking.status === 'PENDING'
            const canDelete = booking.status === 'CANCELLED'

            return (
              <tr
                key={booking.id}
                className={`border-b border-slate-100 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                } hover:bg-[#e8edf5]/60`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 text-gray-700">Resource #{booking.resourceId}</td>
                <td className="px-6 py-4 text-gray-700">{booking.bookingDate}</td>
                <td className="px-6 py-4 text-gray-700">
                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {booking.startTime} → {booking.endTime}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs text-gray-700">
                  <div className="truncate" title={booking.purpose}>{booking.purpose}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                    👥 {booking.expectedAttendees}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {isAdmin && booking.status === 'PENDING' ? (
                      <>
                        <button
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-all"
                          type="button"
                          onClick={() => onApprove(booking.id)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-red-600 transition-all"
                          type="button"
                          onClick={() => onOpenReject(booking.id)}
                        >
                          ✗ Reject
                        </button>
                      </>
                    ) : null}

                    {canCancel ? (
                      <button
                        className="rounded-2xl border border-[#0A192F] bg-white px-3 py-1.5 text-xs font-semibold text-[#0A192F] transition hover:bg-[#e8edf5]"
                        type="button"
                        onClick={() => onCancel(booking.id)}
                      >
                        ⊘ Cancel
                      </button>
                    ) : null}

                    {canDelete ? (
                      <button
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-all"
                        type="button"
                        onClick={() => onDelete?.(booking.id)}
                      >
                        Delete
                      </button>
                    ) : null}

                    {!isAdmin && canReschedule ? (
                      <button
                        className="rounded-2xl bg-[#0A192F] px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#081425]"
                        type="button"
                        onClick={() => onOpenReschedule(booking)}
                      >
                        Reschedule
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BookingTable
