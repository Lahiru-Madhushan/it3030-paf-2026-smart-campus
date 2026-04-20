import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import frontImage from '../../assets/front.jpg'
import logo1 from '../../assets/logo1.png'

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

  const inputClass =
    'w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100'

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
        {/* LEFT SIDE — same as RegisterPage */}
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
                <p className="text-sm text-gray-200">Smart campus management system</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              One platform for your campus
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-0 lg:col-span-2">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-8">
              <Link
                to="/login"
                className="mb-4 inline-block text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to login
              </Link>

              <h2 className="text-3xl font-bold text-gray-900">Forgot password</h2>
              <p className="mt-2 text-sm text-gray-600">
                Get an OTP to your email and set a new password securely.
              </p>
            </div>

            {step === 1 && (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className={inputClass}
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
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#0A192F] px-4 py-3 font-semibold text-white transition hover:bg-[#081425] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
                    Login
                  </Link>
                </p>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">OTP Code</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    minLength={6}
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  OTP sent to <strong>{form.email}</strong>. Enter the code and your new password.
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#0A192F] px-4 py-3 font-semibold text-white transition hover:bg-[#081425] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
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
                  className="block w-full rounded-2xl bg-[#0A192F] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#081425]"
                >
                  Go to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
