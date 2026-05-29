import { useState, useCallback } from 'react'
import EmbedForm from './components/EmbedForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

const BE_URL = 'http://localhost:4000'

export default function App() {
  const [dashboardId, setDashboardId] = useState(null)

  // L'SDK chiama questa funzione ogni volta che ha bisogno di un token fresco
  const getToken = useCallback(async () => {
    const res = await fetch(`${BE_URL}/embed/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dashboardId }),
    })
    if (!res.ok) throw new Error(`Token error: ${res.status}`)
    const { token } = await res.json()
    return token
  }, [dashboardId])

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-tag">workshop</span>
        <h1>Superset Embed</h1>
        <p className="app-sub">Incolla l'ID della tua dashboard e visualizzala qui.</p>
      </header>

      <main className="app-main">
        <EmbedForm onEmbed={setDashboardId} />
        {dashboardId && <Dashboard dashboardId={dashboardId} getToken={getToken} />}
      </main>
    </div>
  )
}
