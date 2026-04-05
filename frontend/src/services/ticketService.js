import { authRequest } from './api'

export const ticketService = {

  // Create a new ticket
  createTicket: (token, payload) =>
    authRequest('/api/tickets', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Get all tickets (Admin)
  getAllTickets: (token) => authRequest('/api/tickets', token),

  // Get my tickets (User)
  getMyTickets: (token) => authRequest('/api/tickets/my', token),

  // Get one ticket by id
  getTicketById: (token, id) => authRequest(`/api/tickets/${id}`, token),

  // Update ticket status
  updateStatus: (token, id, status, reason = '') =>
    authRequest(`/api/tickets/${id}/status?status=${status}${reason ? `&reason=${reason}` : ''}`, token, {
      method: 'PATCH',
    }),

  // Assign technician
  assignTechnician: (token, id, technicianEmail) =>
    authRequest(`/api/tickets/${id}/assign?technicianEmail=${technicianEmail}`, token, {
      method: 'PATCH',
    }),

  // Delete ticket
  deleteTicket: (token, id) =>
    authRequest(`/api/tickets/${id}`, token, {
      method: 'DELETE',
    }),

  // Add comment
  addComment: (token, ticketId, payload) =>
    authRequest(`/api/tickets/${ticketId}/comments`, token, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Get comments
  getComments: (token, ticketId) =>
    authRequest(`/api/tickets/${ticketId}/comments`, token),

  // Edit comment
  editComment: (token, ticketId, commentId, payload) =>
    authRequest(`/api/tickets/${ticketId}/comments/${commentId}`, token, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Delete comment
  deleteComment: (token, ticketId, commentId) =>
    authRequest(`/api/tickets/${ticketId}/comments/${commentId}`, token, {
      method: 'DELETE',
    }),

  // Upload attachment
  uploadAttachment: (token, ticketId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`http://localhost:8088/api/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json())
  },

  // Get attachments
  getAttachments: (token, ticketId) =>
    authRequest(`/api/tickets/${ticketId}/attachments`, token),

  // Delete attachment
  deleteAttachment: (token, ticketId, attachmentId) =>
    authRequest(`/api/tickets/${ticketId}/attachments/${attachmentId}`, token, {
      method: 'DELETE',
    }),
}