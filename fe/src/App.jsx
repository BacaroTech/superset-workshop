import { useState } from 'react'
import EmbedForm from './components/EmbedForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

export default function App() {
  const [embedUrl, setEmbedUrl] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-tag">workshop</span>
        <h1>Superset Embed</h1>
        <p className="app-sub">Incolla l'ID della tua dashboard e visualizzala qui.</p>
      </header>

      <main className="app-main">
        <EmbedForm onEmbed={setEmbedUrl} />
        {embedUrl && <Dashboard src={embedUrl} />}
      </main>
    </div>
  )
}
