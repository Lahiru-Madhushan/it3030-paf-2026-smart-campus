function ErrorState({ message, onRetry }) {
  return (
    <div className="resource-card resource-centered resource-error-card">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="resource-btn resource-btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState
