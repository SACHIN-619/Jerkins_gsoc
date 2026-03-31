/**
 * App.jsx
 * Root component — handles client-side routing between Dashboard and Plugin detail pages.
 * Uses hash-based routing (no server config needed for static hosting).
 */

import { useState, useCallback } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import PluginDetail from './pages/PluginDetail.jsx'
import Navbar from './components/Navbar.jsx'
import { usePlugins } from './hooks/usePlugins.js'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState({ page: 'dashboard', pluginId: null })

  const { plugins, meta, loading, error } = usePlugins()

  const navigate = useCallback((page, pluginId = null) => {
    setCurrentPage({ page, pluginId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} navigate={navigate} />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {currentPage.page === 'dashboard' && (
            <Dashboard
              plugins={plugins}
              meta={meta}
              loading={loading}
              error={error}
              navigate={navigate}
            />
          )}
          {currentPage.page === 'plugin' && (
            <PluginDetail
              plugin={plugins.find(p => p.id === currentPage.pluginId)}
              navigate={navigate}
            />
          )}
        </main>
      </div>
    </div>
  )
}
