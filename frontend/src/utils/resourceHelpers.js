export const getErrorMessage = (error) => {
  const validationErrors = error?.validationErrors
  if (validationErrors && typeof validationErrors === 'object') {
    return Object.values(validationErrors).join(', ')
  }

  const messages = error?.messages
  if (messages && typeof messages === 'object') {
    return Object.values(messages).join(', ')
  }

  return error?.message || 'Something went wrong'
}

export const formatStatus = (status) =>
  status
    ?.toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const isRoomOrLab = (resourceType) =>
  resourceType === 'ROOM' || resourceType === 'LAB'
