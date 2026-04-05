import { createContext, useContext, useMemo, useState } from 'react'

const UserContext = createContext(null)

const MOCK_USERS = {
  USER: {
    id: 101,
    name: 'Nimal Student',
    email: 'nimal@student.smartcampus.edu',
    role: 'USER',
  },
  ADMIN: {
    id: 1,
    name: 'System Admin',
    email: 'admin@smartcampus.edu',
    role: 'ADMIN',
  },
}

const getInitialRole = () => {
  const savedRole = localStorage.getItem('mock-role')
  return savedRole === 'ADMIN' ? 'ADMIN' : 'USER'
}

export function UserProvider({ children }) {
  const [role, setRole] = useState(getInitialRole)
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem('auth-token') || '',
  )

  const switchRole = (nextRole) => {
    const safeRole = nextRole === 'ADMIN' ? 'ADMIN' : 'USER'
    setRole(safeRole)
    localStorage.setItem('mock-role', safeRole)
  }

  const saveAuthToken = (token) => {
    const safeToken = token?.trim() || ''
    setAuthToken(safeToken)

    if (safeToken) {
      localStorage.setItem('auth-token', safeToken)
    } else {
      localStorage.removeItem('auth-token')
    }
  }

  const value = useMemo(
    () => ({
      currentUser: MOCK_USERS[role],
      role,
      isAdmin: role === 'ADMIN',
      isUser: role === 'USER',
      switchRole,
      authToken,
      saveAuthToken,
    }),
    [role, authToken],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }

  return context
}
