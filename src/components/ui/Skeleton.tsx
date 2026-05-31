interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rect' | 'circle'
  width?: string
  height?: string
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const base = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded'
  const variants: Record<string, string> = {
    text: 'h-4 w-full',
    rect: 'h-20 w-full',
    circle: 'h-10 w-10 rounded-full',
  }

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}
