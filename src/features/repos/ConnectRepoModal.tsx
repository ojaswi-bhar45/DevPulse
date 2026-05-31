import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { useRepoStore } from '../../store/repoStore'

const schema = z.object({
  name: z.string().min(1, 'Repo name is required').regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, underscores'),
  url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
  token: z.string().min(4, 'Token must be at least 4 characters'),
  language: z.string().min(1, 'Language is required'),
})

type FormData = z.infer<typeof schema>

interface ConnectRepoModalProps {
  open: boolean
  onClose: () => void
}

export function ConnectRepoModal({ open, onClose }: ConnectRepoModalProps) {
  const { connectRepo, error: storeError } = useRepoStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', url: '', token: '', language: 'TypeScript' },
  })

  const onSubmit = (data: FormData) => {
    connectRepo(data.name, data.language)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Connect Repository">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Repository Name
          </label>
          <input
            {...register('name')}
            placeholder="my-awesome-repo"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7]"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Repository URL
          </label>
          <input
            {...register('url')}
            placeholder="https://github.com/org/repo"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7]"
          />
          {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Access Token
          </label>
          <input
            {...register('token')}
            type="password"
            placeholder="ghp_..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7]"
          />
          {errors.token && <p className="text-xs text-red-500 mt-1">{errors.token.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select
            {...register('language')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#534AB7]"
          >
            <option>TypeScript</option>
            <option>Python</option>
            <option>Go</option>
            <option>Rust</option>
            <option>Kotlin</option>
            <option>Swift</option>
          </select>
          {errors.language && <p className="text-xs text-red-500 mt-1">{errors.language.message}</p>}
        </div>

        {storeError && (
          <p className="text-xs text-red-500">{storeError}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Connect
          </Button>
        </div>
      </form>
    </Modal>
  )
}
