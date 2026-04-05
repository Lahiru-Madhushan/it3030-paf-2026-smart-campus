import { useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { API_BASE_URL } from '../../utils/constants'

export default function AdminChatBot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I am your CampusHub assistant. Ask me about users, admins, bookings, or resources.' },
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || loading) return

    const userMessage = { sender: 'user', text: message }
    setMessages((prev) => [...prev, userMessage])

    const currentMessage = message
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!res.ok) {
        throw new Error('Failed to get chatbot response')
      }

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || 'No response received.' },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong while contacting the chatbot.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
          style={{ background: '#0a0a0a', color: '#fff' }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        >
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ background: '#0a0a0a' }}
          >
            <div>
              <h3 className="text-sm font-bold">CampusHub Assistant</h3>
              <p className="text-xs text-white/70">Ask database questions</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 transition hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-black text-white'
                    : 'bg-white text-black shadow-sm border border-gray-200'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                Thinking...
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about users, admins, bookings..."
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition disabled:opacity-50"
                style={{ background: '#0a0a0a' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}