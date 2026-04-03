import { RESOURCE_CATEGORIES, RESOURCE_STATUSES, RESOURCE_TYPES } from '../../utils/resourceConstants'
import { isRoomOrLab } from '../../utils/resourceHelpers'

function ResourceForm({ formData, onChange, onSubmit, submitting, submitLabel = 'Save Resource' }) {
  const showLocationFields = isRoomOrLab(formData.resourceType)

  return (
    <form className="resource-card resource-form-card" onSubmit={onSubmit}>
      <div className="resource-form-grid">
        <div>
          <label>Resource Code</label>
          <input name="resourceCode" value={formData.resourceCode} onChange={onChange} required />
        </div>

        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={onChange} required />
        </div>

        <div>
          <label>Type</label>
          <select name="resourceType" value={formData.resourceType} onChange={onChange} required>
            <option value="">Select Type</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={onChange} required>
            <option value="">Select Category</option>
            {RESOURCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Capacity</label>
          <input name="capacity" type="number" min="0" value={formData.capacity} onChange={onChange} />
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={onChange} required>
            <option value="">Select Status</option>
            {RESOURCE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {showLocationFields && (
          <>
            <div>
              <label>Building</label>
              <input name="building" value={formData.building} onChange={onChange} required={showLocationFields} />
            </div>

            <div>
              <label>Floor Number</label>
              <input name="floorNumber" type="number" value={formData.floorNumber} onChange={onChange} />
            </div>

            <div>
              <label>Room Number</label>
              <input name="roomNumber" value={formData.roomNumber} onChange={onChange} required={showLocationFields} />
            </div>
          </>
        )}

        <div>
          <label>Location Text</label>
          <input name="locationText" value={formData.locationText} onChange={onChange} />
        </div>

        <div>
          <label>Available From</label>
          <input name="availableFrom" type="time" value={formData.availableFrom} onChange={onChange} />
        </div>

        <div>
          <label>Available To</label>
          <input name="availableTo" type="time" value={formData.availableTo} onChange={onChange} />
        </div>

        <div>
          <label>Image URL</label>
          <input name="imageUrl" value={formData.imageUrl} onChange={onChange} />
        </div>

        <div className="resource-checkbox-group">
          <label>
            <input
              name="requiresApproval"
              type="checkbox"
              checked={formData.requiresApproval}
              onChange={onChange}
            />
            Requires Approval
          </label>

          <label>
            <input
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={onChange}
            />
            Is Active
          </label>
        </div>

        <div className="resource-full-width">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="resource-form-actions">
        <button className="resource-btn resource-btn-primary" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ResourceForm
