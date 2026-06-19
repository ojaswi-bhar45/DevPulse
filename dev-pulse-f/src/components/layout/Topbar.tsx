import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const { darkMode, toggleDarkMode, setSidebarOpen } = useAuthStore()
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#534AB7]/20 flex items-center justify-center text-[#534AB7] text-xs font-semibold">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
