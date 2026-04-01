import BookingStatusBadge from './BookingStatusBadge'

function BookingTable({
  bookings,
  loading,
  isAdmin,
  onApprove,
  onOpenReject,
  onCancel,
}) {
  if (!bookings.length && !loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
        No bookings found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <table className="min-w-full text-left text-sm text-slate-700">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Resource</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Time</th>
            <th className="px-3 py-2">Purpose</th>
            <th className="px-3 py-2">Attendees</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const canCancel =
              booking.status === 'APPROVED' || booking.status === 'PENDING'

            return (
              <tr key={booking.id} className="border-t border-slate-200 align-top">
                <td className="px-3 py-2">{booking.id}</td>
                <td className="px-3 py-2">{booking.resourceId}</td>
                <td className="px-3 py-2">{booking.bookingDate}</td>
                <td className="px-3 py-2">
                  {booking.startTime} - {booking.endTime}
                </td>
                <td className="px-3 py-2">{booking.purpose}</td>
                <td className="px-3 py-2">{booking.expectedAttendees}</td>
                <td className="px-3 py-2">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {isAdmin && booking.status === 'PENDING' ? (
                      <>
                        <button
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                          type="button"
                          onClick={() => onApprove(booking.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                          type="button"
                          onClick={() => onOpenReject(booking.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : null}

                    {canCancel ? (
                      <button
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        type="button"
                        onClick={() => onCancel(booking.id)}
                      >
                        Cancel
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
