import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { API_BASE_URL } from '../../utils/constants'
import { getDashboardPath } from '../../utils/roleRedirect'
import frontImage from '../../assets/front.jpg'
import logo1 from '../../assets/logo1.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, currentUser } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && currentUser?.role) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(form)
      const from = location.state?.from?.pathname
      navigate(from || getDashboardPath(response.role), { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-5">
        {/* LEFT SIDE */}
        <div
          className="relative hidden overflow-hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center"
          style={{
            backgroundImage: `url(${frontImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 px-10 text-center text-white">
            <div className="mb-6 flex items-center justify-center gap-4">
              <img
                src={logo1}
                alt="Campus Hub Logo"
                className="h-20 w-20 object-contain drop-shadow-xl"
              />

              <div className="text-left">
                <h1 className="text-3xl font-bold">Campus Hub</h1>
                <p className="text-sm text-gray-200">
                  Smart campus management system
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Welcome back to Campus Hub
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 flex items-center justify-center p-0">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-8">
              <Link
                to="/"
                className="mb-4 inline-block text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to home
              </Link>

              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Login to continue to your Campus Hub dashboard.
              </p>
            </div>

            {location.state?.successMessage && (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {location.state.successMessage}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#0A192F] px-4 py-3 font-semibold text-white transition hover:bg-[#081425] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <Link
                to="/forgot-password"
                className="text-center font-medium text-gray-600 hover:text-gray-800"
              >
                Forgot password?
              </Link>

              <a
                href={`${API_BASE_URL}/oauth2/authorization/google`}
                className="block rounded-2xl border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Continue with Google
              </a>

              <p className="pt-2 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-yellow-600 hover:text-yellow-700"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}