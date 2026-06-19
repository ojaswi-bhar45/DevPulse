import { useEffect, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { IncidentsList } from './IncidentsList'
import { useIncidentStore } from '../../store/incidentStore'
import type { Incident } from '../../types'

const SEVERITY_OPTIONS: { label: string; value: Incident['severity'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
]

export function IncidentsPage() {
  const {
    loading, error, fetchIncidents,
    severityFilter, setSeverityFilter,
    tickElapsed,
  } = useIncidentStore()
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

  return (
    <PageWrapper title="Incidents">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {SEVERITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSeverityFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  severityFilter === opt.value
                    ? 'bg-[#534AB7] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rect" className="h-24" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
              <Button variant="primary" onClick={fetchIncidents}>Retry</Button>
            </div>
          </Card>
        ) : (
          <IncidentsList />
        )}
      </div>
    </PageWrapper>
  )
}
