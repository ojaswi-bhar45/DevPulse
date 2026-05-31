import { Badge } from '../../components/ui/Badge'
import { SparkBar } from './SparkBar'
import type { Repo } from '../../types'

interface RepoCardProps {
  repo: Repo
}

export function RepoCard({ repo }: RepoCardProps) {
  const passedCount = repo.buildHistory.filter((s) => s === 'passed').length
  const totalCount = repo.buildHistory.length
  const successRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {repo.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {repo.branches} branches
          </p>
        </div>
        <Badge variant="purple">{repo.language}</Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparkBar history={repo.buildHistory} />
          <span className={`text-xs font-medium ${successRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {successRate}%
          </span>
        </div>
      </div>
    </div>
  )
}
