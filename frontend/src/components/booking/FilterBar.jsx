function FilterBar({ filters, onChange, onApply, onReset }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl md:grid-cols-4 md:items-end">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Status
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">🕐 PENDING</option>
          <option value="APPROVED">✓ APPROVED</option>
          <option value="REJECTED">✗ REJECTED</option>
          <option value="CANCELLED">⊘ CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Date
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="date"
          name="bookingDate"
          value={filters.bookingDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Resource ID
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
          type="number"
          name="resourceId"
          value={filters.resourceId}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 2"
        />
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all md:flex-none"
          type="button"
          onClick={onApply}
        >
          🔍 Apply
        </button>
        <button
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all md:flex-none"
          type="button"
          onClick={onReset}
        >
          ⟲ Reset
        </button>
      </div>
    </div>
  )
}

export default FilterBar
