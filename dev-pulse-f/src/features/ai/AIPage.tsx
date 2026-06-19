import { useEffect, useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { AICard } from './AICard'
import { generateMockSummaries } from '../../api/mock'
import type { AISummary } from '../../types'

type FilterType = 'all' | AISummary['type']

export function AIPage() {
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSummaries(generateMockSummaries(6))
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = filter === 'all' ? summaries : summaries.filter((s) => s.type === filter)

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
        ) : filtered.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">No summaries match the current filter</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((summary) => (
              <AICard key={summary.id} summary={summary} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
