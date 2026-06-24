import { useEffect, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { AICard } from './AICard'
import { useAIStore } from '../../store/aiStore'
import type { AISummary } from '../../types'

type FilterType = 'all' | AISummary['type']

export function AIPage() {
  const { summaries, loading, error, filter, totalPages, currentPage, fetchSummaries, setFilter, setCurrentPage } = useAIStore()

  const ran = useRef(false)
  useEffect(() => {
    if (ran.current) return
    ran.current = true
    fetchSummaries()
  }, [])

  useEffect(() => {
    fetchSummaries()
  }, [filter, currentPage])

  const FILTER_TABS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'PR Reviews', value: 'pr' },
    { label: 'Incidents', value: 'incident' },
  ]

  return (
    <PageWrapper title="AI Summaries">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-[#534AB7] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rect" className="h-24" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
          </Card>
        ) : summaries.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">No summaries yet. Sync your repositories to generate AI reviews.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {summaries.map((summary) => (
              <AICard key={summary.id} summary={summary} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
