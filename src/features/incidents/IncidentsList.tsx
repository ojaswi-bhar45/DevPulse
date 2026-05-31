import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SLABar } from './SLABar'
import { SEVERITY_COLORS } from '../../lib/constants'
import { timeAgo } from '../../lib/formatters'
import { useIncidentStore } from '../../store/incidentStore'

export function IncidentsList() {
  const { incidents, severityFilter, resolveIncident } = useIncidentStore()

  const filtered = severityFilter === 'all'
    ? incidents
    : incidents.filter((i) => i.severity === severityFilter)

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No incidents match the current filter</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((inc) => (
        <div
          key={inc.id}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Badge className={SEVERITY_COLORS[inc.severity]}>{inc.severity}</Badge>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {inc.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <Badge className={inc.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : inc.status === 'investigating' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}>
                {inc.status}
              </Badge>
              {inc.status !== 'resolved' && (
                <Button variant="ghost" size="sm" onClick={() => resolveIncident(inc.id)}>
                  ✓
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>Assignee: {inc.assignee}</span>
            <span>{timeAgo(inc.createdAt)}</span>
          </div>

          <SLABar elapsed={inc.elapsedMinutes} total={inc.slaMinutes} />

          {inc.aiSuggestion && (
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg">
              <p className="text-xs font-medium text-[#534AB7] dark:text-[#7C73D4] mb-0.5">AI Suggestion</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{inc.aiSuggestion}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
