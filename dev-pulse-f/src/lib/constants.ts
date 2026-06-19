import type { Build, Incident, AISummary } from '../types'

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/builds', label: 'Builds', icon: '▶' },
  { path: '/incidents', label: 'Incidents', icon: '⚠' },
  { path: '/repos', label: 'Repositories', icon: '⎔' },
  { path: '/ai', label: 'AI Summaries', icon: '✦' },
] as const

export const STATUS_COLORS: Record<Build['status'], string> = {
  passed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  skipped: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

export const SEVERITY_COLORS: Record<Incident['severity'], string> = {
  P1: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  P2: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  P3: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
}

export const RISK_COLORS: Record<AISummary['riskLevel'], string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export const REPO_LANGUAGES = ['TypeScript', 'Python', 'Go', 'Rust', 'Kotlin', 'Swift'] as const
export const REPO_NAMES = ['devpulse-frontend', 'devpulse-api', 'devpulse-infra', 'devpulse-mobile', 'devpulse-cli', 'devpulse-auth', 'devpulse-analytics', 'devpulse-worker'] as const
export const ORGS = ['DevPulse', 'Acme Corp', 'Nexus Labs'] as const
export const ROLES = ['admin', 'member'] as const

export const BRANCHES = ['main', 'develop', 'feat/dashboard', 'fix/auth', 'chore/deps', 'feat/api-v2', 'fix/cache', 'chore/ci'] as const
export const COMMIT_MESSAGES = [
  'fix: resolve null pointer in auth handler',
  'feat: add real-time build updates',
  'chore: update dependencies',
  'fix: correct SLA timer calculation',
  'feat: implement dark mode toggle',
  'refactor: extract metric card component',
  'fix: handle empty repo state',
  'feat: add AI summary generation',
  'test: add unit tests for store',
  'docs: update API documentation',
] as const

export const INCIDENT_TITLES = [
  'Production database connection pool exhausted',
  'API gateway latency spike above 2s',
  'Authentication service returning 503',
  'CI pipeline stuck on integration tests',
  'Memory leak in build worker process',
  'CDN cache invalidation failing silently',
  'Background job queue backpressure',
  'WebSocket connections dropping intermittently',
  'Log aggregation pipeline delayed by 15min',
  'Feature flag evaluation timeout',
] as const

export const ASSIGNEES = ['Alex Chen', 'Sarah Kim', 'Jordan Lee', 'Marcus Rivera', 'Priya Patel', 'Tom Wilson'] as const
