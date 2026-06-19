import { create } from 'zustand'
import type { User } from '../types'
import { mockUser } from '../api/mock'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  darkMode: boolean
  sidebarOpen: boolean
  setUser: (user: User | null) => void
  logout: () => void
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
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
