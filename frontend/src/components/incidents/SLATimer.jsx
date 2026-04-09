import React from 'react'

function formatDuration(start, end) {
  if (!start) return null
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  const diffMs = endDate - startDate
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getSLAStatus(priority, hours) {
  const limits = { HIGH: 4, MEDIUM: 24, LOW: 72 }
  const limit = limits[priority] || 24
  if (hours > limit * 2) return { color: '#A32D2D', bg: '#FCEBEB', label: 'Overdue' }
  if (hours > limit) return { color: '#633806', bg: '#FAEEDA', label: 'At Risk' }
  return { color: '#085041', bg: '#E1F5EE', label: 'On Track' }
}

function SLATimer({ ticket }) {
  if (!ticket) return null

  const createdAt = ticket.createdAt
  const firstResponseAt = ticket.firstResponseAt
  const resolvedAt = ticket.resolvedAt
  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'

  const responseTime = firstResponseAt
    ? formatDuration(createdAt, firstResponseAt)
    : null

  const resolutionTime = resolvedAt
    ? formatDuration(createdAt, resolvedAt)
    : null

  const currentDuration = formatDuration(createdAt, null)
  const hoursElapsed = Math.floor(
    (new Date() - new Date(createdAt)) / (1000 * 60 * 60)
  )

  const slaStatus = !isResolved
    ? getSLAStatus(ticket.priority, hoursElapsed)
    : { color: '#085041', bg: '#E1F5EE', label: 'Resolved' }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      marginBottom: '16px',
      border: '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          ⏱ Service Level Timer
        </h3>
        <span style={{
          background: slaStatus.bg,
          color: slaStatus.color,
          padding: '4px 12px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {slaStatus.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

        {/* Time elapsed */}
        <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Time Elapsed
          </p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
            {currentDuration}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>
            since created
          </p>
        </div>

        {/* First response */}
        <div style={{
          background: responseTime ? '#E1F5EE' : '#f9f9f9',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          border: responseTime ? '1px solid #0F6E56' : 'none'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            First Response
          </p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: responseTime ? '#085041' : '#ccc' }}>
            {responseTime || '—'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>
            {responseTime ? 'time to respond' : 'not yet'}
          </p>
        </div>

        {/* Resolution time */}
        <div style={{
          background: resolutionTime ? '#E1F5EE' : '#f9f9f9',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          border: resolutionTime ? '1px solid #0F6E56' : 'none'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resolution Time
          </p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: resolutionTime ? '#085041' : '#ccc' }}>
            {resolutionTime || '—'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>
            {resolutionTime ? 'time to resolve' : 'not yet'}
          </p>
        </div>
      </div>

      {/* SLA limit info */}
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
        SLA target — HIGH: 4h · MEDIUM: 24h · LOW: 72h
      </div>
    </div>
  )
}

export default SLATimer