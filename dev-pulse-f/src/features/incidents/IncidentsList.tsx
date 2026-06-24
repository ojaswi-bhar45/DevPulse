import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SLABar } from './SLABar'
import { SEVERITY_COLORS } from '../../lib/constants'
import { timeAgo } from '../../lib/formatters'
import { useIncidentStore } from '../../store/incidentStore'
import type { Incident } from '../../types'

export function IncidentsList() {
  const { incidents, severityFilter, updateIncident } = useIncidentStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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

  const handleStatusChange = async (id: string, status: Incident['status']) => {
    setUpdatingId(id)
    try {
      await updateIncident(id, { status })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {filtered.map((inc) => {
        const slaPercent = (inc.elapsedMinutes / inc.slaMinutes) * 100
        const slaWarning = slaPercent >= 80 && inc.status !== 'resolved'
        const isExpanded = expandedId === inc.id

        return (
          <div
            key={inc.id}
            className={`bg-white dark:bg-gray-900 rounded-xl border ${
              slaWarning ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
            } p-5`}
          >
            {slaWarning && (
              <div className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg">
                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                  ⚠ SLA at {Math.round(slaPercent)}% — {inc.elapsedMinutes}m of {inc.slaMinutes}m elapsed
                </p>
              </div>
            )}

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
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
              {inc.assignee && <span>Assignee: {inc.assignee}</span>}
              <span>{timeAgo(inc.createdAt)}</span>
              {inc.timeline && <span>{inc.timeline.length} event(s)</span>}
            </div>

            <SLABar elapsed={inc.elapsedMinutes} total={inc.slaMinutes} />

            <div className="flex items-center gap-2 mt-3">
              {inc.status !== 'resolved' && (
                <>
                  <Button
                    variant="ghost" size="sm"
                    loading={updatingId === inc.id}
                    onClick={() => handleStatusChange(inc.id, 'investigating')}
                    disabled={inc.status === 'investigating'}
                  >
                    Investigate
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    loading={updatingId === inc.id}
                    onClick={() => handleStatusChange(inc.id, 'resolved')}
                  >
                    ✓ Resolve
                  </Button>
                </>
              )}
              {inc.timeline && inc.timeline.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setExpandedId(isExpanded ? null : inc.id)}>
                  {isExpanded ? '▲ Timeline' : '▼ Timeline'}
                </Button>
              )}
            </div>

            {isExpanded && inc.timeline && (
              <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                {inc.timeline.map((entry) => (
                  <div key={entry.id} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{entry.user}</span>
                    {' '}{entry.details}
                    <span className="ml-2 text-gray-400">{timeAgo(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}

            {inc.aiSuggestion && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-lg">
                <p className="text-xs font-medium text-[#534AB7] dark:text-[#7C73D4] mb-0.5">AI Suggestion</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{inc.aiSuggestion}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
