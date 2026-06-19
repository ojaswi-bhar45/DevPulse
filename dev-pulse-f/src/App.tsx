import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BuildsPage } from './features/builds/BuildsPage'
import { IncidentsPage } from './features/incidents/IncidentsPage'
import { ReposPage } from './features/repos/ReposPage'
import { AIPage } from './features/ai/AIPage'
import { useBuildStore } from './store/buildStore'

export default function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      useBuildStore.getState().simulateBuildUpdate()
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/builds" element={<BuildsPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/repos" element={<ReposPage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </BrowserRouter>
  )
}
