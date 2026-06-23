import { create } from 'zustand'
import type { Build } from '../types'
import apiClient from '../api/client'

interface BuildState {
  builds: Build[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  filterStatus: Build['status'] | 'all'
  currentPage: number
  pageSize: number
  fetchBuilds: () => Promise<void>
  setFilterStatus: (status: Build['status'] | 'all') => void
  setCurrentPage: (page: number) => void
  addOrUpdateBuild: (build: Build) => void
}

export const useBuildStore = create<BuildState>((set, get) => ({
  builds: [],
  total: 0,
  totalPages: 0,
  loading: true,
  error: null,
  filterStatus: 'all',
  currentPage: 1,
  pageSize: 10,

  fetchBuilds: async () => {
    set({ loading: true, error: null })
    try {
      const { filterStatus, currentPage, pageSize } = get()
      const res = await apiClient.get('/builds', {
        params: { page: currentPage, pageSize, status: filterStatus },
      })
      set({ builds: res.data.builds, total: res.data.total, totalPages: res.data.totalPages, loading: false })
    } catch {
      set({ error: 'Failed to load builds', loading: false })
    }
  },

  setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addOrUpdateBuild: (build) =>
    set((state) => {
      const exists = state.builds.findIndex((b) => b.id === build.id)
      if (exists >= 0) {
        const builds = [...state.builds]
        builds[exists] = build
        return { builds }
      }
      return { builds: [build, ...state.builds], total: state.total + 1 }
    }),
}))
