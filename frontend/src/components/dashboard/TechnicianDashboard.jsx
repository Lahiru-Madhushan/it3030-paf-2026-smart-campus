import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, ClipboardList, User, Mail, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TechnicianDashboard() {
  const { currentUser, logout, auth } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    if (!auth?.token) {
      navigate('/')
      return
    }

    const timer = setTimeout(() => {
      logout()
      alert('Session expired. Please login again.')
      navigate('/')
    }, 30 * 60 * 1000)

    return () => clearTimeout(timer)
  }, [auth, logout, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Technician Panel
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Technician Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome back, <strong>{currentUser?.name || 'Technician'}</strong>. Manage your
              service tasks, assignments, and profile from one place.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Stats / Highlights */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <Wrench size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Maintenance Tasks</h3>
            <p className="mt-2 text-sm text-slate-600">
              Track and manage technical issues, repairs, and service requests.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ClipboardList size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Assignments</h3>
            <p className="mt-2 text-sm text-slate-600">
              View assigned work and future service updates in an organized space.
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Role Access</h3>
            <p className="mt-2 text-sm text-slate-600">
              This dashboard is dedicated only to technicians based on their role.
            </p>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-600">
              Technician Workspace
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Hello, {currentUser?.name || 'Technician'}
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              This dashboard is separated for technicians according to their role. You can extend
              this page later for maintenance logs, service history, issue tracking, equipment
              status, and work progress updates.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Next Extension Idea</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Add a task table for assigned maintenance requests.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Future Feature</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Include status updates such as Pending, In Progress, and Completed.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-600">
              Profile
            </p>

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <User size={30} />
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <Mail className="mt-0.5 text-slate-500" size={18} />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">{currentUser?.email}</p>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <User className="mt-0.5 text-slate-500" size={18} />
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-semibold text-slate-900">{currentUser?.name}</p>
                </div>
              </li>

              <li className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 text-slate-500" size={18} />
                <div>
                  <p className="text-sm text-slate-500">Assigned Role</p>
                  <p className="font-semibold capitalize text-slate-900">{currentUser?.role}</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}