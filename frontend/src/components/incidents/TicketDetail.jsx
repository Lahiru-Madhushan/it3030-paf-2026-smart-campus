import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketService } from '../../services/ticketService'
import { useAuth } from '../../context/AuthContext'
import SLATimer from './SLATimer'
import Header from '../dashboard/UserDashboard'
import Footer from '../dashboard/userFooter'

const statusColors = {
  OPEN: { bg: '#E6F1FB', text: '#0C447C', border: '#185FA5' },
  IN_PROGRESS: { bg: '#FAEEDA', text: '#633806', border: '#BA7517' },
  RESOLVED: { bg: '#E1F5EE', text: '#085041', border: '#0F6E56' },
  CLOSED: { bg: '#F1EFE8', text: '#444441', border: '#5F5E5A' },
  REJECTED: { bg: '#FAECE7', text: '#4A1B0C', border: '#993C1D' },
}

const validTransitions = {
  OPEN: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  REJECTED: [],
}

function TicketDetail() {
  const { id } = useParams()
  const { auth, currentUser } = useAuth()
  const token = auth?.token
  const user = currentUser
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [newResolutionNote, setNewResolutionNote] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [technicianEmail, setTechnicianEmail] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'
  const isTechnician = user?.role === 'ROLE_TECHNICIAN' || user?.role === 'TECHNICIAN'
  const isUser = user?.role === 'USER' || user?.role === 'ROLE_USER'

  useEffect(() => {
    if (token) {
      fetchTicket()
      fetchComments()
    }
  }, [id, token])

  const fetchTicket = async () => {
    try {
      const data = await ticketService.getTicketById(token, id)
      setTicket(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const data = await ticketService.getComments(token, id)
      setComments(data || [])
    } catch (err) {
      setComments([])
      console.error(err)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return
    setActionLoading(true)
    try {
      await ticketService.updateStatus(token, id, selectedStatus, rejectionReason)
      await fetchTicket()
      setSelectedStatus('')
      setRejectionReason('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!technicianEmail) return
    setActionLoading(true)
    try {
      await ticketService.assignTechnician(token, id, technicianEmail)
      await fetchTicket()
      setTechnicianEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await ticketService.addComment(token, id, {
        content: newComment,
        resolutionNote: false
      })
      setNewComment('')
      await fetchComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddResolutionNote = async () => {
    if (!newResolutionNote.trim()) return
    try {
      await ticketService.addComment(token, id, {
        content: newResolutionNote,
        resolutionNote: true
      })
      setNewResolutionNote('')
      await fetchComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditComment = async (commentId) => {
    try {
      await ticketService.editComment(token, id, commentId, { content: editContent })
      setEditingComment(null)
      setEditContent('')
      await fetchComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await ticketService.deleteComment(token, id, commentId)
      await fetchComments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return
    try {
      await ticketService.deleteTicket(token, id)
      navigate('/incidents')
    } catch (err) {
      setError(err.message)
    }
  }

  const getSLATime = () => {
    if (!ticket) return ''
    const created = new Date(ticket.createdAt)
    const now = new Date()
    const hours = Math.floor((now - created) / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h`
    return `${hours}h`
  }

  if (!token) {
    return (
      <>
        {isUser && <Header />}
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
          <div className="mx-auto w-full max-w-7xl px-2 text-center text-gray-600 sm:px-4">
            Please login to view this ticket.
          </div>
        </section>
        {isUser && <Footer />}
      </>
    )
  }

  if (loading) {
    return (
      <>
        {isUser && <Header />}
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
          <div className="mx-auto w-full max-w-7xl px-2 text-center text-gray-600 sm:px-4">
            Loading ticket...
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

  if (!ticket) {
    return (
      <>
        {isUser && <Header />}
        <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
          <div className="mx-auto w-full max-w-7xl px-2 text-center text-red-700 sm:px-4">
            Ticket not found or you don&apos;t have permission to view it.
          </div>
        </section>
        {isUser && <Footer />}
      </>
    )
  }

  const status = statusColors[ticket.status] || statusColors.OPEN
  const nextStatuses = validTransitions[ticket.status] || []

  return (
    <>
      {isUser && <Header />}
      <section className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-yellow-50 py-12 px-4">
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#185FA5', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', padding: 0 }}
      >
        ← Back
      </button>

      {/* Ticket header */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1a1a1a', flex: 1 }}>
            {ticket.title}
          </h1>
          <span style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}`, padding: '6px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', marginLeft: '16px', whiteSpace: 'nowrap' }}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px', fontSize: '13px', color: '#666' }}>
          <span>📍 {ticket.location}</span>
          <span>🏷 {ticket.category}</span>
          <span>⚡ {ticket.priority}</span>
          <span>👤 {ticket.createdByName}</span>
          <span>⏱ SLA: {getSLATime()}</span>
          {ticket.assignedToName && <span>🔧 Assigned to: {ticket.assignedToName}</span>}
        </div>

        <p style={{ margin: '0 0 16px', color: '#333', fontSize: '15px', lineHeight: '1.6' }}>
          {ticket.description}
        </p>

        {ticket.contactDetails && (
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>
            📞 Contact: {ticket.contactDetails}
          </p>
        )}

        {ticket.rejectionReason && (
          <div style={{ background: '#FAECE7', color: '#4A1B0C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginTop: '12px' }}>
            ❌ Rejection reason: {ticket.rejectionReason}
          </div>
        )}

        {ticket.attachmentPaths && ticket.attachmentPaths.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: '600', fontSize: '14px' }}>Attachments</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ticket.attachmentPaths.map((path, i) => (
                <img
                  key={i}
                  // Encode to handle filenames with spaces/special characters.
                  src={`http://localhost:8088/${encodeURI(path)}`}
                  alt={`attachment-${i}`}
                  style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              onClick={handleDeleteTicket}
              style={{ background: '#FCEBEB', color: '#A32D2D', border: '1px solid #E24B4A', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
            >
              Delete Ticket
            </button>
          </div>
        )}
      </div>

      {/* SLA Timer */}
      {(isAdmin || isTechnician) && (
        <SLATimer ticket={ticket} />
      )}

      {/* Admin / Technician status controls */}
      {(isAdmin || isTechnician) && nextStatuses.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Update Status</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {nextStatuses.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${selectedStatus === s ? '#185FA5' : '#ddd'}`,
                  background: selectedStatus === s ? '#E6F1FB' : '#fff',
                  color: selectedStatus === s ? '#185FA5' : '#333',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {selectedStatus === 'REJECTED' && (
            <input
              type="text"
              placeholder="Rejection reason (required)"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
            />
          )}

          {selectedStatus === 'RESOLVED' && (
            <textarea
              placeholder="Add resolution notes — what did you fix and how?"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0F6E56', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
            />
          )}

          <button
            onClick={handleStatusUpdate}
            disabled={!selectedStatus || actionLoading}
            style={{ background: selectedStatus ? '#185FA5' : '#ccc', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: selectedStatus ? 'pointer' : 'not-allowed' }}
          >
            {actionLoading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      )}

      {/* Admin assign technician */}
      {isAdmin && ticket.status === 'OPEN' && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>Assign Technician</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="email"
              placeholder="Technician email address"
              value={technicianEmail}
              onChange={e => setTechnicianEmail(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
            <button
              onClick={handleAssign}
              disabled={actionLoading}
              style={{ background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Resolution Note section — Technician only */}
      {isTechnician && (
        <div style={{ background: '#E1F5EE', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '16px', border: '1px solid #0F6E56' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600', color: '#085041' }}>
            📋 Add Resolution Note
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#085041' }}>
            Explain how you fixed the issue — parts used, actions taken, time spent etc.
          </p>
          <textarea
            value={newResolutionNote}
            onChange={e => setNewResolutionNote(e.target.value)}
            placeholder="Describe the resolution — what was the problem and how did you fix it?"
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0F6E56', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', background: '#fff' }}
          />
          <button
            onClick={handleAddResolutionNote}
            disabled={!newResolutionNote.trim()}
            style={{ marginTop: '8px', background: newResolutionNote.trim() ? '#0F6E56' : '#ccc', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: newResolutionNote.trim() ? 'pointer' : 'not-allowed' }}
          >
            Save Resolution Note
          </button>
        </div>
      )}

      {/* Comments section */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
          Comments ({comments.length})
        </h3>

        {!comments || comments.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>No comments yet</p>
        ) : (
          (comments || []).map(comment => (
            <div
              key={comment.id}
              style={{
                marginBottom: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: comment.resolutionNote ? '#E1F5EE' : '#f9f9f9',
                border: comment.resolutionNote ? '1px solid #0F6E56' : '1px solid #f0f0f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>
                      {comment.createdByName || 'Unknown'}
                    </span>
                    {comment.resolutionNote && (
                      <span style={{ background: '#085041', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                        ✅ Resolution Note
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {editingComment === comment.id ? (
                    <div style={{ marginTop: '8px' }}>
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          style={{ background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          style={{ background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                      {comment.content}
                    </p>
                  )}
                </div>

                {/* Edit/Delete — only for comment owner */}
                {comment.createdByEmail === user?.email && editingComment !== comment.id && (
                  <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
                    <button
                      onClick={() => { setEditingComment(comment.id); setEditContent(comment.content) }}
                      style={{ background: '#E6F1FB', color: '#185FA5', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{ background: '#FCEBEB', color: '#A32D2D', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Regular comment box — for USER and ADMIN */}
        {!isTechnician && (
          <div style={{ marginTop: '16px' }}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              style={{ marginTop: '8px', background: newComment.trim() ? '#185FA5' : '#facc15', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: newComment.trim() ? 'pointer' : 'not-allowed' }}
            >
              Add Comment
            </button>
          </div>
        )}

        {/* Technician regular comment box */}
        {isTechnician && (
          <div style={{ marginTop: '16px' }}>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a regular comment..."
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              style={{ marginTop: '8px', background: newComment.trim() ? '#185FA5' : '#ccc', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: newComment.trim() ? 'pointer' : 'not-allowed' }}
            >
              Add Comment
            </button>
          </div>
        )}
      </div>
        </div>
      </section>
      {isUser && <Footer />}
    </>
  )
}

export default TicketDetail