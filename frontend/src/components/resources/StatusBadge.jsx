import { formatStatus } from '../../utils/resourceHelpers'

function StatusBadge({ status }) {
  const statusClass = status ? `resource-status-badge ${status.toLowerCase()}` : 'resource-status-badge'

  return <span className={statusClass}>{formatStatus(status)}</span>
}

export default StatusBadge
