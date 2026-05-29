import './Dashboard.css'

export default function Dashboard({ src }) {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-bar">
        <span className="dashboard-dot" />
        <span className="dashboard-label">dashboard</span>
      </div>
      <iframe
        className="dashboard-frame"
        src={src}
        title="Superset Dashboard"
        allowFullScreen
      />
    </div>
  )
}
