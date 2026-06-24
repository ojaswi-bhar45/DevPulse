import { create } from 'zustand'
import type { AISummary } from '../types'
import apiClient from '../api/client'

interface AIStoreState {
  summaries: AISummary[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  filter: 'all' | AISummary['type']
  currentPage: number
  pageSize: number
  fetchSummaries: () => Promise<void>
  setFilter: (filter: 'all' | AISummary['type']) => void
  setCurrentPage: (page: number) => void
  addOrUpdateSummary: (summary: AISummary) => void
}

export const useAIStore = create<AIStoreState>((set, get) => ({
  summaries: [],
  total: 0,
  totalPages: 0,
  loading: true,
  error: null,
  filter: 'all',
  currentPage: 1,
  pageSize: 10,

  fetchSummaries: async () => {
    set({ loading: true, error: null })
    try {
      const { filter, currentPage, pageSize } = get()
      const params: Record<string, string | number> = { page: currentPage, pageSize }
      if (filter !== 'all') params.type = filter
      const res = await apiClient.get('/ai/summaries', { params })
      set({
        summaries: res.data.summaries,
        total: res.data.total,
        totalPages: res.data.totalPages,
        loading: false,
      })
    } catch {
      set({ error: 'Failed to load summaries', loading: false })
    }
  },

  setFilter: (filter) => set({ filter, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addOrUpdateSummary: (summary) =>
    set((state) => {
      const exists = state.summaries.findIndex((s) => s.id === summary.id)
      if (exists >= 0) {
        const summaries = [...state.summaries]
        summaries[exists] = summary
        return { summaries }
      }
      return { summaries: [summary, ...state.summaries], total: state.total + 1 }
    }),
}))
