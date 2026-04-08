import axiosClient from './axiosClient'

const bookingsApi = {
  createBooking: (payload) => axiosClient.post('/api/bookings', payload),
  getMyBookings: () => axiosClient.get('/api/bookings/my'),
  getAllBookings: (params = {}) => axiosClient.get('/api/bookings', { params }),
  approveBooking: (id) => axiosClient.patch(`/api/bookings/${id}/approve`),
  rejectBooking: (id, reason) =>
    axiosClient.patch(`/api/bookings/${id}/reject`, { reason }),
  cancelBooking: (id) => axiosClient.patch(`/api/bookings/${id}/cancel`),
  deleteBooking: (id) => axiosClient.delete(`/api/bookings/${id}`),
  rescheduleBooking: (id, payload) =>
    axiosClient.patch(`/api/bookings/${id}/reschedule`, payload),
}

export default bookingsApi
