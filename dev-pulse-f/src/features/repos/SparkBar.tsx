interface SparkBarProps {
  history: ('passed' | 'failed')[]
}

export function SparkBar({ history }: SparkBarProps) {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {history.map((status, i) => (
        <div
          key={i}
          className={`w-[6px] rounded-sm ${status === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}
          style={{
            height: status === 'passed' ? '100%' : `${40 + Math.random() * 60}%`,
          }}
          title={status === 'passed' ? 'Passed' : 'Failed'}
        />
      ))}
    </div>
  )
}
