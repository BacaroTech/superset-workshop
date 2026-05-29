import { useState } from 'react'
import './EmbedForm.css'

export default function EmbedForm({ onEmbed }) {
  const [dashboardId, setDashboardId] = useState('')
  const [error, setError]             = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!dashboardId.trim()) return
    setError(null)
    onEmbed(dashboardId.trim())
  }

  return (
    <form className="embed-form" onSubmit={handleSubmit}>
      <div className="embed-form-row">
        <div className="embed-form-field">
          <label htmlFor="dashId">Dashboard ID</label>
          <input
            id="dashId"
            type="text"
            placeholder="es. ce8d40a9-b5ba-4ac8-93ea-446ceb600d81"
            value={dashboardId}
            onChange={e => setDashboardId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Incorpora →</button>
      </div>

      {error && <p className="embed-error">⚠ {error}</p>}

      <p className="embed-hint">
        Trovi l'ID in Superset → <code>Dashboard → ⋮ → Embed dashboard → UUID</code>
      </p>
    </form>
  )
}
