import { useEffect, useState } from 'react'
import { formatSLA, getSLAColor } from '../../lib/formatters'

interface SLABarProps {
  elapsed: number
  total: number
}

export function SLABar({ elapsed, total }: SLABarProps) {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    setPercent(formatSLA(elapsed, total))
  }, [elapsed, total])

  const isOverdue = percent >= 100

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getSLAColor(percent)} ${isOverdue ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums shrink-0 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {isOverdue ? 'OVERDUE' : `${elapsed}m / ${total}m`}
      </span>
    </div>
  )
}
