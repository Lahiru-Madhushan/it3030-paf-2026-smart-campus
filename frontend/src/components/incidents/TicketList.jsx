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
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
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
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
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
      <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
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
            onClick={() => navigate('/incidents/create')}
            style={{
              background: '#facc15',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
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
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        />

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
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
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="ALL">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Ticket list */}
      {filteredTickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: '#f9f9f9', borderRadius: '12px' }}>
          <p style={{ fontSize: '16px', marginBottom: '12px' }}>No tickets found</p>
          {!isAdmin && (
            <button
              onClick={() => navigate('/incidents/create')}
              style={{ background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}
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