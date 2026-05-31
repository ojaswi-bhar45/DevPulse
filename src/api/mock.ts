import type { User, Build, Incident, Repo, AISummary } from '../types'
import { genId, pickRandom, randomInt } from '../lib/helpers'
import {
  REPO_NAMES, BRANCHES, COMMIT_MESSAGES, INCIDENT_TITLES, ASSIGNEES,
} from '../lib/constants'

const now = Date.now()
const MS_DAY = 86400000

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Chen',
  email: 'alex@devpulse.io',
  avatar: '',
  role: 'admin',
  org: 'DevPulse',
}

function randomDate(daysAgo: number): string {
  return new Date(now - randomInt(0, daysAgo * MS_DAY)).toISOString()
}

function randomDuration(): string {
  const m = randomInt(0, 15)
  const s = randomInt(10, 59)
  return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const statusWeights = [12, 4, 2, 2] as [number, number, number, number]
const statuses: Build['status'][] = ['passed', 'failed', 'running', 'skipped']

function pickWeightedStatus(): Build['status'] {
  const total = statusWeights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < statuses.length; i++) {
    r -= statusWeights[i]
    if (r <= 0) return statuses[i]
  }
  return 'passed'
}

export function generateMockBuilds(count = 20): Build[] {
  return Array.from({ length: count }, (_, i) => ({
    id: genId(),
    repo: pickRandom(REPO_NAMES),
    branch: pickRandom(BRANCHES),
    runNumber: 1000 + i,
    commitMessage: pickRandom(COMMIT_MESSAGES),
    status: pickWeightedStatus(),
    duration: randomDuration(),
    triggeredAt: randomDate(14),
  }))
}

export function generateMockIncidents(count = 10): Incident[] {
  const severities: Incident['severity'][] = ['P1', 'P2', 'P3']
  const statuses: Incident['status'][] = ['open', 'investigating', 'resolved']
  return Array.from({ length: count }, (_, i) => {
    const slaMinutes = pickRandom([30, 60, 120, 240])
    const createdAt = new Date(now - randomInt(10, 400) * 60000).toISOString()
    const elapsedMinutes = Math.floor((now - new Date(createdAt).getTime()) / 60000)
    return {
      id: genId(),
      title: INCIDENT_TITLES[i % INCIDENT_TITLES.length],
      severity: severities[randomInt(0, severities.length - 1)],
      status: statuses[randomInt(0, statuses.length - 1)],
      assignee: pickRandom(ASSIGNEES),
      createdAt,
      slaMinutes,
      elapsedMinutes: Math.min(elapsedMinutes, slaMinutes + randomInt(0, 30)),
      aiSuggestion: Math.random() > 0.5
        ? `Suggested rollback of deployment ${pickRandom(['v2.1.3', 'v2.1.4', 'v3.0.0'])} affecting ${pickRandom(['auth service', 'API gateway', 'worker pool'])}`
        : undefined,
    }
  })
}

export function generateMockRepos(count = 8): Repo[] {
  return REPO_NAMES.slice(0, count).map((name) => ({
    id: genId(),
    name,
    language: pickRandom(['TypeScript', 'Python', 'Go', 'Rust'] as const),
    branches: randomInt(2, 12),
    buildHistory: Array.from({ length: 10 }, () =>
      Math.random() > 0.3 ? 'passed' : 'failed'
    ),
  }))
}

export function generateMockSummaries(count = 6): AISummary[] {
  const riskLevels: AISummary['riskLevel'][] = ['low', 'medium', 'high']
  const prTitles = [
    'PR #342: Refactor authentication middleware',
    'PR #341: Add rate limiting to API gateway',
    'PR #340: Update dependency graph',
    'PR #339: Fix WebSocket reconnection logic',
  ]
  const incidentTitles = [
    'Incident INC-023: Database connection pool exhausted',
    'Incident INC-024: Memory leak in worker process',
  ]
  return Array.from({ length: count }, (_, i) => {
    const isPR = i < 4
    const title = isPR ? prTitles[i] : incidentTitles[i - 4]
    const type = isPR ? 'pr' : 'incident'
    const riskLevel = riskLevels[randomInt(0, riskLevels.length - 1)]
    const body = `Analysis of ${title}. ${
      type === 'pr'
        ? 'This change modifies 12 files across 3 modules. Test coverage increases by 8%. No breaking changes detected. Recommended merge window: next 4 hours.'
        : 'Root cause identified as a recent deployment change. Rollback recommended. Estimated resolution time: 30 minutes. Affected services: auth, api-gateway.'
    }`
    return {
      id: genId(),
      type,
      title,
      body,
      riskLevel,
      createdAt: randomDate(7),
    }
  })
}
