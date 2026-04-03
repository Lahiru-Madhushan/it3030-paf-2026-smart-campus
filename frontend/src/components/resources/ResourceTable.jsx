import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ResourceTable({ resources, onDelete }) {
  return (
    <div className="resource-card">
      <div className="resource-table-wrapper">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Building</th>
              <th>Status</th>
              <th className="resource-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.resourceCode}</td>
                <td>{resource.name}</td>
                <td>{resource.resourceType}</td>
                <td>{resource.category}</td>
                <td>{resource.capacity ?? '-'}</td>
                <td>{resource.building || '-'}</td>
                <td><StatusBadge status={resource.status} /></td>
                <td className="resource-actions-cell">
                  <Link className="resource-text-link" to={`/dashboard/admin/resources/${resource.id}`}>
                    View
                  </Link>
                  <Link className="resource-text-link" to={`/dashboard/admin/resources/${resource.id}/edit`}>
                    Edit
                  </Link>
                  <button className="resource-text-link resource-danger-link" onClick={() => onDelete(resource.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResourceTable
