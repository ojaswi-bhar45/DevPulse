import { useEffect, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { BuildsTable } from './BuildsTable'
import { useBuildStore } from '../../store/buildStore'
import type { Build } from '../../types'

const FILTER_TABS: { label: string; value: Build['status'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Passed', value: 'passed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Running', value: 'running' },
  { label: 'Skipped', value: 'skipped' },
]

export function BuildsPage() {
  const {
    builds, loading, error, fetchBuilds,
    filterStatus, setFilterStatus,
    currentPage, setCurrentPage, pageSize,
  } = useBuildStore()
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      fetchBuilds()
      ran.current = true
    }
  }, [fetchBuilds])

  const filtered = filterStatus === 'all'
    ? builds
    : builds.filter((b) => b.status === filterStatus)

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <PageWrapper title="Builds">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === tab.value
                    ? 'bg-[#534AB7] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({builds.filter((b) => tab.value === 'all' || b.status === tab.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {loading ? (
          <Card>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rect" className="h-10" />
              ))}
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
              <Button variant="primary" onClick={fetchBuilds}>Retry</Button>
            </div>
          </Card>
        ) : (
          <Card>
            <BuildsTable builds={paginated} />
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
