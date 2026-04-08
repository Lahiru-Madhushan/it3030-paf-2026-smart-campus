import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { API_BASE_URL } from '../../utils/constants'
import frontImage from '../../assets/front.jpg'
import logo1 from '../../assets/logo1.png'

const initialForm = {
  name: '',
  email: '',
  password: '',
  otp: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authService.sendRegisterOtp({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setMessage(response.message || 'OTP sent successfully.')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await authService.verifyRegisterOtp({
        email: form.email,
        otp: form.otp,
      })

      navigate('/login', {
        replace: true,
        state: { successMessage: 'Registration completed. Please login now.' },
      })
    } catch (err) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-yellow-50">
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
              One platform for your campus
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

              <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Join Campus Hub with secure OTP verification.
              </p>
            </div>

            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

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
                    placeholder="Create password"
                    value={form.password}
                    minLength={6}
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

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                <a
                  href={`${API_BASE_URL}/oauth2/authorization/google`}
                  className="block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Sign up with Google
                </a>

                <p className="text-center text-sm text-gray-600">
                  Already registered?{' '}
                  <Link to="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
                    Login
                  </Link>
                </p>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleVerify}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter email OTP"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  OTP sent to <strong>{form.email}</strong>. Verify to complete registration.
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
                  {loading ? 'Verifying...' : 'Verify & Complete'}
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
          </div>
        </div>
      </div>
    </div>
  )
}