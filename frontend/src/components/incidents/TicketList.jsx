import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../../services/ticketService'
import { useAuth } from '../../context/AuthContext'
import TicketCard from './TicketCard'
import Header from '../dashboard/UserDashboard'
import Footer from '../dashboard/userFooter'

function TicketList() {
  const { auth, currentUser } = useAuth()
  const token = auth?.token
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [search, setSearch] = useState('')

  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN'
  const isTechnician = currentUser?.role === 'ROLE_TECHNICIAN' || currentUser?.role === 'TECHNICIAN'
  const isUser = currentUser?.role === 'USER' || currentUser?.role === 'ROLE_USER'

  useEffect(() => {
    if (currentUser) {
      fetchTickets()
    }
  }, [currentUser])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      let data
      if (isAdmin) {
        data = await ticketService.getAllTickets(token)
      } else if (isTechnician) {
        data = await ticketService.getAssignedTickets(token)
      } else {
        data = await ticketService.getMyTickets(token)
      }
      setTickets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = filterStatus === 'ALL' || ticket.status === filterStatus
    const matchPriority = filterPriority === 'ALL' || ticket.priority === filterPriority
    const matchSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.location.toLowerCase().includes(search.toLowerCase()) ||
      ticket.category.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })

  if (loading) {
    return (
      <>
        {isUser && <Header />}
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] py-12 px-4">
          <div className="mx-auto w-full max-w-7xl px-2 text-center text-gray-600 sm:px-4">
            Loading tickets...
          </div>
        </section>
        {isUser && <Footer />}
      </>
    )
  }

  if (error) {
    return (
      <>
        {isUser && <Header />}
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] py-12 px-4">
          <div className="mx-auto w-full max-w-7xl px-2 text-center text-red-700 sm:px-4">
            Error: {error}
          </div>
        </section>
        {isUser && <Footer />}
      </>
    )
  }

  return (
    <>
      {isUser && <Header />}
      <section className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] py-12 px-4">
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
      {/* Page title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
            {isAdmin ? 'All Incident Tickets' : isTechnician ? 'My Assigned Tickets' : 'My Incident Tickets'}
          </h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Only show New Ticket button for non-admin users */}
        {!isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/incidents/create')}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0A192F] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#081425]"
          >
            + New Ticket
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title, location, category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
        />

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10"
        >
          <option value="ALL">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Ticket list */}
      {filteredTickets.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center text-gray-600 shadow-sm">
          <p className="mb-4 text-base font-medium">No tickets found</p>
          {!isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/incidents/create')}
              className="inline-flex items-center justify-center rounded-2xl bg-[#0A192F] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#081425]"
            >
              Create your first ticket
            </button>
          )}
        </div>
      ) : (
        filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={(id) => navigate(`/incidents/${id}`)}
          />
        ))
      )}
        </div>
      </section>
      {isUser && <Footer />}
    </>
  )
}

export default TicketList