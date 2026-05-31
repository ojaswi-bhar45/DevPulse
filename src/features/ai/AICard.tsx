import { Badge } from '../../components/ui/Badge'
import { RISK_COLORS } from '../../lib/constants'
import { timeAgo } from '../../lib/formatters'
import type { AISummary } from '../../types'

interface AICardProps {
  summary: AISummary
}

export function AICard({ summary }: AICardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={summary.type === 'pr' ? 'info' : 'warning'}>
            {summary.type === 'pr' ? 'PR Review' : 'Incident Analysis'}
          </Badge>
          <Badge className={RISK_COLORS[summary.riskLevel]}>
            {summary.riskLevel} risk
          </Badge>
        </div>
        <span className="text-xs text-gray-400 shrink-0 ml-2">
          {timeAgo(summary.createdAt)}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {summary.title}
      </h3>

      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {summary.body}
      </p>
    </div>
  )
}
