import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { useAuthStore } from './store/authStore'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const { darkMode } = useAuthStore.getState()
if (darkMode) {
  document.documentElement.classList.add('dark')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
