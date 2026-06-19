import { useEffect, useRef } from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useRepoStore } from '../../store/repoStore'
import { SparkBar } from '../repos/SparkBar'

export function ReposPanel() {
  const { repos, loading, error, fetchRepos } = useRepoStore()
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      fetchRepos()
      ran.current = true
    }
  }, [fetchRepos])

  if (loading) {
    return (
      <Card title="Repositories">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-12" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Repositories">
        <div className="text-center py-6">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
          <button
            onClick={fetchRepos}
            className="text-sm text-[#534AB7] hover:underline font-medium"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  const subset = repos.slice(0, 4)

  if (subset.length === 0) {
    return (
      <Card title="Repositories">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No repos connected</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Repositories">
      <div className="space-y-1">
        {subset.map((repo) => (
          <div key={repo.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {repo.name}
              </span>
              <Badge variant="purple">{repo.language}</Badge>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SparkBar history={repo.buildHistory} />
              <span className="text-xs text-gray-400">{repo.branches} branches</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
