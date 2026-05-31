import { PageWrapper } from '../../components/layout/PageWrapper'
import { MetricCard } from './MetricCard'
import { BuildsPanel } from './BuildsPanel'
import { IncidentsPanel } from './IncidentsPanel'
import { AISummariesPanel } from './AISummariesPanel'
import { ReposPanel } from './ReposPanel'
import { SystemHealth } from './SystemHealth'
import { BuildFrequencyChart } from './BuildFrequencyChart'
import { useBuildStore } from '../../store/buildStore'
import { useIncidentStore } from '../../store/incidentStore'

export function DashboardPage() {
  const { builds, loading: buildsLoading } = useBuildStore()
  const { incidents } = useIncidentStore()

  const totalBuilds = builds.length
  const passedBuilds = builds.filter((b) => b.status === 'passed').length
  const failedBuilds = builds.filter((b) => b.status === 'failed').length
  const openIncidents = incidents.filter((i) => i.status !== 'resolved').length

  return (
    <PageWrapper title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Builds"
            value={totalBuilds}
            icon="▶"
            trend={{ value: `${Math.round((passedBuilds / (totalBuilds || 1)) * 100)}% pass rate`, positive: true }}
            loading={buildsLoading}
          />
          <MetricCard
            label="Passed"
            value={passedBuilds}
            icon="✓"
            trend={{ value: `${passedBuilds} this period`, positive: true }}
            loading={buildsLoading}
          />
          <MetricCard
            label="Failed"
            value={failedBuilds}
            icon="✕"
            trend={{ value: `${failedBuilds} this period`, positive: false }}
            loading={buildsLoading}
          />
          <MetricCard
            label="Open Incidents"
            value={openIncidents}
            icon="⚠"
            trend={{ value: `${openIncidents > 0 ? 'Needs attention' : 'All clear'}`, positive: openIncidents === 0 }}
            loading={buildsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuildFrequencyChart />
          <SystemHealth />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuildsPanel />
          <IncidentsPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AISummariesPanel />
          <ReposPanel />
        </div>
      </div>
    </PageWrapper>
  )
}
