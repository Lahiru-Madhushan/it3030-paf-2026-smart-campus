import { useNavigate } from 'react-router-dom'
import { ArrowLeft, UserCircle2, Mail, ShieldCheck, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function UserProfile() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-yellow-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/user')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          {/* Top Info */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 shadow-sm">
              <UserCircle2 size={50} />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {currentUser?.name || 'User Name'}
            </h2>

            <p className="text-gray-500">{currentUser?.email}</p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3">
              <UserCircle2 className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">
                  {currentUser?.name}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold text-gray-900">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3 md:col-span-2">
              <ShieldCheck className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold capitalize text-gray-900">
                  {currentUser?.role || 'user'}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Section */}
          <div className="mt-8 rounded-2xl bg-yellow-50 p-5 text-center">
            <p className="text-sm text-gray-600">
              You can extend this profile later with:
            </p>
            <p className="mt-2 text-sm font-medium text-gray-800">
              Profile picture • Edit profile • Password change • Activity history
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}