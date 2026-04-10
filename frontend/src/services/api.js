import { API_BASE_URL } from '../utils/constants'

async function parseResponse(response) {
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null
  }

  const contentType = response.headers.get('content-type')
  let data = null

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    const text = await response.text()
    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = { message: text }
      }
    }
  }

  if (!response.ok) {
    const validationMessages = data?.messages && typeof data.messages === 'object'
      ? Object.values(data.messages).filter(Boolean)
      : []
    const message =
      validationMessages[0] ||
      data?.message ||
      data?.error ||
      'Something went wrong'
    throw new Error(message)
  }

  return data
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  return parseResponse(response)
}

export async function authRequest(path, token, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
}
