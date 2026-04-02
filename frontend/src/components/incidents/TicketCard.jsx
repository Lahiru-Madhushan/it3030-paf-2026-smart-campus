import React from 'react'

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

function TicketCard({ ticket, onClick }) {
  const status = statusColors[ticket.status] || statusColors.OPEN
  const priority = priorityColors[ticket.priority] || priorityColors.LOW

  // SLA Timer — check if ticket is overdue (HIGH priority open > 48 hours)
  const isOverdue = () => {
    if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') {
      const created = new Date(ticket.createdAt)
      const now = new Date()
      const hoursDiff = (now - created) / (1000 * 60 * 60)
      return ticket.priority === 'HIGH' && hoursDiff > 48
    }
    return false
  }

  const getTimeElapsed = () => {
    const created = new Date(ticket.createdAt)
    const now = new Date()
    const hoursDiff = Math.floor((now - created) / (1000 * 60 * 60))
    if (hoursDiff < 24) return `${hoursDiff}h ago`
    return `${Math.floor(hoursDiff / 24)}d ago`
  }

  return (
    <div
      onClick={() => onClick(ticket.id)}
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
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              {ticket.title}
            </h3>
            {isOverdue() && (
              <span style={{ background: '#FCEBEB', color: '#A32D2D', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                ⚠ OVERDUE
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#666', marginBottom: '8px' }}>
            📍 {ticket.location} &nbsp;·&nbsp; {ticket.category} &nbsp;·&nbsp; {getTimeElapsed()}
          </p>
        </div>

        {/* Status badge */}
        <span style={{
          background: status.bg,
          color: status.text,
          border: `1px solid ${status.border}`,
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          marginLeft: '12px',
        }}>
          {ticket.status.replace('_', ' ')}
        </span>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Priority badge */}
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

          {/* Comments and attachments */}
          <span style={{ fontSize: '12px', color: '#888' }}>
            💬 {ticket.totalComments} &nbsp; 📎 {ticket.totalAttachments}
          </span>
        </div>

        {/* Reporter */}
        <span style={{ fontSize: '12px', color: '#888' }}>
          By {ticket.createdByName || 'Unknown'}
        </span>
      </div>
    </div>
  )
}

export default TicketCard