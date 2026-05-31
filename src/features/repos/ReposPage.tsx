import { useEffect, useRef, useState } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { RepoCard } from './RepoCard'
import { ConnectRepoModal } from './ConnectRepoModal'
import { useRepoStore } from '../../store/repoStore'

export function ReposPage() {
  const { repos, loading, error, fetchRepos } = useRepoStore()
  const [modalOpen, setModalOpen] = useState(false)
  const ran = useRef(false)

  useEffect(() => {
    if (!ran.current) {
      fetchRepos()
      ran.current = true
    }
  }, [fetchRepos])

  return (
    <PageWrapper title="Repositories">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {repos.length} repository{repos.length !== 1 ? 'ies' : 'y'} connected
            </p>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              + Connect Repo
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rect" className="h-28" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
              <Button variant="primary" onClick={fetchRepos}>Retry</Button>
            </div>
          </Card>
        ) : repos.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No repositories connected</p>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                + Connect Your First Repo
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        <ConnectRepoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </PageWrapper>
  )
}
