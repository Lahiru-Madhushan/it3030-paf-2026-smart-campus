import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useNavigate } from 'react-router-dom'
import { authRequest } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './facilitiesWorkspace.css'

const PAGE_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'qr', label: 'QR Tracking' },
  { id: 'issues', label: 'Issue Reports' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'notifications', label: 'Notifications' },
]

const TYPE_OPTIONS = ['LECTURE_HALL', 'MEETING_ROOM', 'ROOM', 'LAB', 'EQUIPMENT']
const STATUS_OPTIONS = ['ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE', 'INACTIVE', 'AVAILABLE']
const CONDITION_OPTIONS = ['GOOD', 'REPAIR_NEEDED']

const TYPE_META = {
  LECTURE_HALL: { label: 'Lecture Hall', icon: 'LH', tone: 'facilities-type--blue' },
  MEETING_ROOM: { label: 'Meeting Room', icon: 'MR', tone: 'facilities-type--violet' },
  ROOM: { label: 'Room', icon: 'RM', tone: 'facilities-type--violet' },
  LAB: { label: 'Lab', icon: 'LB', tone: 'facilities-type--green' },
  EQUIPMENT: { label: 'Equipment', icon: 'EQ', tone: 'facilities-type--amber' },
}

const STATUS_LABELS = {
  ACTIVE: 'Active',
  OUT_OF_SERVICE: 'Out of service',
  UNDER_MAINTENANCE: 'Under maintenance',
  INACTIVE: 'Inactive',
  AVAILABLE: 'Available',
}

const CONDITION_LABELS = {
  GOOD: 'Good',
  REPAIR_NEEDED: 'Repair needed',
}

const IMAGE_LIBRARY = {
  labGeneral: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80',
  labProject: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80',
  labCamera: makeInlineAssetImage('Camera Lab', '#f59e0b'),
  labRobotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80',
  hallStandard: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80',
  hallCamera: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80',
  meeting: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80',
  projector: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=900&q=80',
  cameraSony: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80',
  cameraCanon: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&q=80',
  drone: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
}

const EMPTY_FORM = {
  resourceCode: '',
  name: '',
  resourceType: 'EQUIPMENT',
  category: '',
  capacity: '0',
  building: '',
  floorNumber: '',
  roomNumber: '',
  locationText: '',
  availableFrom: '08:00',
  availableTo: '17:00',
  status: 'ACTIVE',
  condition: 'GOOD',
  borrowed: false,
  rating: '0',
  lastServiceDate: '',
  nextServiceDate: '',
  totalBookings: '0',
  bookingsToday: '0',
  amenities: '',
  monthlyBookings: '0,0,0,0,0,0,0,0,0,0,0,0',
  description: '',
  imageUrl: '',
  requiresApproval: false,
  isActive: true,
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function FacilitiesWorkspace() {
  const { auth, currentUser } = useAuth()
  const navigate = useNavigate()
  const token = auth?.token
  const isAdmin = currentUser?.role === 'ADMIN'
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [qrSearch, setQrSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [editorState, setEditorState] = useState(null)
  const [issueDraft, setIssueDraft] = useState({ assetId: '', text: '', severity: 'MEDIUM' })
  const [toast, setToast] = useState(null)
  const [readNotifications, setReadNotifications] = useState([])
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    if (!token) return
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const payload = await authRequest('/api/resources?size=200&sortBy=name&sortDir=asc', token)
        setAssets((payload.content || []).map(normalizeAsset))
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }
    void run()
  }, [token])

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  useEffect(() => {
    if (!issueDraft.assetId && assets[0]) {
      setIssueDraft((current) => ({ ...current, assetId: String(assets[0].id) }))
    }
  }, [assets, issueDraft.assetId])

  const pageItems = useMemo(
    () => PAGE_ITEMS.filter((item) => isAdmin || item.id !== 'maintenance'),
    [isAdmin],
  )

  useEffect(() => {
    if (!pageItems.some((item) => item.id === page)) {
      setPage('dashboard')
    }
  }, [page, pageItems])

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return assets.filter((asset) => {
      const matchesType = typeFilter === 'ALL' || asset.resourceType === typeFilter
      const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter
      const matchesSearch =
        !query ||
        [asset.resourceCode, asset.name, asset.category, asset.locationText, asset.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))

      return matchesType && matchesStatus && matchesSearch
    })
  }, [assets, search, typeFilter, statusFilter])

  const qrAssets = useMemo(() => {
    const query = qrSearch.trim().toLowerCase()
    if (!query) return assets

    return assets.filter((asset) =>
      [asset.resourceCode, asset.name, asset.category, asset.locationText, asset.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [assets, qrSearch])

  const issueRows = useMemo(
    () =>
      assets.flatMap((asset) =>
        asset.issues.map((issue) => ({
          ...issue,
          assetId: asset.id,
          assetCode: asset.resourceCode,
          assetName: asset.name,
          locationText: asset.locationText,
        })),
      ),
    [assets],
  )

  const overdueAssets = useMemo(() => assets.filter((asset) => isPast(asset.nextServiceDate)), [assets])
  const upcomingAssets = useMemo(() => assets.filter((asset) => isWithinThirtyDays(asset.nextServiceDate)), [assets])
  const healthyAssets = useMemo(
    () => assets.filter((asset) => !isPast(asset.nextServiceDate) && !isWithinThirtyDays(asset.nextServiceDate)),
    [assets],
  )

  const notifications = useMemo(() => buildNotifications(assets), [assets])
  const unreadCount = notifications.filter((item) => !readNotifications.includes(item.id)).length

  async function loadAssets() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const payload = await authRequest('/api/resources?size=200&sortBy=name&sortDir=asc', token)
      setAssets((payload.content || []).map(normalizeAsset))
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  async function saveAsset(url, method, payload, successMessage) {
    if (!token || !isAdmin) return null

    const saved = normalizeAsset(
      await authRequest(url, token, {
        method,
        body: JSON.stringify(payload),
      }),
    )

    setAssets((current) => {
      const exists = current.some((asset) => asset.id === saved.id)
      return exists
        ? current.map((asset) => (asset.id === saved.id ? saved : asset))
        : [...current, saved].sort((left, right) => left.name.localeCompare(right.name))
    })
    setSelectedAsset((current) => (current?.id === saved.id ? saved : current))
    setToast({ tone: 'success', message: successMessage })
    return saved
  }

  async function submitAssetForm(event) {
    event.preventDefault()
    if (!editorState) return

    try {
      const payload = formToPayload(editorState.values, editorState.original)
      await saveAsset(
        editorState.original ? `/api/resources/${editorState.original.id}` : '/api/resources',
        editorState.original ? 'PUT' : 'POST',
        payload,
        editorState.original ? 'Asset updated successfully.' : 'Asset added successfully.',
      )
      setEditorState(null)
    } catch (submitError) {
      setToast({ tone: 'danger', message: submitError.message })
    }
  }

  async function removeAsset(asset) {
    if (!token || !isAdmin || !window.confirm(`Delete ${asset.name}?`)) return

    try {
      await authRequest(`/api/resources/${asset.id}`, token, { method: 'DELETE' })
      setAssets((current) => current.filter((item) => item.id !== asset.id))
      setSelectedAsset((current) => (current?.id === asset.id ? null : current))
      setToast({ tone: 'success', message: 'Asset removed from the catalogue.' })
    } catch (deleteError) {
      setToast({ tone: 'danger', message: deleteError.message })
    }
  }

  async function patchAsset(asset, changes, successMessage) {
    if (!isAdmin) {
      setToast({ tone: 'danger', message: 'Only administrators can update assets.' })
      return
    }
    try {
      await saveAsset(`/api/resources/${asset.id}`, 'PUT', { ...assetToPayload(asset), ...changes }, successMessage)
    } catch (updateError) {
      setToast({ tone: 'danger', message: updateError.message })
    }
  }

  async function reportIssue() {
    const trimmedText = issueDraft.text.trim()

    if (!issueDraft.assetId || !trimmedText) {
      setToast({ tone: 'danger', message: 'Choose an asset and describe the issue first.' })
      return
    }

    if (!token) {
      setToast({ tone: 'danger', message: 'Please sign in again to report an issue.' })
      return
    }

    try {
      const updatedAsset = normalizeAsset(
        await authRequest(`/api/resources/${issueDraft.assetId}/issues`, token, {
          method: 'POST',
          body: JSON.stringify({
            text: trimmedText,
            severity: issueDraft.severity,
          }),
        }),
      )

      setAssets((current) =>
        current
          .map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset))
          .sort((left, right) => left.name.localeCompare(right.name)),
      )
      setSelectedAsset((current) => (current?.id === updatedAsset.id ? updatedAsset : current))
      setIssueDraft({ assetId: String(updatedAsset.id), text: '', severity: 'MEDIUM' })
      setToast({
        tone: 'success',
        message: isAdmin ? 'Issue report added to the asset log.' : 'Issue report sent to the facilities team.',
      })
    } catch (reportError) {
      setToast({ tone: 'danger', message: reportError.message })
    }
  }

  async function resolveIssue(issueRow) {
    const asset = assets.find((item) => item.id === issueRow.assetId)
    if (!asset) return

    const issues = asset.issues.map((issue) =>
      issue.id === issueRow.id ? { ...issue, status: 'RESOLVED' } : issue,
    )
    const hasOpenIssues = issues.some((issue) => issue.status !== 'RESOLVED')

    await patchAsset(asset, { issues, condition: hasOpenIssues ? asset.condition : 'GOOD' }, 'Issue resolved.')
  }

  async function markServiced(asset) {
    const today = new Date()
    const next = new Date(today)
    next.setDate(next.getDate() + 90)

    await patchAsset(
      asset,
      {
        lastServiceDate: today.toISOString().slice(0, 10),
        nextServiceDate: next.toISOString().slice(0, 10),
        condition: asset.issues.some((issue) => issue.status !== 'RESOLVED') ? 'REPAIR_NEEDED' : 'GOOD',
      },
      'Maintenance schedule refreshed.',
    )
  }

  const selectedQrAsset =
    qrAssets.find((asset) => String(asset.id) === issueDraft.assetId) || qrAssets[0] || assets[0]
  const availableNow = assets.filter((asset) => asset.status === 'ACTIVE' && !asset.borrowed).length
  const borrowedCount = assets.filter((asset) => asset.borrowed).length
  const openIssueCount = issueRows.filter((issue) => issue.status !== 'RESOLVED').length
  const topAssets = [...assets].sort((left, right) => right.totalBookings - left.totalBookings).slice(0, 4)
  const monthlyTotals = MONTHS.map((month, index) => ({
    month,
    value: assets.reduce((sum, asset) => sum + (asset.monthlyBookings[index] || 0), 0),
  }))
  const maxMonthly = Math.max(...monthlyTotals.map((entry) => entry.value), 1)

  useEffect(() => {
    let active = true

    if (!selectedQrAsset) {
      setQrCodeUrl('')
      return undefined
    }

    QRCode.toDataURL(buildQrPayload(selectedQrAsset), {
      width: 360,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#f8fbff',
      },
    })
      .then((url) => {
        if (active) {
          setQrCodeUrl(url)
        }
      })
      .catch(() => {
        if (active) {
          setQrCodeUrl('')
        }
      })

    return () => {
      active = false
    }
  }, [selectedQrAsset])

  return (
    <div className="facilities-workspace">
      <div className="facilities-toolbar">
        <div>
          <p className="facilities-eyebrow">{isAdmin ? 'Integrated campus operations' : 'Smart campus catalogue'}</p>
          <h2>{isAdmin ? 'Facilities and asset workspace' : 'Facilities and assets catalogue'}</h2>
        </div>
        <div className="facilities-toolbar__actions">
          <button type="button" className="facilities-button facilities-button--ghost" onClick={() => loadAssets()}>
            Refresh
          </button>
          {isAdmin ? (
            <button
              type="button"
              className="facilities-button"
              onClick={() => setEditorState({ original: null, values: EMPTY_FORM })}
            >
              Add asset
            </button>
          ) : null}
        </div>
      </div>

      <div className="facilities-nav">
        {pageItems.map((item) => {
          const badge =
            item.id === 'issues'
              ? openIssueCount || null
              : item.id === 'maintenance'
                ? overdueAssets.length || null
                : item.id === 'notifications'
                  ? unreadCount || null
                  : null

          return (
            <button
              key={item.id}
              type="button"
              className={`facilities-nav__item ${page === item.id ? 'is-active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span>{item.label}</span>
              {badge ? <span className="facilities-nav__badge">{badge}</span> : null}
            </button>
          )
        })}
      </div>

      {error ? <div className="facilities-banner facilities-banner--danger">{error}</div> : null}
      {loading ? <div className="facilities-card facilities-loading">Loading the asset workspace...</div> : null}

      {!loading && page === 'dashboard' ? (
        <section className="facilities-stack">
          <div className="facilities-hero facilities-card">
            <div>
              <p className="facilities-eyebrow">Operational overview</p>
              <h3>Real-time asset command center</h3>
              <p className="facilities-muted">
                Live status, maintenance risk, issue load, and utilization metrics now run inside the main project.
              </p>
            </div>
            <div className="facilities-hero__orb" />
          </div>

          <div className="facilities-stats">
            <StatCard label="Tracked assets" value={assets.length} tone="blue" />
            <StatCard label="Available now" value={availableNow} tone="green" />
            <StatCard label="Borrowed" value={borrowedCount} tone="amber" />
            <StatCard label="Open issues" value={openIssueCount} tone="rose" />
          </div>

          <div className="facilities-split">
            <div className="facilities-card facilities-panel">
              <div className="facilities-panel__header">
                <h3>Attention queue</h3>
                <span>{overdueAssets.length + openIssueCount}</span>
              </div>
              <div className="facilities-stack">
                {overdueAssets.slice(0, 4).map((asset) => (
                  <AlertRow
                    key={asset.id}
                    title={`${asset.name} is overdue for service`}
                    text={`Next service was ${asset.nextServiceDate || 'not scheduled'}.`}
                  />
                ))}
                {notifications.slice(0, 3).map((notification) => (
                  <AlertRow key={notification.id} title={notification.title} text={notification.text} />
                ))}
              </div>
            </div>

            <div className="facilities-card facilities-panel">
              <div className="facilities-panel__header">
                <h3>Top performers</h3>
                <span>By bookings</span>
              </div>
              <div className="facilities-stack">
                {topAssets.map((asset) => (
                  <div key={asset.id} className="facilities-rank-row">
                    <TypeBadge type={asset.resourceType} />
                    <div className="facilities-grow">
                      <p>{asset.name}</p>
                      <span className="facilities-muted">{asset.totalBookings} bookings</span>
                    </div>
                    <strong>{asset.rating.toFixed(1)}</strong>
                  </div>
                ))}
                {topAssets.length === 0 ? <p className="facilities-muted">No assets available yet.</p> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && page === 'catalogue' ? (
        <section className="facilities-stack">
          <div className="facilities-card facilities-filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search code, name, category, location"
            />
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="ALL">All types</option>
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {TYPE_META[type]?.label || type}
                </option>
              ))}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status] || status}
                </option>
              ))}
            </select>
          </div>

          <div className="facilities-grid">
            {filteredAssets.map((asset) => (
              <article key={asset.id} className="facilities-card facilities-asset">
                <div className="facilities-asset__media">
                  <img src={asset.displayImageUrl} alt={asset.name} className="facilities-asset__image" />
                  <div className="facilities-asset__overlay">
                    <span className="facilities-tag">{asset.resourceCode}</span>
                    <span className="facilities-tag">{TYPE_META[asset.resourceType]?.label || asset.resourceType}</span>
                  </div>
                </div>
                <div className="facilities-asset__head">
                  <TypeBadge type={asset.resourceType} />
                  <span
                    className={`facilities-pill ${
                      asset.condition === 'GOOD' ? 'facilities-pill--green' : 'facilities-pill--rose'
                    }`}
                  >
                    {CONDITION_LABELS[asset.condition] || asset.condition}
                  </span>
                </div>
                <h3>{asset.name}</h3>
                <p className="facilities-muted">{asset.resourceCode}</p>
                <p className="facilities-muted">{asset.description || 'No description provided yet.'}</p>
                <div className="facilities-tags">
                  <span className="facilities-tag">{STATUS_LABELS[asset.status] || asset.status}</span>
                  <span className="facilities-tag">{asset.capacity} capacity</span>
                  <span className="facilities-tag">{asset.locationText || 'Location pending'}</span>
                </div>
                <div className="facilities-tags">
                  {asset.amenities.slice(0, 4).map((amenity) => (
                    <span key={amenity} className="facilities-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="facilities-actions">
                  <button
                    type="button"
                    className="facilities-button"
                    onClick={() =>
                      navigate(
                        `/bookings/new?resourceId=${asset.id}&resourceCode=${encodeURIComponent(
                          asset.resourceCode || '',
                        )}`,
                      )
                    }
                  >
                    Book
                  </button>
                  <button
                    type="button"
                    className="facilities-button facilities-button--ghost"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    Details
                  </button>
                  {isAdmin ? (
                    <button
                      type="button"
                      className="facilities-button facilities-button--ghost"
                      onClick={() => setEditorState({ original: asset, values: assetToForm(asset) })}
                    >
                      Edit
                    </button>
                  ) : null}
                  {isAdmin ? (
                    <button
                      type="button"
                      className="facilities-button facilities-button--danger"
                      onClick={() => removeAsset(asset)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
            {filteredAssets.length === 0 ? (
              <div className="facilities-card facilities-empty">No assets match the current filters.</div>
            ) : null}
          </div>
        </section>
      ) : null}

      {!loading && page === 'qr' ? (
        <section className="facilities-qr-workspace">
          <aside className="facilities-card facilities-panel facilities-qr-sidebar">
            <div className="facilities-panel__header">
              <h3>Tracked assets</h3>
              <span>{qrAssets.length} shown</span>
            </div>
            <input
              value={qrSearch}
              onChange={(event) => setQrSearch(event.target.value)}
              placeholder="Search code, name, location"
            />
            <div className="facilities-qr-sidebar__list">
              {qrAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className={`facilities-qr-sidebar__item ${selectedQrAsset?.id === asset.id ? 'is-active' : ''}`}
                  onClick={() => setIssueDraft((current) => ({ ...current, assetId: String(asset.id) }))}
                >
                  <strong>{asset.resourceCode || asset.id}</strong>
                  <span>{asset.name}</span>
                  <small>{asset.locationText || 'Location pending'}</small>
                </button>
              ))}
              {qrAssets.length === 0 ? <p className="facilities-muted">No assets match the current QR search.</p> : null}
            </div>
          </aside>

          <div className="facilities-stack">
            <div className="facilities-card facilities-panel">
              <div className="facilities-panel__header">
                <div>
                  <p className="facilities-eyebrow">QR tracking</p>
                  <h3>{selectedQrAsset?.name || 'Asset QR surface'}</h3>
                </div>
                {selectedQrAsset ? <span>{selectedQrAsset.resourceCode}</span> : null}
              </div>

              {selectedQrAsset ? (
                <div className="facilities-qr-hero">
                  <div className="facilities-qr-hero__code">
                    <div className="facilities-qr-canvas">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt={`QR code for ${selectedQrAsset.name}`}
                          className="facilities-qr-image"
                        />
                      ) : (
                        <PseudoQr value={buildQrPayload(selectedQrAsset)} />
                      )}
                    </div>
                    <div className="facilities-actions">
                      <button
                        type="button"
                        className="facilities-button"
                        onClick={() => downloadQrCode(selectedQrAsset, qrCodeUrl, setToast)}
                        disabled={!qrCodeUrl}
                      >
                        Download QR
                      </button>
                      <button
                        type="button"
                        className="facilities-button facilities-button--ghost"
                        onClick={() => downloadQrSummary(selectedQrAsset)}
                      >
                        Download summary
                      </button>
                      <button
                        type="button"
                        className="facilities-button facilities-button--ghost"
                        onClick={() => copyQrPayload(selectedQrAsset, setToast)}
                      >
                        Copy payload
                      </button>
                    </div>
                  </div>

                  <div className="facilities-stack facilities-grow">
                    <p className="facilities-muted">
                      {selectedQrAsset.description || 'No description provided yet.'}
                    </p>
                    <div className="facilities-detail-grid">
                      <Fact
                        label="Type"
                        value={TYPE_META[selectedQrAsset.resourceType]?.label || selectedQrAsset.resourceType}
                      />
                      <Fact label="Category" value={selectedQrAsset.category || '-'} />
                      <Fact label="Capacity" value={selectedQrAsset.capacity} />
                      <Fact label="Bookings" value={selectedQrAsset.totalBookings} />
                      <Fact label="Status" value={STATUS_LABELS[selectedQrAsset.status] || selectedQrAsset.status} />
                      <Fact
                        label="Condition"
                        value={CONDITION_LABELS[selectedQrAsset.condition] || selectedQrAsset.condition}
                      />
                    </div>
                    <div className="facilities-tags">
                      <span className="facilities-tag">{selectedQrAsset.locationText || 'Unknown location'}</span>
                      <span className="facilities-tag">
                        {selectedQrAsset.availableFrom || '--'} - {selectedQrAsset.availableTo || '--'}
                      </span>
                      <span className="facilities-tag">
                        {selectedQrAsset.borrowed ? 'Borrowed' : 'Ready to use'}
                      </span>
                    </div>
                    <div className="facilities-qr-payload">
                      <span className="facilities-eyebrow">QR payload</span>
                      <code>{buildQrPayload(selectedQrAsset)}</code>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="facilities-muted">No assets available to generate a QR summary.</p>
              )}
            </div>

            <div className="facilities-card facilities-panel">
              <div className="facilities-panel__header">
                <h3>Report an issue</h3>
                <span>{isAdmin ? 'Admin and user intake' : 'Send to facilities team'}</span>
              </div>
              <div className="facilities-stack">
                <Field label="Asset">
                  <select
                    value={issueDraft.assetId}
                    onChange={(event) => setIssueDraft((current) => ({ ...current, assetId: event.target.value }))}
                  >
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.resourceCode} - {asset.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Severity">
                  <select
                    value={issueDraft.severity}
                    onChange={(event) => setIssueDraft((current) => ({ ...current, severity: event.target.value }))}
                  >
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Issue details" full>
                  <textarea
                    rows="5"
                    value={issueDraft.text}
                    onChange={(event) => setIssueDraft((current) => ({ ...current, text: event.target.value }))}
                    placeholder="Describe the problem noticed during usage or scanning."
                  />
                </Field>
                <button type="button" className="facilities-button" onClick={reportIssue}>
                  Submit report
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && page === 'issues' ? (
        <section className="facilities-stack">
          <div className="facilities-card facilities-panel">
            <div className="facilities-panel__header">
              <h3>{isAdmin ? 'Issue triage board' : 'Reported issues'}</h3>
              <span>{issueRows.length} total</span>
            </div>
            <div className="facilities-stack">
              {issueRows.length === 0 ? <p className="facilities-muted">No issues recorded yet.</p> : null}
              {issueRows.map((issue) => (
                <div key={`${issue.assetId}-${issue.id}`} className="facilities-issue">
                  <div className="facilities-grow">
                    <div className="facilities-tags">
                      <span
                        className={`facilities-pill ${
                          issue.status === 'RESOLVED' ? 'facilities-pill--green' : 'facilities-pill--amber'
                        }`}
                      >
                        {issue.status}
                      </span>
                      <span className="facilities-tag">{issue.severity}</span>
                      <span className="facilities-tag">{issue.assetCode}</span>
                    </div>
                    <h3>{issue.assetName}</h3>
                    <p>{issue.text}</p>
                    <span className="facilities-muted">
                      {issue.locationText || 'Location pending'} | {issue.date || 'No date'}
                    </span>
                  </div>
                  {isAdmin && issue.status !== 'RESOLVED' ? (
                    <button
                      type="button"
                      className="facilities-button facilities-button--ghost"
                      onClick={() => resolveIssue(issue)}
                    >
                      Resolve
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && page === 'analytics' ? (
        <section className="facilities-split">
          <div className="facilities-card facilities-panel">
            <div className="facilities-panel__header">
              <h3>Monthly usage trend</h3>
              <span>12-month view</span>
            </div>
            <div className="facilities-chart">
              {monthlyTotals.map((entry) => (
                <div key={entry.month} className="facilities-chart__column">
                  <div className="facilities-chart__bar" style={{ height: `${(entry.value / maxMonthly) * 100}%` }} />
                  <span>{entry.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="facilities-card facilities-panel">
            <div className="facilities-panel__header">
              <h3>Inventory mix</h3>
              <span>By resource type</span>
            </div>
            <div className="facilities-stack">
              {TYPE_OPTIONS.map((type) => {
                const count = assets.filter((asset) => asset.resourceType === type).length
                return (
                  <div key={type} className="facilities-mix">
                    <TypeBadge type={type} />
                    <div className="facilities-mix__bar">
                      <div style={{ width: `${assets.length ? (count / assets.length) * 100 : 0}%` }} />
                    </div>
                    <strong>{count}</strong>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && isAdmin && page === 'maintenance' ? (
        <section className="facilities-stack">
          <div className="facilities-stats">
            <StatCard label="Overdue" value={overdueAssets.length} tone="rose" />
            <StatCard label="Due in 30 days" value={upcomingAssets.length} tone="amber" />
            <StatCard label="Healthy" value={healthyAssets.length} tone="green" />
            <StatCard
              label="Tracked schedules"
              value={overdueAssets.length + upcomingAssets.length + healthyAssets.length}
              tone="blue"
            />
          </div>

          <div className="facilities-card facilities-panel">
            <div className="facilities-panel__header">
              <h3>Maintenance schedule</h3>
              <span>Service actions</span>
            </div>
            <div className="facilities-stack">
              {[...overdueAssets, ...upcomingAssets].map((asset) => (
                <div key={asset.id} className="facilities-maintenance">
                  <div className="facilities-grow">
                    <h3>{asset.name}</h3>
                    <p>{asset.locationText}</p>
                    <span className="facilities-muted">
                      Last service {asset.lastServiceDate || 'unknown'} | Next service{' '}
                      {asset.nextServiceDate || 'unscheduled'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="facilities-button facilities-button--ghost"
                    onClick={() => markServiced(asset)}
                  >
                    Mark serviced
                  </button>
                </div>
              ))}
              {overdueAssets.length === 0 && upcomingAssets.length === 0 ? (
                <p className="facilities-muted">Everything is comfortably within its service window.</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {!loading && page === 'notifications' ? (
        <section className="facilities-stack">
          <div className="facilities-page-actions">
            <div>
              <p className="facilities-eyebrow">Activity feed</p>
              <h3>Operational notifications</h3>
            </div>
            <button
              type="button"
              className="facilities-button facilities-button--ghost"
              onClick={() => setReadNotifications(notifications.map((item) => item.id))}
            >
              Mark all read
            </button>
          </div>

          <div className="facilities-stack">
            {notifications.map((notification) => {
              const unread = !readNotifications.includes(notification.id)
              return (
                <div
                  key={notification.id}
                  className={`facilities-card facilities-notification ${unread ? 'is-unread' : ''}`}
                >
                  <div className="facilities-grow">
                    <p className="facilities-eyebrow">{notification.category}</p>
                    <h3>{notification.title}</h3>
                    <p>{notification.text}</p>
                  </div>
                  {unread ? (
                    <button
                      type="button"
                      className="facilities-button facilities-button--ghost"
                      onClick={() =>
                        setReadNotifications((current) => [...new Set([...current, notification.id])])
                      }
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              )
            })}
            {notifications.length === 0 ? (
              <div className="facilities-card facilities-empty">No notifications right now.</div>
            ) : null}
          </div>
        </section>
      ) : null}

      {selectedAsset ? (
        <Modal title={selectedAsset.name} onClose={() => setSelectedAsset(null)}>
          <div className="facilities-stack">
            <div className="facilities-detail-image">
              <img src={selectedAsset.displayImageUrl} alt={selectedAsset.name} className="facilities-detail-image__asset" />
            </div>
            <div className="facilities-detail-head">
              <TypeBadge type={selectedAsset.resourceType} />
              <div>
                <p className="facilities-eyebrow">{selectedAsset.resourceCode}</p>
                <h3>{selectedAsset.name}</h3>
                <p className="facilities-muted">{selectedAsset.locationText}</p>
              </div>
            </div>
            <p className="facilities-muted">{selectedAsset.description || 'No description provided.'}</p>
            <div className="facilities-detail-grid">
              <Fact label="Status" value={STATUS_LABELS[selectedAsset.status] || selectedAsset.status} />
              <Fact
                label="Condition"
                value={CONDITION_LABELS[selectedAsset.condition] || selectedAsset.condition}
              />
              <Fact label="Capacity" value={selectedAsset.capacity} />
              <Fact label="Rating" value={selectedAsset.rating.toFixed(1)} />
              <Fact label="Total bookings" value={selectedAsset.totalBookings} />
              <Fact label="Today's bookings" value={selectedAsset.bookingsToday} />
            </div>
            <div className="facilities-actions">
              <button
                type="button"
                className="facilities-button"
                onClick={() =>
                  navigate(
                    `/bookings/new?resourceId=${selectedAsset.id}&resourceCode=${encodeURIComponent(
                      selectedAsset.resourceCode || '',
                    )}`,
                  )
                }
              >
                Book this resource
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {editorState ? (
        <Modal title={editorState.original ? 'Edit asset' : 'Create asset'} onClose={() => setEditorState(null)}>
          <form className="facilities-form" onSubmit={submitAssetForm}>
            <Field label="Code">
              <input
                value={editorState.values.resourceCode}
                onChange={(event) => updateForm(setEditorState, 'resourceCode', event.target.value)}
                required
              />
            </Field>
            <Field label="Name">
              <input
                value={editorState.values.name}
                onChange={(event) => updateForm(setEditorState, 'name', event.target.value)}
                required
              />
            </Field>
            <Field label="Type">
              <select
                value={editorState.values.resourceType}
                onChange={(event) => updateForm(setEditorState, 'resourceType', event.target.value)}
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_META[type]?.label || type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Category">
              <input
                value={editorState.values.category}
                onChange={(event) => updateForm(setEditorState, 'category', event.target.value)}
                required
              />
            </Field>
            <Field label="Capacity">
              <input
                type="number"
                min="0"
                value={editorState.values.capacity}
                onChange={(event) => updateForm(setEditorState, 'capacity', event.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                value={editorState.values.status}
                onChange={(event) => updateForm(setEditorState, 'status', event.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status] || status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Condition">
              <select
                value={editorState.values.condition}
                onChange={(event) => updateForm(setEditorState, 'condition', event.target.value)}
              >
                {CONDITION_OPTIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {CONDITION_LABELS[condition]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Borrowed">
              <select
                value={String(editorState.values.borrowed)}
                onChange={(event) => updateForm(setEditorState, 'borrowed', event.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </Field>
            <Field label="Building">
              <input
                value={editorState.values.building}
                onChange={(event) => updateForm(setEditorState, 'building', event.target.value)}
              />
            </Field>
            <Field label="Floor">
              <input
                type="number"
                value={editorState.values.floorNumber}
                onChange={(event) => updateForm(setEditorState, 'floorNumber', event.target.value)}
              />
            </Field>
            <Field label="Room">
              <input
                value={editorState.values.roomNumber}
                onChange={(event) => updateForm(setEditorState, 'roomNumber', event.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                value={editorState.values.locationText}
                onChange={(event) => updateForm(setEditorState, 'locationText', event.target.value)}
              />
            </Field>
            <Field label="Available from">
              <input
                type="time"
                value={editorState.values.availableFrom}
                onChange={(event) => updateForm(setEditorState, 'availableFrom', event.target.value)}
              />
            </Field>
            <Field label="Available to">
              <input
                type="time"
                value={editorState.values.availableTo}
                onChange={(event) => updateForm(setEditorState, 'availableTo', event.target.value)}
              />
            </Field>
            <Field label="Rating">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editorState.values.rating}
                onChange={(event) => updateForm(setEditorState, 'rating', event.target.value)}
              />
            </Field>
            <Field label="Bookings">
              <input
                type="number"
                min="0"
                value={editorState.values.totalBookings}
                onChange={(event) => updateForm(setEditorState, 'totalBookings', event.target.value)}
              />
            </Field>
            <Field label="Today">
              <input
                type="number"
                min="0"
                value={editorState.values.bookingsToday}
                onChange={(event) => updateForm(setEditorState, 'bookingsToday', event.target.value)}
              />
            </Field>
            <Field label="Last service">
              <input
                type="date"
                value={editorState.values.lastServiceDate}
                onChange={(event) => updateForm(setEditorState, 'lastServiceDate', event.target.value)}
              />
            </Field>
            <Field label="Next service">
              <input
                type="date"
                value={editorState.values.nextServiceDate}
                onChange={(event) => updateForm(setEditorState, 'nextServiceDate', event.target.value)}
              />
            </Field>
            <Field label="Amenities">
              <input
                value={editorState.values.amenities}
                onChange={(event) => updateForm(setEditorState, 'amenities', event.target.value)}
                placeholder="Comma separated"
              />
            </Field>
            <Field label="Monthly bookings">
              <input
                value={editorState.values.monthlyBookings}
                onChange={(event) => updateForm(setEditorState, 'monthlyBookings', event.target.value)}
                placeholder="12 comma-separated values"
              />
            </Field>
            <Field label="Image URL">
              <input
                value={editorState.values.imageUrl}
                onChange={(event) => updateForm(setEditorState, 'imageUrl', event.target.value)}
              />
            </Field>
            <Field label="Needs approval">
              <select
                value={String(editorState.values.requiresApproval)}
                onChange={(event) =>
                  updateForm(setEditorState, 'requiresApproval', event.target.value === 'true')
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </Field>
            <Field label="Active">
              <select
                value={String(editorState.values.isActive)}
                onChange={(event) => updateForm(setEditorState, 'isActive', event.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </Field>
            <Field label="Description" full>
              <textarea
                rows="4"
                value={editorState.values.description}
                onChange={(event) => updateForm(setEditorState, 'description', event.target.value)}
              />
            </Field>
            <div className="facilities-actions facilities-form__actions">
              <button
                type="button"
                className="facilities-button facilities-button--ghost"
                onClick={() => setEditorState(null)}
              >
                Cancel
              </button>
              <button type="submit" className="facilities-button">
                Save asset
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {toast ? <div className={`facilities-toast ${toast.tone === 'danger' ? 'is-danger' : ''}`}>{toast.message}</div> : null}
    </div>
  )
}

function Modal({ children, title, onClose }) {
  return (
    <div className="facilities-modal">
      <div className="facilities-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="facilities-modal__content facilities-card">
        <div className="facilities-panel__header">
          <h3>{title}</h3>
          <button type="button" className="facilities-button facilities-button--ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ children, label, full = false }) {
  return (
    <label className={`facilities-field ${full ? 'is-full' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`facilities-card facilities-stat facilities-stat--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}

function AlertRow({ title, text }) {
  return (
    <div className="facilities-alert">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div className="facilities-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.EQUIPMENT
  return (
    <span className={`facilities-type ${meta.tone}`}>
      <strong>{meta.icon}</strong>
      <span>{meta.label}</span>
    </span>
  )
}

function PseudoQr({ value }) {
  const seed = value.split('').reduce((sum, character, index) => sum + character.charCodeAt(0) * (index + 1), 0)
  const cells = Array.from({ length: 121 }, (_, index) => {
    const row = Math.floor(index / 11)
    const column = index % 11
    const anchor = (row < 3 && column < 3) || (row < 3 && column > 7) || (row > 7 && column < 3)
    return anchor || ((seed + row * 17 + column * 31 + index * 7) % 5) < 2
  })

  return (
    <div className="facilities-qr" aria-label={`QR preview for ${value}`}>
      {cells.map((filled, index) => (
        <span key={`${value}-${index}`} className={`facilities-qr__cell ${filled ? 'is-filled' : ''}`} />
      ))}
    </div>
  )
}

function makeInlineAssetImage(title, accent) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#09111f" />
          <stop offset="100%" stop-color="#13253d" />
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.72" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <circle cx="920" cy="210" r="160" fill="${accent}" opacity="0.18" />
      <circle cx="220" cy="160" r="110" fill="#38bdf8" opacity="0.12" />
      <rect x="140" y="180" width="920" height="500" rx="32" fill="#0f172a" stroke="#334155" />
      <rect x="210" y="245" width="460" height="290" rx="22" fill="#020617" stroke="#334155" />
      <circle cx="440" cy="390" r="115" fill="none" stroke="url(#glow)" stroke-width="28" />
      <circle cx="440" cy="390" r="56" fill="${accent}" opacity="0.72" />
      <rect x="720" y="255" width="250" height="26" rx="13" fill="url(#glow)" opacity="0.95" />
      <rect x="720" y="313" width="170" height="18" rx="9" fill="#475569" />
      <rect x="720" y="352" width="210" height="18" rx="9" fill="#334155" />
      <rect x="720" y="391" width="190" height="18" rx="9" fill="#334155" />
      <rect x="720" y="475" width="190" height="110" rx="22" fill="#111827" stroke="#334155" />
      <path d="M790 520l28-32 30 36 22-24 40 48H790z" fill="${accent}" opacity="0.9" />
      <text x="140" y="770" fill="#e2e8f0" font-size="54" font-family="Segoe UI, Arial, sans-serif" font-weight="700">${title}</text>
      <text x="140" y="822" fill="#94a3b8" font-size="28" font-family="Segoe UI, Arial, sans-serif">Smart Campus Catalogue</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function resolveAssetImage(asset) {
  if (asset.imageUrl) return asset.imageUrl

  const text = [
    asset.name,
    asset.category,
    asset.resourceType,
    asset.locationText,
    asset.building,
    asset.roomNumber,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (text.includes('canon')) return IMAGE_LIBRARY.cameraCanon
  if (text.includes('sony') || text.includes('fx3')) return IMAGE_LIBRARY.cameraSony
  if (text.includes('drone')) return IMAGE_LIBRARY.drone
  if (text.includes('projector')) return IMAGE_LIBRARY.projector
  if (text.includes('laptop')) return IMAGE_LIBRARY.laptop
  if (text.includes('robot')) return IMAGE_LIBRARY.labRobotics
  if (text.includes('meeting room') || text.includes('board room') || text.includes('vip')) return IMAGE_LIBRARY.meeting
  if (text.includes('camera hall')) return IMAGE_LIBRARY.hallCamera
  if (text.includes('lecture hall') || text.includes('hall')) return IMAGE_LIBRARY.hallStandard
  if (text.includes('camera lab') || text.includes('media')) return IMAGE_LIBRARY.labCamera
  if (text.includes('project lab') || text.includes('project')) return IMAGE_LIBRARY.labProject
  if (text.includes('lab')) return IMAGE_LIBRARY.labGeneral

  return IMAGE_LIBRARY.labGeneral
}

function buildQrPayload(asset) {
  return [
    `Name: ${asset.name || '-'}`,
    `Code: ${asset.resourceCode || asset.id || '-'}`,
    `Type: ${TYPE_META[asset.resourceType]?.label || asset.resourceType || '-'}`,
    `Category: ${asset.category || '-'}`,
    `Location: ${asset.locationText || '-'}`,
    `Capacity: ${asset.capacity ?? '-'}`,
    `Status: ${STATUS_LABELS[asset.status] || asset.status || '-'}`,
    `Available: ${asset.availableFrom || '--'} - ${asset.availableTo || '--'}`,
    `Condition: ${CONDITION_LABELS[asset.condition] || asset.condition || '-'}`,
    `Description: ${asset.description || 'No description available.'}`,
  ].join('\n')
}

function downloadQrSummary(asset) {
  const blob = new Blob([buildQrPayload(asset)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${asset.resourceCode || asset.id}-qr-summary.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function downloadQrCode(asset, qrCodeUrl, setToast) {
  if (!qrCodeUrl) {
    setToast({ tone: 'danger', message: 'QR image is still being prepared.' })
    return
  }

  const link = document.createElement('a')
  link.href = qrCodeUrl
  link.download = `${asset.resourceCode || asset.id}-qr.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setToast({ tone: 'success', message: 'QR image downloaded successfully.' })
}

async function copyQrPayload(asset, setToast) {
  try {
    await navigator.clipboard.writeText(buildQrPayload(asset))
    setToast({ tone: 'success', message: 'QR payload copied to the clipboard.' })
  } catch {
    setToast({ tone: 'danger', message: 'Clipboard access is blocked in this browser.' })
  }
}

function normalizeAsset(resource) {
  return {
    ...resource,
    capacity: resource.capacity ?? 0,
    rating: resource.rating ?? 0,
    totalBookings: resource.totalBookings ?? 0,
    bookingsToday: resource.bookingsToday ?? 0,
    amenities: Array.isArray(resource.amenities) ? resource.amenities : [],
    monthlyBookings: normalizeMonthlyBookings(resource.monthlyBookings),
    issues: Array.isArray(resource.issues) ? resource.issues : [],
    borrowed: Boolean(resource.borrowed),
    condition: resource.condition || 'GOOD',
    displayImageUrl: resolveAssetImage(resource),
  }
}

function assetToPayload(asset = {}) {
  return {
    resourceCode: asset.resourceCode || '',
    name: asset.name || '',
    description: asset.description || '',
    resourceType: asset.resourceType || 'EQUIPMENT',
    category: asset.category || '',
    capacity: Number(asset.capacity) || 0,
    building: asset.building || '',
    floorNumber: asset.floorNumber === '' || asset.floorNumber == null ? null : Number(asset.floorNumber),
    roomNumber: asset.roomNumber || '',
    locationText: asset.locationText || '',
    availableFrom: asset.availableFrom || null,
    availableTo: asset.availableTo || null,
    status: asset.status || 'ACTIVE',
    condition: asset.condition || 'GOOD',
    borrowed: Boolean(asset.borrowed),
    rating: Number(asset.rating) || 0,
    lastServiceDate: asset.lastServiceDate || null,
    nextServiceDate: asset.nextServiceDate || null,
    totalBookings: Number(asset.totalBookings) || 0,
    bookingsToday: Number(asset.bookingsToday) || 0,
    amenities: asset.amenities || [],
    monthlyBookings: normalizeMonthlyBookings(asset.monthlyBookings),
    issues: asset.issues || [],
    imageUrl: asset.imageUrl || '',
    requiresApproval: Boolean(asset.requiresApproval),
    isActive: asset.isActive ?? asset.status !== 'INACTIVE',
  }
}

function assetToForm(asset) {
  return {
    resourceCode: asset.resourceCode || '',
    name: asset.name || '',
    resourceType: asset.resourceType || 'EQUIPMENT',
    category: asset.category || '',
    capacity: String(asset.capacity ?? 0),
    building: asset.building || '',
    floorNumber: asset.floorNumber ?? '',
    roomNumber: asset.roomNumber || '',
    locationText: asset.locationText || '',
    availableFrom: asset.availableFrom || '08:00',
    availableTo: asset.availableTo || '17:00',
    status: asset.status || 'ACTIVE',
    condition: asset.condition || 'GOOD',
    borrowed: Boolean(asset.borrowed),
    rating: String(asset.rating ?? 0),
    lastServiceDate: asset.lastServiceDate || '',
    nextServiceDate: asset.nextServiceDate || '',
    totalBookings: String(asset.totalBookings ?? 0),
    bookingsToday: String(asset.bookingsToday ?? 0),
    amenities: (asset.amenities || []).join(', '),
    monthlyBookings: normalizeMonthlyBookings(asset.monthlyBookings).join(','),
    description: asset.description || '',
    imageUrl: asset.imageUrl || '',
    requiresApproval: Boolean(asset.requiresApproval),
    isActive: asset.isActive ?? asset.status !== 'INACTIVE',
  }
}

function formToPayload(values, originalAsset) {
  const monthlyBookings = values.monthlyBookings
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item))

  return {
    ...assetToPayload(originalAsset),
    resourceCode: values.resourceCode.trim(),
    name: values.name.trim(),
    description: values.description.trim(),
    resourceType: values.resourceType,
    category: values.category.trim(),
    capacity: Number(values.capacity) || 0,
    building: values.building.trim(),
    floorNumber: values.floorNumber === '' ? null : Number(values.floorNumber),
    roomNumber: values.roomNumber.trim(),
    locationText: values.locationText.trim(),
    availableFrom: values.availableFrom || null,
    availableTo: values.availableTo || null,
    status: values.status,
    condition: values.condition,
    borrowed: Boolean(values.borrowed),
    rating: Number(values.rating) || 0,
    lastServiceDate: values.lastServiceDate || null,
    nextServiceDate: values.nextServiceDate || null,
    totalBookings: Number(values.totalBookings) || 0,
    bookingsToday: Number(values.bookingsToday) || 0,
    amenities: values.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    monthlyBookings: normalizeMonthlyBookings(monthlyBookings),
    issues: originalAsset?.issues || [],
    imageUrl: values.imageUrl.trim(),
    requiresApproval: Boolean(values.requiresApproval),
    isActive: Boolean(values.isActive),
  }
}

function normalizeMonthlyBookings(values) {
  if (!Array.isArray(values) || values.length !== 12) {
    return new Array(12).fill(0)
  }
  return values.map((value) => Number(value) || 0)
}

function buildNotifications(assets) {
  return assets.flatMap((asset) => {
    const items = []
    if (asset.borrowed) {
      items.push({
        id: `borrowed-${asset.id}`,
        category: 'Asset return',
        title: `${asset.name} is currently borrowed`,
        text: 'Usage status is active, so the item is still checked out.',
      })
    }
    if (isPast(asset.nextServiceDate)) {
      items.push({
        id: `service-${asset.id}`,
        category: 'Maintenance',
        title: `${asset.name} needs scheduled service`,
        text: `Next service date ${asset.nextServiceDate || 'is missing'} now needs attention.`,
      })
    }
    asset.issues.filter((issue) => issue.status !== 'RESOLVED').forEach((issue) => {
      items.push({
        id: `issue-${asset.id}-${issue.id}`,
        category: 'Issue report',
        title: `${asset.name} has an open ${String(issue.severity || '').toLowerCase()} issue`,
        text: issue.text,
      })
    })
    return items
  })
}

function updateForm(setter, field, value) {
  setter((current) => ({ ...current, values: { ...current.values, [field]: value } }))
}

function isPast(value) {
  if (!value) return false
  return new Date(value) < startOfToday()
}

function isWithinThirtyDays(value) {
  if (!value) return false
  const date = new Date(value)
  const today = startOfToday()
  const limit = new Date(today)
  limit.setDate(limit.getDate() + 30)
  return date >= today && date <= limit
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
