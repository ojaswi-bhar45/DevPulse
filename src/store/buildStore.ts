import { create } from 'zustand'
import type { Build } from '../types'
import { generateMockBuilds } from '../api/mock'
import { genId } from '../lib/helpers'

interface BuildState {
  builds: Build[]
  loading: boolean
  error: string | null
  filterStatus: Build['status'] | 'all'
  currentPage: number
  pageSize: number
  fetchBuilds: () => void
  setFilterStatus: (status: Build['status'] | 'all') => void
  setCurrentPage: (page: number) => void
  simulateBuildUpdate: () => void
  addBuild: (build: Omit<Build, 'id' | 'runNumber' | 'triggeredAt'>) => void
}

export const useBuildStore = create<BuildState>((set, get) => ({
  builds: [],
  loading: true,
  error: null,
  filterStatus: 'all',
  currentPage: 1,
  pageSize: 10,

  fetchBuilds: () => {
    set({ loading: true, error: null })
    setTimeout(() => {
      set({ builds: generateMockBuilds(20), loading: false })
    }, 800)
  },

  setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  simulateBuildUpdate: () => {
    const { builds } = get()
    const running = builds.filter((b) => b.status === 'running')
    if (running.length === 0) return
    const target = running[Math.floor(Math.random() * running.length)]
    const passed = Math.random() > 0.25
    set({
      builds: builds.map((b) =>
        b.id === target.id
          ? { ...b, status: passed ? 'passed' : ('failed' as const), duration: `00:0${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}` }
          : b
      ),
    })
  },

  addBuild: (buildData) => {
    const { builds } = get()
    const newBuild: Build = {
      ...buildData,
      id: genId(),
      runNumber: builds.length > 0 ? Math.max(...builds.map((b) => b.runNumber)) + 1 : 1001,
      triggeredAt: new Date().toISOString(),
    }
    set({ builds: [newBuild, ...builds] })
  },
}))
