import axios from 'axios'
import { STORAGE_KEY } from '../utils/constants'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosClient.interceptors.request.use((config) => {
  const authData = localStorage.getItem(STORAGE_KEY)
  const auth = authData ? JSON.parse(authData) : null
  const token = auth?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error)
    }

    return Promise.reject({
      ...error,
      response: {
        data: {
          message:
            'Unable to reach server. Ensure backend runs on 8088, open frontend via localhost:5173, and set JWT token if endpoints require authentication.',
        },
      },
    })
  },
)

export default axiosClient
