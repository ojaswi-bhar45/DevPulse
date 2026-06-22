import { create } from 'zustand'
import type { Repo } from '../types'
import apiClient from '../api/client'

interface RepoState {
  repos: Repo[]
  loading: boolean
  error: string | null
  githubConnected: boolean
  githubUsername: string | null
  syncing: boolean
  fetchRepos: () => Promise<void>
  fetchGitHubStatus: () => Promise<void>
  syncRepos: () => Promise<void>
}

export const useRepoStore = create<RepoState>((set, get) => ({
  repos: [],
  loading: true,
  error: null,
  githubConnected: false,
  githubUsername: null,
  syncing: false,

  fetchRepos: async () => {
    set({ loading: true, error: null })
    try {
      const res = await apiClient.get('/github/repos')
      set({ repos: res.data.repos, loading: false })
    } catch {
      set({ error: 'Failed to load repos', loading: false })
    }
  },

  fetchGitHubStatus: async () => {
    try {
      const res = await apiClient.get('/github/status')
      set({ githubConnected: res.data.connected, githubUsername: res.data.username })
    } catch {
      set({ githubConnected: false, githubUsername: null })
    }
  },

  syncRepos: async () => {
    set({ syncing: true, error: null })
    try {
      await apiClient.post('/github/sync')
      await get().fetchRepos()
    } catch {
      set({ error: 'Sync failed' })
    } finally {
      set({ syncing: false })
    }
  },
}))
