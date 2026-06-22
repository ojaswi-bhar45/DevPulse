import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BuildsPage } from './features/builds/BuildsPage'
import { IncidentsPage } from './features/incidents/IncidentsPage'
import { ReposPage } from './features/repos/ReposPage'
import { AIPage } from './features/ai/AIPage'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  const { isLoading, isAuthenticated } = useAuthStore()

  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const { accessToken, fetchUser, refreshToken } = useAuthStore.getState()
    if (accessToken) {
      fetchUser()
    } else {
      refreshToken().then((token) => {
        if (token) fetchUser()
        else useAuthStore.setState({ isLoading: false })
      })
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/builds" element={<ProtectedRoute><BuildsPage /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><IncidentsPage /></ProtectedRoute>} />
        <Route path="/repos" element={<ProtectedRoute><ReposPage /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
