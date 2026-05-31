import { create } from 'zustand'
import type { Incident } from '../types'
import { generateMockIncidents } from '../api/mock'

interface IncidentState {
  incidents: Incident[]
  loading: boolean
  error: string | null
  severityFilter: Incident['severity'] | 'all'
  fetchIncidents: () => void
  setSeverityFilter: (severity: Incident['severity'] | 'all') => void
  tickElapsed: () => void
  resolveIncident: (id: string) => void
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  loading: true,
  error: null,
  severityFilter: 'all',

  fetchIncidents: () => {
    set({ loading: true, error: null })
    setTimeout(() => {
      set({ incidents: generateMockIncidents(10), loading: false })
    }, 800)
  },

  setSeverityFilter: (severity) => set({ severityFilter: severity }),

  tickElapsed: () => {
    const { incidents } = get()
    set({
      incidents: incidents.map((inc) =>
        inc.status !== 'resolved'
          ? { ...inc, elapsedMinutes: inc.elapsedMinutes + 1 }
          : inc
      ),
    })
  },

  resolveIncident: (id) => {
    const { incidents } = get()
    set({
      incidents: incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'resolved' as const } : inc
      ),
    })
  },
}))
