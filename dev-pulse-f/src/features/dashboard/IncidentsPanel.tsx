import { useEffect, useRef } from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useIncidentStore } from '../../store/incidentStore'
import { SEVERITY_COLORS } from '../../lib/constants'
import { timeAgo } from '../../lib/formatters'
import { SLABar } from '../incidents/SLABar'

export function IncidentsPanel() {
  const { incidents, loading, error, fetchIncidents, tickElapsed } = useIncidentStore()
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      fetchIncidents()
      ran.current = true
    }
  }, [fetchIncidents])

  useEffect(() => {
    const interval = setInterval(() => tickElapsed(), 60000)
    return () => clearInterval(interval)
  }, [tickElapsed])

  if (loading) {
    return (
      <Card title="Active Incidents">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-14" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Active Incidents">
        <div className="text-center py-6">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button
            onClick={fetchIncidents}
            className="text-sm text-[#534AB7] hover:underline font-medium"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  const active = incidents.filter((i) => i.status !== 'resolved').slice(0, 5)

  if (active.length === 0) {
    return (
      <Card title="Active Incidents">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No active incidents</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Active Incidents">
      <div className="space-y-3">
        {active.map((inc) => (
          <div key={inc.id} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <Badge className={SEVERITY_COLORS[inc.severity]}>{inc.severity}</Badge>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {inc.title}
                </span>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {timeAgo(inc.createdAt)}
              </span>
            </div>
            <SLABar elapsed={inc.elapsedMinutes} total={inc.slaMinutes} />
          </div>
        ))}
      </div>
    </Card>
  )
}
