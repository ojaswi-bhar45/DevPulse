import type { ReactNode } from 'react'
import { Skeleton } from '../../components/ui/Skeleton'

interface MetricCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  loading?: boolean
}

export function MetricCard({ label, value, icon, trend, loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <Skeleton variant="text" className="w-24 mb-3" />
        <Skeleton variant="text" className="w-16 h-8 mb-2" />
        <Skeleton variant="text" className="w-20" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {value}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <span>{trend.positive ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  )
}
