function SuccessAlert({ message }) {
  if (!message) return null

  return (
    <div
      className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      role="status"
    >
      {message}
    </div>
  )
}

export default SuccessAlert
