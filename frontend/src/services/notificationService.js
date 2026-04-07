import { authRequest } from './api'

export const notificationService = {
  getMyNotifications: (token) =>
    authRequest('/api/notifications', token),

  getUnreadCount: (token) =>
    authRequest('/api/notifications/unread-count', token),

  markAsRead: (token, id) =>
    authRequest(`/api/notifications/${id}/read`, token, {
      method: 'PATCH',
    }),

  markAllAsRead: (token) =>
    authRequest('/api/notifications/read-all', token, {
      method: 'PATCH',
    }),

  deleteNotification: (token, id) =>
    authRequest(`/api/notifications/${id}`, token, {
      method: 'DELETE',
    }),
}