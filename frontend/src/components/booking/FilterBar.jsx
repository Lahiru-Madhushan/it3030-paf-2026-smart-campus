function FilterBar({ filters, onChange, onApply, onReset }) {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 md:items-end">
      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Status
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Date
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="date"
          name="bookingDate"
          value={filters.bookingDate}
          onChange={handleChange}
        />
      </label>

      <label className="block space-y-1 text-sm font-medium text-slate-700">
        Resource ID
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          type="number"
          name="resourceId"
          value={filters.resourceId}
          onChange={handleChange}
          min="1"
          placeholder="e.g. 2"
        />
      </label>

      <div className="flex gap-2 md:justify-end">
        <button
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          type="button"
          onClick={onApply}
        >
          Apply Filters
        </button>
        <button
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          type="button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterBar
