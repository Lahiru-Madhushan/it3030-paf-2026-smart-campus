import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resourceService } from '../../services/resourceService'
import { getErrorMessage } from '../../utils/resourceHelpers'
import ErrorState from './common/ErrorState'
import LoadingState from './common/LoadingState'
import ResourceForm from './ResourceForm'

function ResourceEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth } = useAuth()

  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchResource = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await resourceService.getResourceById(auth?.token, id)
      setFormData({
        resourceCode: data.resourceCode || '',
        name: data.name || '',
        description: data.description || '',
        resourceType: data.resourceType || '',
        category: data.category || '',
        capacity: data.capacity ?? '',
        building: data.building || '',
        floorNumber: data.floorNumber ?? '',
        roomNumber: data.roomNumber || '',
        locationText: data.locationText || '',
        availableFrom: data.availableFrom || '',
        availableTo: data.availableTo || '',
        status: data.status || '',
        imageUrl: data.imageUrl || '',
        requiresApproval: data.requiresApproval ?? false,
        isActive: data.isActive ?? true,
      })
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        capacity: formData.capacity === '' ? null : Number(formData.capacity),
        floorNumber: formData.floorNumber === '' ? null : Number(formData.floorNumber),
      }
      await resourceService.updateResource(auth?.token, id, payload)
      window.alert('Resource updated successfully')
      navigate(`/dashboard/admin/resources/${id}`)
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState text="Loading resource..." />
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={fetchResource} />
  }

  return (
    <div className="resource-page-stack">
      <section className="resource-page-header">
        <div>
          <p className="resource-eyebrow">Edit Resource</p>
          <h2>Update facility or asset details</h2>
        </div>
      </section>

      <ResourceForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Update Resource"
      />
    </div>
  )
}

export default ResourceEditPage
