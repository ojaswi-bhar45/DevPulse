import { create } from 'zustand'
import type { Incident } from '../types'
import apiClient from '../api/client'

interface CreateIncidentData {
  title: string
  severity: Incident['severity']
  assignee?: string
  slaMinutes: number
}

interface UpdateIncidentData {
  status?: Incident['status']
  assignee?: string
  comment?: string
}

interface IncidentState {
  incidents: Incident[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  severityFilter: Incident['severity'] | 'all'
  statusFilter: Incident['status'] | 'all'
  currentPage: number
  pageSize: number
  fetchIncidents: () => Promise<void>
  createIncident: (data: CreateIncidentData) => Promise<void>
  updateIncident: (id: string, data: UpdateIncidentData) => Promise<void>
  setSeverityFilter: (severity: Incident['severity'] | 'all') => void
  setStatusFilter: (status: Incident['status'] | 'all') => void
  setCurrentPage: (page: number) => void
  addOrUpdateIncident: (incident: Incident) => void
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  total: 0,
  totalPages: 0,
  loading: true,
  error: null,
  severityFilter: 'all',
  statusFilter: 'all',
  currentPage: 1,
  pageSize: 10,

  fetchIncidents: async () => {
    set({ loading: true, error: null })
    try {
      const { severityFilter, statusFilter, currentPage, pageSize } = get()
      const params: Record<string, string | number> = { page: currentPage, pageSize }
      if (severityFilter !== 'all') params.severity = severityFilter
      if (statusFilter !== 'all') params.status = statusFilter
      const res = await apiClient.get('/incidents', { params })
      set({
        incidents: res.data.incidents,
        total: res.data.total,
        totalPages: res.data.totalPages,
        loading: false,
      })
    } catch {
      set({ error: 'Failed to load incidents', loading: false })
    }
  },

  createIncident: async (data) => {
    await apiClient.post('/incidents', data)
  },

  updateIncident: async (id, data) => {
    await apiClient.patch(`/incidents/${id}`, data)
  },

  setSeverityFilter: (severity) => set({ severityFilter: severity, currentPage: 1 }),

  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addOrUpdateIncident: (incident) =>
    set((state) => {
      const exists = state.incidents.findIndex((i) => i.id === incident.id)
      if (exists >= 0) {
        const incidents = [...state.incidents]
        incidents[exists] = incident
        return { incidents }
      }
      return { incidents: [incident, ...state.incidents], total: state.total + 1 }
    }),
}))
