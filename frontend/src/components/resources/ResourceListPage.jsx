import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useResourceFilters from '../../hooks/useResourceFilters'
import { resourceService } from '../../services/resourceService'
import { getErrorMessage } from '../../utils/resourceHelpers'
import EmptyState from './common/EmptyState'
import ErrorState from './common/ErrorState'
import LoadingState from './common/LoadingState'
import ResourceFilters from './ResourceFilters'
import ResourceStatsBar from './ResourceStatsBar'
import ResourceTable from './ResourceTable'

function ResourceListPage() {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const { filters, queryParams, updateFilter, resetFilters, setFilters } = useResourceFilters()

  const [resourcePage, setResourcePage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchResources = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await resourceService.getResources(auth?.token, queryParams)
      setResourcePage(data)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth?.token) {
      return
    }
    fetchResources()
  }, [auth?.token, queryParams])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?')
    if (!confirmed) {
      return
    }

    try {
      await resourceService.deleteResource(auth?.token, id)
      fetchResources()
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  if (loading) {
    return <LoadingState text="Loading resources..." />
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} onRetry={fetchResources} />
  }

  const resources = resourcePage?.content || []

  return (
    <div className="resource-page-stack">
      <section className="resource-hero-card">
        <div>
          <p className="resource-eyebrow">Smart Catalogue</p>
          <h2>Manage university spaces, labs, and equipment in one place</h2>
          <p>
            Search, filter, add, edit, and maintain facilities without disrupting the rest of the admin workflow.
          </p>
        </div>

        <button
          className="resource-btn resource-btn-primary"
          onClick={() => navigate('/dashboard/admin/resources/new')}
        >
          Add New Resource
        </button>
      </section>

      <ResourceStatsBar resources={resources} />

      <ResourceFilters filters={filters} onChange={updateFilter} onReset={resetFilters} />

      {resources.length === 0 ? (
        <EmptyState title="No resources available" />
      ) : (
        <>
          <ResourceTable resources={resources} onDelete={handleDelete} />

          <div className="resource-pagination-bar">
            <button
              className="resource-btn"
              disabled={resourcePage?.first}
              onClick={() => goToPage(filters.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {resourcePage?.number + 1} of {resourcePage?.totalPages || 1}
            </span>
            <button
              className="resource-btn"
              disabled={resourcePage?.last}
              onClick={() => goToPage(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ResourceListPage
