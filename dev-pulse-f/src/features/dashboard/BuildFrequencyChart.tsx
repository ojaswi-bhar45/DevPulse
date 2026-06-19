import { useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { useBuildStore } from '../../store/buildStore'

export function BuildFrequencyChart() {
  const { builds, loading } = useBuildStore()
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      useBuildStore.getState().fetchBuilds()
      ran.current = true
    }
  }, [])

  if (loading) {
    return (
      <Card title="Build Frequency (Last 7 Days)">
        <Skeleton variant="rect" className="h-48" />
      </Card>
    )
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const counts: Record<string, { passed: number; failed: number }> = {}
  for (const day of last7) {
    counts[day] = { passed: 0, failed: 0 }
  }

  for (const build of builds) {
    const day = build.triggeredAt.split('T')[0]
    if (counts[day]) {
      if (build.status === 'passed') counts[day].passed++
      else if (build.status === 'failed') counts[day].failed++
    }
  }

  const data = last7.map((day) => ({
    date: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
    passed: counts[day].passed,
    failed: counts[day].failed,
  }))

  return (
    <Card title="Build Frequency (Last 7 Days)">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={8}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="passed" fill="#22c55e" radius={[3, 3, 0, 0]} name="Passed" />
            <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
