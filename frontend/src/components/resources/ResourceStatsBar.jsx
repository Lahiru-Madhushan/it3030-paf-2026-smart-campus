function ResourceStatsBar({ resources = [] }) {
  const total = resources.length
  const active = resources.filter((item) => item.status === 'ACTIVE').length
  const labs = resources.filter((item) => item.resourceType === 'LAB').length
  const equipment = resources.filter((item) => item.resourceType === 'EQUIPMENT').length

  const cards = [
    { label: 'Visible Resources', value: total },
    { label: 'Active', value: active },
    { label: 'Labs', value: labs },
    { label: 'Equipment', value: equipment },
  ]

  return (
    <div className="resource-stats-grid">
      {cards.map((card) => (
        <div className="resource-stat-card" key={card.label}>
          <p>{card.label}</p>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  )
}

export default ResourceStatsBar
