import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resourceService } from '../../services/resourceService'
import { RESOURCE_STATUSES } from '../../utils/resourceConstants'
import { formatStatus, getErrorMessage } from '../../utils/resourceHelpers'
import EmptyState from './common/EmptyState'
import ErrorState from './common/ErrorState'
import LoadingState from './common/LoadingState'
import StatusBadge from './StatusBadge'

function ResourceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchResource = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await resourceService.getResourceById(auth?.token, id)
      setResource(data)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth?.token) {
      return
    }
    fetchResource()
  }, [auth?.token, id])

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?')
    if (!confirmed) {
      return
    }

    try {
      await resourceService.deleteResource(auth?.token, id)
      window.alert('Resource deleted successfully')
      navigate('/dashboard/admin/resources')
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  const handleStatusChange = async (event) => {
    try {
      const updated = await resourceService.updateResourceStatus(auth?.token, id, { status: event.target.value })
      setResource(updated)
      window.alert('Status updated successfully')
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  if (loading) {
    return <LoadingState text="Loading resource details..." />
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={fetchResource} />
  }

  if (!resource) {
    return (
      <EmptyState
        title="Resource not found"
        description="The requested resource could not be loaded."
      />
    )
  }

  return (
    <div className="resource-page-stack">
      <section className="resource-card resource-detail-header">
        <div>
          <p className="resource-eyebrow">Resource Details</p>
          <h2>{resource.name}</h2>
          <p>{resource.resourceCode}</p>
        </div>

        <div className="resource-detail-actions">
          <Link className="resource-btn" to={`/dashboard/admin/resources/${resource.id}/edit`}>
            Edit Resource
          </Link>
          <button className="resource-btn resource-btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </section>

      <div className="resource-details-grid">
        <div className="resource-card resource-detail-card">
          <h3>Core Information</h3>
          <div className="resource-detail-list">
            <div><span>Type</span><strong>{resource.resourceType}</strong></div>
            <div><span>Category</span><strong>{resource.category}</strong></div>
            <div><span>Status</span><strong><StatusBadge status={resource.status} /></strong></div>
            <div><span>Capacity</span><strong>{resource.capacity ?? '-'}</strong></div>
            <div><span>Requires Approval</span><strong>{resource.requiresApproval ? 'Yes' : 'No'}</strong></div>
            <div><span>Active</span><strong>{resource.isActive ? 'Yes' : 'No'}</strong></div>
          </div>
        </div>

        <div className="resource-card resource-detail-card">
          <h3>Location & Availability</h3>
          <div className="resource-detail-list">
            <div><span>Building</span><strong>{resource.building || '-'}</strong></div>
            <div><span>Floor</span><strong>{resource.floorNumber ?? '-'}</strong></div>
            <div><span>Room Number</span><strong>{resource.roomNumber || '-'}</strong></div>
            <div><span>Location</span><strong>{resource.locationText || '-'}</strong></div>
            <div><span>Available From</span><strong>{resource.availableFrom || '-'}</strong></div>
            <div><span>Available To</span><strong>{resource.availableTo || '-'}</strong></div>
          </div>
        </div>

        <div className="resource-card resource-detail-card resource-full-width">
          <h3>Description</h3>
          <p>{resource.description || 'No description provided.'}</p>
        </div>

        <div className="resource-card resource-detail-card resource-full-width">
          <h3>Quick Status Update</h3>
          <div className="resource-inline-form">
            <label htmlFor="resourceStatusSelect">Change Status</label>
            <select id="resourceStatusSelect" value={resource.status} onChange={handleStatusChange}>
              {RESOURCE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailsPage
