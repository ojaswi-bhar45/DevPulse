export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function timeAgo(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`

  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 30) return `${diffDays}d ago`

  return formatDate(dateString)
}

export function formatDuration(duration: string): string {
  const parts = duration.split(':')
  if (parts.length === 3) {
    const [h, m, s] = parts.map(Number)
    if (h > 0) return `${h}m ${m}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }
  return duration
}

export function formatSLA(elapsed: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((elapsed / total) * 100), 100)
}

export function getSLAColor(percent: number): string {
  if (percent < 50) return 'bg-green-500'
  if (percent < 80) return 'bg-amber-500'
  return 'bg-red-500'
}
