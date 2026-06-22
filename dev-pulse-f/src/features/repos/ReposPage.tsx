import { useEffect, useRef } from 'react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { RepoCard } from './RepoCard'
import { ConnectRepoModal } from './ConnectRepoModal'
import { useRepoStore } from '../../store/repoStore'
import { useAuthStore } from '../../store/authStore'

function useInit(fn: () => void) {
  const ran = useRef(false)
  useEffect(() => {
    if (!ran.current) {
      fn()
      ran.current = true
    }
  }, [fn])
}

export function ReposPage() {
  const { repos, loading, error, githubConnected, githubUsername, syncing, fetchRepos, fetchGitHubStatus, syncRepos } = useRepoStore()

  useInit(() => {
    fetchGitHubStatus().then(() => fetchRepos())
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('github') === 'connected') {
      window.history.replaceState({}, '', '/repos')
      syncRepos()
    }
  }, [syncRepos])

  return (
    <PageWrapper title="Repositories">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {repos.length} repositor{repos.length !== 1 ? 'ies' : 'y'}
              </p>
              {syncing && (
                <span className="text-xs text-[#534AB7] animate-pulse">Syncing...</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {githubConnected ? (
                <>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    GitHub: @{githubUsername}
                  </span>
                  <Button variant="secondary" size="sm" onClick={syncRepos} disabled={syncing}>
                    Sync
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const token = useAuthStore.getState().accessToken
                    window.location.href = `/api/auth/github/login?token=${token || ''}`
                  }}
                >
                  + Connect GitHub
                </Button>
              )}
            </div>
          </div>
        </Card>

        {!githubConnected && !loading && (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Connect your GitHub account to import repositories and see build data
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  const token = useAuthStore.getState().accessToken
                  window.location.href = `/api/auth/github/login?token=${token || ''}`
                }}
              >
                + Connect GitHub
              </Button>
            </div>
          </Card>
        )}

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
              <Button variant="primary" onClick={() => fetchRepos()}>Retry</Button>
            </div>
          </Card>
        ) : repos.length === 0 && githubConnected ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No repositories yet</p>
              <Button variant="primary" onClick={syncRepos} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync from GitHub'}
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

        <ConnectRepoModal open={false} onClose={() => {}} />
      </div>
    </PageWrapper>
  )
}
