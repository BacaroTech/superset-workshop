import { useEffect, useRef } from 'react'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import './Dashboard.css'

const SUPERSET_URL = 'http://localhost:8088'

export default function Dashboard({ dashboardId, getToken }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    embedDashboard({
      id: dashboardId,
      supersetDomain: SUPERSET_URL,
      mountPoint: mountRef.current,
      fetchGuestToken: getToken,
      dashboardUiConfig: {
        hideTitle: false,
        hideChartControls: false,
        filters: { visible: true },
      },
    })
  }, [dashboardId, getToken])

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-bar">
        <span className="dashboard-dot" />
        <span className="dashboard-label">dashboard</span>
      </div>
      <div className="dashboard-mount" ref={mountRef} />
    </div>
  )
}
