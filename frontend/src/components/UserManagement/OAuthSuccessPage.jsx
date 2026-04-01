import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRedirect'

export default function OAuthSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { finishOAuthLogin } = useAuth()
  const [error, setError] = useState('')
  const hasHandledCallback = useRef(false)

  useEffect(() => {
    if (hasHandledCallback.current) return
    hasHandledCallback.current = true

    const completeOAuth = async () => {
      const searchParams = new URLSearchParams(location.search)
      const token = searchParams.get('token')
      const role = searchParams.get('role')

      if (!token) {
        setError('Google login did not return a token. Please try again.')
        return
      }

      try {
        await finishOAuthLogin({ token, role })
        navigate(getDashboardPath(role), { replace: true })
      } catch {
        setError('Unable to complete Google login. Please sign in again.')
      }
    }

    completeOAuth()
  }, [finishOAuthLogin, location.search, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow">
          <h2 className="text-lg font-semibold text-red-600">Login Failed</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 rounded-xl bg-yellow-400 px-4 py-2 font-medium text-white hover:bg-yellow-500"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-600">Completing Google sign-in...</p>
    </div>
  )
}
