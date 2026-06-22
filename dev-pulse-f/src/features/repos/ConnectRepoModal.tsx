import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { useRepoStore } from '../../store/repoStore'
import { useAuthStore } from '../../store/authStore'

interface ConnectRepoModalProps {
  open: boolean
  onClose: () => void
}

export function ConnectRepoModal({ open, onClose }: ConnectRepoModalProps) {
  const { githubConnected, githubUsername, syncRepos, syncing } = useRepoStore()

  return (
    <Modal open={open} onClose={onClose} title="Connect Repository">
      <div className="space-y-4">
        {githubConnected ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connected as <strong>@{githubUsername}</strong>. Your repositories are synced from GitHub.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={syncRepos} loading={syncing}>
                Sync Now
              </Button>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your GitHub account to automatically import your repositories and workflow data.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const token = useAuthStore.getState().accessToken
                  window.location.href = `/api/auth/github/login?token=${token || ''}`
                }}
              >
                Connect GitHub
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
