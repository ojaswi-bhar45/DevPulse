import { useEffect, useRef } from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useBuildStore } from '../../store/buildStore'
import { STATUS_COLORS } from '../../lib/constants'
import { formatDuration } from '../../lib/formatters'

export function BuildsPanel() {
  const { builds, loading, error, fetchBuilds } = useBuildStore()
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      fetchBuilds()
      ran.current = true
    }
  }, [fetchBuilds])

  if (loading) {
    return (
      <Card title="Recent Builds">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-12" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Recent Builds">
        <div className="text-center py-6">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button
            onClick={fetchBuilds}
            className="text-sm text-[#534AB7] hover:underline font-medium"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  const recent = builds.slice(0, 5)

  if (recent.length === 0) {
    return (
      <Card title="Recent Builds">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No builds yet</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Recent Builds">
      <div className="space-y-2">
        {recent.map((build) => (
          <div
            key={build.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {build.repo}
                </span>
                <span className="text-xs text-gray-400">#{build.runNumber}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {build.commitMessage}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge className={STATUS_COLORS[build.status]}>
                {build.status}
              </Badge>
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatDuration(build.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
