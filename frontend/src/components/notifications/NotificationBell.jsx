import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'

export default function NotificationBell({ variant = 'light' }) {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const token = auth?.token

  const loadNotifications = async () => {
    if (!token) return
    try {
      setLoading(true)
      const [items, unread] = await Promise.all([
        notificationService.getMyNotifications(token),
        notificationService.getUnreadCount(token),
      ])
      setNotifications(items || [])
      setUnreadCount(unread?.count || 0)
    } catch (error) {
      console.error('Failed to load notifications', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    if (!token) return

    const interval = setInterval(loadNotifications, 15000)
    return () => clearInterval(interval)
  }, [token])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(token, id)
      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(token)
      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark all notifications as read', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(token, id)
      await loadNotifications()
    } catch (error) {
      console.error('Failed to delete notification', error)
    }
  }

  const handleNavigate = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }

    if (notification.referenceType === 'BOOKING') {
      navigate('/bookings/my')
    } else if (notification.referenceType === 'TICKET') {
      navigate(`/incidents/${notification.referenceId}`)
    }

    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={
          variant === 'dark'
            ? 'relative rounded-full p-2 text-white hover:bg-white/10'
            : 'relative rounded-full p-2 text-gray-800 hover:bg-gray-100'
        }
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`border-b px-4 py-3 transition hover:bg-gray-50 ${
                    !item.read ? 'bg-blue-50/50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => handleNavigate(item)}
                    >
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {!item.read && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                          title="Mark as read"
                        >
                          <CheckCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}