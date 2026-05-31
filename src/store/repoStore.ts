import { create } from 'zustand'
import type { Repo } from '../types'
import { generateMockRepos } from '../api/mock'
import { genId } from '../lib/helpers'

interface RepoState {
  repos: Repo[]
  loading: boolean
  error: string | null
  fetchRepos: () => void
  connectRepo: (name: string, language: string) => void
}

export const useRepoStore = create<RepoState>((set, get) => ({
  repos: [],
  loading: true,
  error: null,

  fetchRepos: () => {
    set({ loading: true, error: null })
    setTimeout(() => {
      set({ repos: generateMockRepos(8), loading: false })
    }, 800)
  },

  connectRepo: (name, language) => {
    const { repos } = get()
    const exists = repos.some((r) => r.name === name)
    if (exists) {
      set({ error: 'A repository with this name already exists' })
      return
    }
    const newRepo: Repo = {
      id: genId(),
      name,
      language,
      branches: 1,
      buildHistory: [],
    }
    set({ repos: [...repos, newRepo], error: null })
  },
}))
