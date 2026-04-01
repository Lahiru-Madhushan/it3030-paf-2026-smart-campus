import { apiRequest, authRequest } from './api'

export const authService = {
  sendRegisterOtp: (payload) =>
    apiRequest('/api/auth/register/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyRegisterOtp: (payload) =>
    apiRequest('/api/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCurrentUser: (token) => authRequest('/api/auth/me', token),

  sendForgotPasswordOtp: (payload) =>
    apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload) =>
    apiRequest('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload) =>
    apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAdminUsers: (token) => authRequest('/api/admin/users', token),

  updateUserRole: (token, userId, payload) =>
    authRequest(`/api/admin/users/${userId}/role`, token, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteUser: (token, userId) =>
    authRequest(`/api/admin/users/${userId}`, token, {
      method: 'DELETE',
    }),
}
