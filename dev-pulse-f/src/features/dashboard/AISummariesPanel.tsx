import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { generateMockSummaries } from '../../api/mock'
import { RISK_COLORS } from '../../lib/constants'
import { timeAgo } from '../../lib/formatters'
import { useEffect, useState } from 'react'
import type { AISummary } from '../../types'

export function AISummariesPanel() {
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSummaries(generateMockSummaries(3))
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card title="AI Summaries">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-20" />
          ))}
        </div>
      </Card>
    )
  }

  if (summaries.length === 0) {
    return (
      <Card title="AI Summaries">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No summaries yet</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="AI Summaries">
      <div className="space-y-3">
        {summaries.map((s) => (
          <div key={s.id} className="py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={s.type === 'pr' ? 'info' : 'warning'}>
                {s.type === 'pr' ? 'PR' : 'Incident'}
              </Badge>
              <Badge className={RISK_COLORS[s.riskLevel]}>
                {s.riskLevel}
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">
              {s.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {s.body}
            </p>
            <p className="text-xs text-gray-400 mt-1">{timeAgo(s.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
