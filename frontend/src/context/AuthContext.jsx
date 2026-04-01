import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth())
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getStoredAuth()?.token))

  useEffect(() => {
    const boot = async () => {
      if (!auth?.token) {
        setCurrentUser(null)
        setLoading(false)
        return
      }

      try {
        const user = await authService.getCurrentUser(auth.token)
        setCurrentUser(user)
      } catch {
        clearStoredAuth()
        setAuth(null)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    boot()
  }, [auth?.token])

  const value = useMemo(
    () => ({
      auth,
      currentUser,
      loading,
      isAuthenticated: Boolean(auth?.token),
      login: async (credentials) => {
        const response = await authService.login(credentials)
        try {
          setStoredAuth(response)
          setAuth(response)
          const user = await authService.getCurrentUser(response.token)
          setCurrentUser(user)
          return response
        } catch (error) {
          clearStoredAuth()
          setAuth(null)
          setCurrentUser(null)
          throw error
        }
      },
      finishOAuthLogin: async (payload) => {
        try {
          setStoredAuth(payload)
          setAuth(payload)
          const user = await authService.getCurrentUser(payload.token)
          setCurrentUser(user)
        } catch (error) {
          clearStoredAuth()
          setAuth(null)
          setCurrentUser(null)
          throw error
        }
      },
      logout: () => {
        clearStoredAuth()
        setAuth(null)
        setCurrentUser(null)
      },
    }),
    [auth, currentUser, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
