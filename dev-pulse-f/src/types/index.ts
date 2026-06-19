export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'member'
  org: string
}

export interface Build {
  id: string
  repo: string
  branch: string
  runNumber: number
  commitMessage: string
  status: 'passed' | 'failed' | 'running' | 'skipped'
  duration: string
  triggeredAt: string
}

export interface Incident {
  id: string
  title: string
  severity: 'P1' | 'P2' | 'P3'
  status: 'open' | 'investigating' | 'resolved'
  assignee: string
  createdAt: string
  slaMinutes: number
  elapsedMinutes: number
  aiSuggestion?: string
}

export interface Repo {
  id: string
  name: string
  language: string
  branches: number
  buildHistory: ('passed' | 'failed')[]
}

export interface AISummary {
  id: string
  type: 'pr' | 'incident'
  title: string
  body: string
  riskLevel: 'low' | 'medium' | 'high'
  createdAt: string
}
