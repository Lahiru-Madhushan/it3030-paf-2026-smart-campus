import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, ClipboardList, User, Mail, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ticketService } from '../../services/ticketService'

const statusColors = {
  OPEN: { bg: '#E6F1FB', text: '#0C447C', border: '#185FA5' },
  IN_PROGRESS: { bg: '#FAEEDA', text: '#633806', border: '#BA7517' },
  RESOLVED: { bg: '#E1F5EE', text: '#085041', border: '#0F6E56' },
  CLOSED: { bg: '#F1EFE8', text: '#444441', border: '#5F5E5A' },
  REJECTED: { bg: '#FAECE7', text: '#4A1B0C', border: '#993C1D' },
}

const priorityColors = {
  LOW: { bg: '#EAF3DE', text: '#27500A' },
  MEDIUM: { bg: '#FAEEDA', text: '#633806' },
  HIGH: { bg: '#FCEBEB', text: '#501313' },
}

export default function TechnicianDashboard() {
  const { currentUser, logout, auth } = useAuth()
  const navigate = useNavigate()
  const token = auth?.token
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')

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

  useEffect(() => {
    if (currentUser) {
      fetchAssignedTickets()
    }
  }, [currentUser])

  const fetchAssignedTickets = async () => {
    try {
      setLoading(true)
      const data = await ticketService.getAssignedTickets(token)
      setTickets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket =>
    filterStatus === 'ALL' || ticket.status === filterStatus
  )

  const getStats = () => {
    return {
      total: tickets.length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    }
  }

  const stats = getStats()

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
              Welcome back, <strong>{currentUser?.name || 'Technician'}</strong>. Manage your assigned tickets below.
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

        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <ClipboardList size={22} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
            <p className="mt-1 text-sm text-slate-600">Total Assigned Tickets</p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Wrench size={22} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.inProgress}</h3>
            <p className="mt-1 text-sm text-slate-600">In Progress</p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={22} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stats.resolved}</h3>
            <p className="mt-1 text-sm text-slate-600">Resolved</p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Ticket list */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">
                  My Assigned Tickets
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
                </h2>
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
              >
                <option value="ALL">All Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            {/* Tickets */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Loading tickets...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#A32D2D' }}>
                Error: {error}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666', background: '#f9f9f9', borderRadius: '12px' }}>
                No tickets assigned to you yet
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const status = statusColors[ticket.status] || statusColors.OPEN
                const priority = priorityColors[ticket.priority] || priorityColors.LOW
                return (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/incidents/${ticket.id}`)}
                    style={{
                      border: `1px solid ${status.border}`,
                      borderRadius: '10px',
                      padding: '16px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                        {ticket.title}
                      </h3>
                      <span style={{
                        background: status.bg,
                        color: status.text,
                        border: `1px solid ${status.border}`,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginLeft: '12px',
                        whiteSpace: 'nowrap',
                      }}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>
                      📍 {ticket.location} &nbsp;·&nbsp; {ticket.category}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          background: priority.bg,
                          color: priority.text,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {ticket.priority}
                        </span>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          💬 {ticket.totalComments}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        By {ticket.createdByName}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </section>

          {/* Profile */}
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
                  <p className="text-sm text-slate-500">Role</p>
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