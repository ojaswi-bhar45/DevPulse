import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { NAV_ITEMS } from '../../lib/constants'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAuthStore()
  const { user } = useAuthStore()

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 rounded-lg bg-[#534AB7] flex items-center justify-center text-white text-sm font-bold">
              DP
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              DevPulse
            </span>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#534AB7]/10 text-[#534AB7] dark:bg-[#534AB7]/20 dark:text-[#7C73D4] border-l-[3px] border-[#534AB7]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 border-l-[3px] border-transparent'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {user && (
            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#534AB7]/20 flex items-center justify-center text-[#534AB7] text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.org}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
