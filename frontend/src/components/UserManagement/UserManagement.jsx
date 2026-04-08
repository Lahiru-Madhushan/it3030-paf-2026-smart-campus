import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'

export default function UserManagement() {
  const { auth, currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [showPassModal, setShowPassModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [passTopic, setPassTopic] = useState('STAFF PASS')

  const [qrDataUrl, setQrDataUrl] = useState('')

  const loadUsers = async () => {
    if (!auth?.token) return

    try {
      setLoading(true)
      setError('')
      const data = await authService.getAdminUsers(auth.token)
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [auth?.token])

  const handleRoleChange = async (userId, role) => {
    setMessage('')
    setError('')

    try {
      await authService.updateUserRole(auth.token, userId, { role })
      setMessage('User role updated successfully.')
      loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to update role')
    }
  }

  const handleDelete = async (userId) => {
    setMessage('')
    setError('')

    try {
      await authService.deleteUser(auth.token, userId)
      setMessage('User deleted successfully.')
      loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    }
  }

  const handleCreatePass = (user) => {
    setError('')
    setSelectedUser(user)
    setPassTopic('STAFF PASS')
    setShowPassModal(true)
  }

  const handleCloseModal = () => {
    setShowPassModal(false)
    setSelectedUser(null)
  }

  const passId = useMemo(() => {
    if (!selectedUser) return ''
    const safeName = (selectedUser.name || 'USER')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '')
      .slice(0, 4)

    const safeEmail = (selectedUser.email || 'MAIL')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)

    return `${safeName}-${safeEmail}-${selectedUser.id}`
  }, [selectedUser])

  useEffect(() => {
    const buildQr = async () => {
      if (!selectedUser || !passId) {
        setQrDataUrl('')
        return
      }

      const qrPayload = JSON.stringify({
        passId,
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        verifiedAs: 'STAFF',
      })

      try {
        const dataUrl = await QRCode.toDataURL(qrPayload, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 220,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
        setQrDataUrl(dataUrl)
      } catch {
        setQrDataUrl('')
      }
    }

    buildQr()
  }, [selectedUser, passId])

  const generatePassImage = async () => {
    if (!selectedUser) return null

    const canvas = document.createElement('canvas')
    const width = 1200
    const height = 720
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setError('Unable to create pass image')
      return null
    }

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Header
    ctx.fillStyle = '#facc15'
    ctx.fillRect(0, 0, width, 130)
    ctx.fillStyle = '#000000'
    ctx.font = '700 26px Arial'
    ctx.fillText((passTopic || 'STAFF PASS').toUpperCase(), 40, 78)

    // Right black panel
    const rightX = width - 300
    ctx.fillStyle = '#000000'
    ctx.fillRect(rightX, 130, 300, height - 130)

    // Staff details
    ctx.fillStyle = '#6b7280'
    ctx.font = '700 16px Arial'
    ctx.fillText('STAFF DETAILS', 40, 175)

    ctx.fillStyle = '#111827'
    ctx.font = '700 42px Arial'
    ctx.fillText((selectedUser.name || '').toUpperCase(), 40, 250)

    ctx.fillStyle = '#111827'
    ctx.font = '600 24px Arial'
    ctx.fillText(selectedUser.email || '', 40, 300)

    ctx.fillStyle = '#374151'
    ctx.font = '700 20px Arial'
    ctx.fillText(`ROLE: ${selectedUser.role || ''}`, 40, 345)
    ctx.fillText(`PASS ID: ${passId}`, 40, 380)
    ctx.fillStyle = '#047857'
    ctx.font = '700 24px Arial'
    ctx.fillText('VERIFIED AS STAFF', 40, 420)

    // QR block aligned to the right of staff details
    const qrX = 640
    const qrY = 180
    const qrBoxSize = 230
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(qrX, qrY, qrBoxSize, qrBoxSize + 35)
    ctx.fillStyle = '#6b7280'
    ctx.font = '700 14px Arial'
    ctx.fillText('SCAN TO VERIFY', qrX + 38, qrY + 25)

    if (qrDataUrl) {
      const qrImage = new Image()
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve
        qrImage.onerror = reject
        qrImage.src = qrDataUrl
      })
      ctx.drawImage(qrImage, qrX + 10, qrY + 35, qrBoxSize - 20, qrBoxSize - 20)
    } else {
      ctx.fillStyle = '#9ca3af'
      ctx.font = '600 14px Arial'
      ctx.fillText('QR unavailable', qrX + 60, qrY + 135)
    }

    // Right panel content
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 24px Arial'
    ctx.fillText('STAFF', rightX + 98, 240)
    ctx.fillText('PASS', rightX + 108, 272)
    ctx.fillStyle = '#facc15'
    ctx.fillRect(rightX + 42, 320, 216, 116)
    ctx.fillStyle = '#111827'
    ctx.font = '700 18px Arial'
    ctx.fillText('ACCESS', rightX + 102, 365)
    ctx.font = '800 34px Arial'
    ctx.fillText('ACTIVE', rightX + 82, 405)

    ctx.fillStyle = '#ffffff'
    ctx.font = '600 14px Arial'
    ctx.fillText('Scan QR to validate', rightX + 74, 470)

    return canvas.toDataURL('image/png')
  }

  const handlePrintPass = async () => {
    if (!selectedUser) return
    const image = await generatePassImage()
    if (!image) return

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      setError('Popup blocked. Please allow popups to print the pass.')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Staff Pass</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .pass-image {
              width: 100%;
              max-width: 1200px;
              height: auto;
              display: block;
            }
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
          </style>
        </head>
        <body>
          <img class="pass-image" src="${image}" alt="Staff Pass" />
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  const handleDownloadPass = async () => {
    if (!selectedUser) return

    try {
      const image = await generatePassImage()
      if (!image) return

      const link = document.createElement('a')
      link.href = image
      const safeName = (selectedUser.name || 'staff-pass')
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
      link.download = `${safeName}-pass.png`
      link.click()
    } catch (err) {
      console.error(err)
      setError('Failed to download pass')
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="mt-1 text-gray-600">
              View users, update roles, remove accounts, and create staff passes.
            </p>
          </div>

          <button
            onClick={loadUsers}
            className="rounded-2xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Change Role</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-gray-700">{user.name}</td>
                    <td className="px-4 py-3 text-gray-700">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                      >
                        {Object.values(ROLES).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCreatePass(user)}
                          className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-300"
                        >
                          Create Pass
                        </button>

                        <button
                          disabled={user.email === currentUser?.email}
                          onClick={() => handleDelete(user.id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPassModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Pass Preview</h3>
                <p className="text-gray-600">
                  Preview, print, or download the selected user pass.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="rounded-2xl border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Pass Settings</h4>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Topic / Title
                </label>
                <input
                  type="text"
                  value={passTopic}
                  onChange={(e) => setPassTopic(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                  placeholder="STAFF PASS"
                />

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handlePrintPass}
                    className="rounded-2xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Print Pass
                  </button>

                  <button
                    onClick={handleDownloadPass}
                    className="rounded-2xl border border-black bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
                  >
                    Download Pass
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className="relative w-full max-w-md overflow-hidden rounded-3xl border-[3px] border-black bg-white shadow-xl"
                  style={{ aspectRatio: '1.65 / 1' }}
                >
                  <div className="h-full w-full">
                    <div className="flex items-center justify-between border-b-[3px] border-black bg-yellow-400 px-5 py-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-black">
                          Topic
                        </p>
                        <h4 className="mt-1 text-xl font-extrabold uppercase text-black">
                          {passTopic || 'STAFF PASS'}
                        </h4>
                      </div>

                      <div className="rounded-2xl border-2 border-black bg-white px-3 py-2 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                          Verify
                        </p>
                        <p className="text-sm font-extrabold text-black">PASS</p>
                      </div>
                    </div>

                    <div className="grid h-[calc(100%-92px)] grid-cols-[1fr_130px]">
                      <div className="flex flex-col justify-between p-5">
                        <div className="grid gap-4 md:grid-cols-[1fr_140px]">
                          <div>
                          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gray-500">
                            Staff Details
                          </p>

                          <div className="mt-5 space-y-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Name
                              </p>
                              <p className="mt-1 break-words text-2xl font-extrabold text-black">
                                {selectedUser.name}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Email
                              </p>
                              <p className="mt-1 break-words text-base font-semibold text-black">
                                {selectedUser.email}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Role
                              </p>
                              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-black">
                                {selectedUser.role}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Pass ID
                              </p>
                              <p className="mt-1 text-sm font-bold tracking-wider text-black">
                                {passId}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-2xl border-2 border-black bg-white p-2">
                            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                              QR
                            </p>
                            <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1">
                              {qrDataUrl ? (
                                <img src={qrDataUrl} alt="Pass verification QR" className="h-24 w-24" />
                              ) : (
                                <p className="text-xs text-gray-500">QR loading...</p>
                              )}
                            </div>
                            <p className="mt-2 text-center text-[11px] font-bold text-black">
                              Verify Staff
                            </p>
                          </div>
                        </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between border-l-[3px] border-black bg-black p-4 text-white">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-yellow-400 bg-white text-center text-xs font-bold text-black">
                          STAFF
                          <br />
                          PASS
                        </div>

                        <div className="w-full rounded-2xl bg-yellow-400 px-3 py-4 text-center">
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-black">
                            Access
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-black">ACTIVE</p>
                        </div>

                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                            Theme
                          </p>
                          <p className="mt-1 text-sm font-bold text-white">
                            Black / Yellow / White
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}