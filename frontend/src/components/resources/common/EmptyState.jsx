function EmptyState({
  title = 'No data found',
  description = 'Try changing your filters or add a new resource.',
}) {
  return (
    <div className="resource-card resource-centered">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
