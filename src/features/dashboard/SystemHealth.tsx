import { Card } from '../../components/ui/Card'
import { useBuildStore } from '../../store/buildStore'
import { useIncidentStore } from '../../store/incidentStore'

export function SystemHealth() {
  const { builds } = useBuildStore()
  const { incidents } = useIncidentStore()

  const totalBuilds = builds.length
  const passedBuilds = builds.filter((b) => b.status === 'passed').length
  const successRate = totalBuilds > 0 ? Math.round((passedBuilds / totalBuilds) * 100) : 0
  const openIncidents = incidents.filter((i) => i.status !== 'resolved').length
  const runningBuilds = builds.filter((b) => b.status === 'running').length
  const uptime = 99.7

  return (
    <Card title="System Health">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Uptime</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{uptime}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Success Rate</p>
          <p className={`text-lg font-bold ${successRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {successRate}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Active Builds</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{runningBuilds}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open Incidents</p>
          <p className={`text-lg font-bold ${openIncidents > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {openIncidents}
          </p>
        </div>
      </div>
    </Card>
  )
}
