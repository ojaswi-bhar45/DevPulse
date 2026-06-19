import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'purple'
}

const variantMap: Record<string, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
}

export function Badge({ children, className = '', variant = 'info' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-[0.5px] ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
