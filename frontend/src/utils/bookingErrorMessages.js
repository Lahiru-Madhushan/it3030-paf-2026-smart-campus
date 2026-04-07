export function getBookingErrorMessage(error, fallbackMessage) {
  const response = error?.response
  const status = response?.status
  const raw =
    (typeof response?.data === 'string' && response.data) ||
    response?.data?.message ||
    response?.data?.error ||
    ''

  const message = String(raw).toLowerCase()

  if (!response) {
    return 'Cannot connect to the server right now. Please try again in a moment.'
  }

  if (status === 409) {
    return 'This time slot is already taken. Please choose another time.'
  }

  if (message.includes('before end time')) {
    return 'Start time must be earlier than end time.'
  }

  if (message.includes('in the future')) {
    return 'For today, please choose a future start time.'
  }

  if (message.includes('capacity')) {
    return 'The selected resource capacity is lower than the attendee count.'
  }

  if (message.includes('not found')) {
    return 'The selected booking or resource was not found.'
  }

  if (message.includes('not currently bookable')) {
    return 'This resource is currently unavailable for booking.'
  }

  if (message.includes('borrowed')) {
    return 'This resource is currently borrowed and cannot be booked now.'
  }

  if (message.includes('needs repair')) {
    return 'This resource is under repair and cannot be booked now.'
  }

  if (message.includes('availability window')) {
    return 'Please choose a time within the resource available hours.'
  }

  if (message.includes('only cancelled bookings can be deleted')) {
    return 'Only cancelled bookings can be permanently deleted.'
  }

  if (message.includes('owner or an admin can delete')) {
    return 'You are not allowed to delete this booking.'
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (status === 400) {
    return 'Please check your booking details and try again.'
  }

  return fallbackMessage
}
