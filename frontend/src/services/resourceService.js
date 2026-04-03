import { authRequest } from './api'

export const resourceService = {
  getResources(token, params = {}) {
    const search = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        search.set(key, value)
      }
    })

    const suffix = search.toString() ? `?${search.toString()}` : ''
    return authRequest(`/api/resources${suffix}`, token)
  },

  getResourceById(token, id) {
    return authRequest(`/api/resources/${id}`, token)
  },

  createResource(token, payload) {
    return authRequest('/api/resources', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateResource(token, id, payload) {
    return authRequest(`/api/resources/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  updateResourceStatus(token, id, payload) {
    return authRequest(`/api/resources/${id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  deleteResource(token, id) {
    return authRequest(`/api/resources/${id}`, token, {
      method: 'DELETE',
    })
  },
}
