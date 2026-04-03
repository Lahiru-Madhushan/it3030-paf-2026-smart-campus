import { RESOURCE_STATUSES, RESOURCE_TYPES } from '../../utils/resourceConstants'

function ResourceFilters({ filters, onChange, onReset }) {
  return (
    <div className="resource-card">
      <div className="resource-filters-grid">
        <input
          type="text"
          placeholder="Search by code, name, description..."
          value={filters.keyword}
          onChange={(e) => onChange('keyword', e.target.value)}
        />

        <select value={filters.type} onChange={(e) => onChange('type', e.target.value)}>
          <option value="">All Types</option>
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All Statuses</option>
          {RESOURCE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by building"
          value={filters.building}
          onChange={(e) => onChange('building', e.target.value)}
        />

        <input
          type="number"
          min="0"
          placeholder="Minimum capacity"
          value={filters.minCapacity}
          onChange={(e) => onChange('minCapacity', e.target.value)}
        />

        <select value={filters.sortDir} onChange={(e) => onChange('sortDir', e.target.value)}>
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      <div className="resource-filters-actions">
        <button className="resource-btn" onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default ResourceFilters
