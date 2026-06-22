import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const { darkMode, toggleDarkMode, setSidebarOpen, user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
  }

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
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#534AB7]/20 flex items-center justify-center text-[#534AB7] text-xs font-semibold">
                {user.name.charAt(0)}
              </div>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-slide-in">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="px-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
