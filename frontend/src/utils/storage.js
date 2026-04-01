import { STORAGE_KEY } from './constants'

export function getStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setStoredAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}
