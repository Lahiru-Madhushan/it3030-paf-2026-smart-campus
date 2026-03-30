import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authService.sendForgotPasswordOtp({
        email: form.email,
      })
      setMessage(response.message || 'OTP sent successfully.')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await authService.resetPassword(form)
      setMessage('Password reset successfully. You can login now.')
      setStep(3)
    } catch (err) {
      setError(err.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-yellow-50">
      <div className="grid min-h-screen lg:grid-cols-5">
        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden lg:col-span-3 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.65),rgba(243,244,246,0.55),rgba(254,249,195,0.35))]" />

          <div className="relative z-10 flex h-full flex-col justify-between px-12 py-10">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-400 px-4 py-2 font-bold text-white shadow">
                CH
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Campus Hub</h1>
                <p className="text-sm text-gray-600">Smart campus management system</p>
              </div>
            </div>

            <div />

            <div className="text-sm text-gray-500">Campus Hub © 2026</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 lg:col-span-2">
          <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <Link
                to="/login"
                className="mb-4 inline-block text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to login
              </Link>

              <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Get an OTP to your email and set a new password securely.
              </p>
            </div>

            {step === 1 && (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    minLength={6}
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Back
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
                  {message}
                </div>

                <Link
                  to="/login"
                  className="block w-full rounded-2xl bg-yellow-400 px-4 py-3 text-center font-semibold text-white transition hover:bg-yellow-500"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}