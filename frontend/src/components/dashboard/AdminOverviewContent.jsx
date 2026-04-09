import { Activity, ShieldCheck, Users, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminOverviewContent() {
  const navigate = useNavigate()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 inline-flex rounded-xl bg-black p-2 text-white">
          <Users size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">User Accounts</h3>
        <p className="mt-2 text-sm text-gray-600">
          Manage user roles and access from the Users section.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 inline-flex rounded-xl bg-black p-2 text-white">
          <Activity size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Operations</h3>
        <p className="mt-2 text-sm text-gray-600">
          Monitor and update resource and booking operations from one place.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 inline-flex rounded-xl bg-black p-2 text-white">
          <ShieldCheck size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
        <p className="mt-2 text-sm text-gray-600">
          Navigation remains persistent while content changes by selected module.
        </p>
      </div>

      <div
        onClick={() => navigate('/dashboard/admin/incidents')}
        className="rounded-2xl border border-gray-200 bg-white p-5 cursor-pointer transition hover:shadow-md hover:border-gray-400"
      >
        <div className="mb-3 inline-flex rounded-xl bg-black p-2 text-white">
          <Ticket size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Incident Tickets</h3>
        <p className="mt-2 text-sm text-gray-600">
          View and manage all incident tickets and maintenance requests.
        </p>
      </div>
    </div>
  )
}