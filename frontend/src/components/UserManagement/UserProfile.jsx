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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] p-6">
      <div className="mx-auto max-w-4xl">

        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/user')}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0A192F] shadow-sm transition hover:bg-[#e8edf5]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0A192F] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#081425]"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

          {/* Top Info */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e8edf5] text-[#0A192F] shadow-sm">
              <UserCircle2 size={50} />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {currentUser?.name || 'User Name'}
            </h2>

            <p className="text-gray-500">{currentUser?.email}</p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200"></div>

          {/* Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <UserCircle2 className="text-slate-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">
                  {currentUser?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Mail className="text-slate-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold text-gray-900">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <ShieldCheck className="text-slate-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-semibold capitalize text-gray-900">
                  {currentUser?.role || 'user'}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Section */}

        </div>
      </div>
    </div>
  )
}