import { useMemo, useState } from 'react'

const initialFilters = {
  keyword: '',
  type: '',
  status: '',
  building: '',
  minCapacity: '',
  page: 0,
  size: 10,
  sortBy: 'name',
  sortDir: 'asc',
}

export default function useResourceFilters() {
  const [filters, setFilters] = useState(initialFilters)

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0,
    }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  const queryParams = useMemo(() => {
    const params = { ...filters }
    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    return params
  }, [filters])

  return {
    filters,
    queryParams,
    setFilters,
    updateFilter,
    resetFilters,
  }
}
