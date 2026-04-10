import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketService } from '../../services/ticketService'
import { useAuth } from '../../context/AuthContext'
import Header from '../dashboard/UserDashboard'
import Footer from '../dashboard/userFooter'

function TicketForm() {
  const { auth, currentUser } = useAuth()
  const token = auth?.token
  const isUser = currentUser?.role === 'USER' || currentUser?.role === 'ROLE_USER'
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attachments, setAttachments] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'EQUIPMENT',
    priority: 'MEDIUM',
    location: '',
    contactDetails: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + attachments.length > 3) {
      setError('Maximum 3 attachments allowed')
      return
    }
    setAttachments([...attachments, ...files])
    setError(null)
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create ticket first
      const ticket = await ticketService.createTicket(token, form)

      // Upload attachments if any
      for (const file of attachments) {
        await ticketService.uploadAttachment(token, ticket.id, file)
      }

      navigate(`/incidents/${ticket.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#0A192F]/10 box-border'

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  }

  return (
    <>
      {isUser && <Header />}
      <section className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-[#e8edf5] py-12 px-4">
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
          <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/incidents')}
          className="mb-2 border-0 bg-transparent p-0 text-sm font-semibold text-[#0A192F] transition hover:text-[#081425]"
        >
          ← Back to tickets
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
          Report an Incident
        </h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
          Fill in the details below to create a new incident ticket
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
      >

        {error && (
          <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Projector broken in Lab 3"
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            required
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Category and Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="ELECTRICAL">Electrical</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="EQUIPMENT">Equipment</option>
              <option value="NETWORK">Network</option>
              <option value="CLEANING">Cleaning</option>
              <option value="SECURITY">Security</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority *</label>
            <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Location *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Lab 3, Room 201, Main Hall"
            required
            className={inputClass}
          />
        </div>

        {/* Contact Details */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Contact Details</label>
          <input
            type="text"
            name="contactDetails"
            value={form.contactDetails}
            onChange={handleChange}
            placeholder="e.g. ext. 1234 or your phone number"
            className={inputClass}
          />
        </div>

        {/* Attachments */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Attachments (max 3 images)</label>
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {attachments.map((file, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: '80px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#A32D2D', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '20px', textAlign: 'center', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {attachments.length < 3 && (
                <label style={{ width: '80px', height: '70px', border: '2px dashed #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999', fontSize: '24px' }}>
                  +
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} multiple />
                </label>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
              {attachments.length}/3 images added
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="flex-1 rounded-2xl border border-[#0A192F] bg-white py-3 text-sm font-semibold text-[#0A192F] transition hover:bg-[#e8edf5]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex flex-[2] items-center justify-center rounded-2xl bg-[#0A192F] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#081425] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
          </div>
        </div>
      </section>
      {isUser && <Footer />}
    </>
  )
}

export default TicketForm