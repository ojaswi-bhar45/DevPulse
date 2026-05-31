import { Badge } from '../../components/ui/Badge'
import { STATUS_COLORS } from '../../lib/constants'
import { formatDate, formatDuration } from '../../lib/formatters'
import type { Build } from '../../types'

interface BuildsTableProps {
  builds: Build[]
}

export function BuildsTable({ builds }: BuildsTableProps) {
  if (builds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">No builds match the current filter</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Repo</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Branch</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Run</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Commit</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Duration</th>
            <th className="text-left py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Triggered</th>
          </tr>
        </thead>
        <tbody>
          {builds.map((build) => (
            <tr
              key={build.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">{build.repo}</td>
              <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{build.branch}</td>
              <td className="py-3 px-3 text-gray-600 dark:text-gray-400">#{build.runNumber}</td>
              <td className="py-3 px-3 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{build.commitMessage}</td>
              <td className="py-3 px-3">
                <Badge className={STATUS_COLORS[build.status]}>{build.status}</Badge>
              </td>
              <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{formatDuration(build.duration)}</td>
              <td className="py-3 px-3 text-gray-500 dark:text-gray-400 text-xs">{formatDate(build.triggeredAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
