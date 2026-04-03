import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resourceService } from '../../services/resourceService'
import { getErrorMessage } from '../../utils/resourceHelpers'
import ResourceForm from './ResourceForm'

const initialForm = {
  resourceCode: '',
  name: '',
  description: '',
  resourceType: '',
  category: '',
  capacity: '',
  building: '',
  floorNumber: '',
  roomNumber: '',
  locationText: '',
  availableFrom: '',
  availableTo: '',
  status: '',
  imageUrl: '',
  requiresApproval: false,
  isActive: true,
}

function ResourceCreatePage() {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

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

      const created = await resourceService.createResource(auth?.token, payload)
      window.alert('Resource created successfully')
      navigate(`/dashboard/admin/resources/${created.id}`)
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="resource-page-stack">
      <section className="resource-page-header">
        <div>
          <p className="resource-eyebrow">Create Resource</p>
          <h2>Add a new facility or asset</h2>
        </div>
      </section>

      <ResourceForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Create Resource"
      />
    </div>
  )
}

export default ResourceCreatePage
