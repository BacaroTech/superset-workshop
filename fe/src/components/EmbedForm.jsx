import { useState } from 'react'
import './EmbedForm.css'

const BE_URL = 'http://localhost:4000'

export default function EmbedForm({ onEmbed }) {
  const [dashboardId, setDashboardId] = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!dashboardId.trim()) return

    setLoading(true)
    setError(null)

    try {
      // 1. Chiedi al BE il guest token per questa dashboard
      const res = await fetch(`${BE_URL}/embed/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashboardId: dashboardId.trim() }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}))
        throw new Error(msg || `Errore BE: ${res.status}`)
      }

      const { token } = await res.json()

      // 2. Costruisci l'URL di embedding di Superset
      const url = `http://localhost:8088/embedded/dashboard/${dashboardId.trim()}?guest_token=${token}`
      onEmbed(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="embed-form" onSubmit={handleSubmit}>
      <div className="embed-form-row">
        <div className="embed-form-field">
          <label htmlFor="dashId">Dashboard ID</label>
          <input
            id="dashId"
            type="text"
            placeholder="es. a1b2c3d4-e5f6-..."
            value={dashboardId}
            onChange={e => setDashboardId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Carico…' : 'Incorpora →'}
        </button>
      </div>

      {error && <p className="embed-error">⚠ {error}</p>}

      <p className="embed-hint">
        Trovi l'ID in Superset → <code>Dashboard → ⋮ → Edit dashboard → UUID</code>
      </p>
    </form>
  )
}
