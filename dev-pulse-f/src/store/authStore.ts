import { create } from 'zustand'
import type { User } from '../types'
import apiClient from '../api/client'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  darkMode: boolean
  sidebarOpen: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  refreshToken: () => Promise<string | null>
  setAccessToken: (token: string | null) => void
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
}

let accessToken: string | null = localStorage.getItem('accessToken')

export function getAccessToken() {
  return accessToken
}

export function setAccessToken(token: string | null) {
  accessToken = token
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: accessToken,
  isAuthenticated: false,
  isLoading: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,

  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password })
    const { user, accessToken: token } = res.data
    setAccessToken(token)
    set({ user, accessToken: token, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    const res = await apiClient.post('/auth/register', { name, email, password })
    const { user, accessToken: token } = res.data
    setAccessToken(token)
    set({ user, accessToken: token, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore
    }
    setAccessToken(null)
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const res = await apiClient.get('/auth/me')
      set({ user: res.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
      setAccessToken(null)
    }
  },

  refreshToken: async () => {
    try {
      const res = await apiClient.post('/auth/refresh')
      const token: string = res.data.accessToken
      setAccessToken(token)
      set({ accessToken: token })
      return token
    } catch {
      setAccessToken(null)
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false })
      return null
    }
  },

  setAccessToken: (token) => {
    setAccessToken(token)
    set({ accessToken: token })
  },

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      localStorage.setItem('darkMode', String(next))
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: next }
    }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
