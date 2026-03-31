/**
 * pages/Dashboard.jsx
 * Main dashboard: KPI banner, ecosystem charts, search/filter, plugin list.
 */
import { useMemo } from 'react'
import MetricCard from '../components/MetricCard.jsx'
import EcosystemCharts from '../components/EcosystemCharts.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import PluginCard from '../components/PluginCard.jsx'
import { ErrorBanner, LoadingSpinner, EmptyState } from '../components/StatusComponents.jsx'
import { useSearch } from '../hooks/useSearch.js'

export default function Dashboard({ plugins, meta, loading, error, navigate }) {
  const {
    query, setQuery,
    minScore, setMinScore,
    maxScore, setMaxScore,
    sortBy, setSortBy,
    results,
    clearFilters,
    hasActiveFilters,
  } = useSearch(plugins)

  const stats = useMemo(() => {
    if (!plugins.length) return null
    const avg = Math.round(plugins.reduce((s, p) => s + p.score, 0) / plugins.length)
    const healthy = plugins.filter(p => p.score >= 75).length
    const critical = plugins.filter(p => p.score < 25).length
    const totalIssues = plugins.reduce((s, p) => s + p.openIssues, 0)
    return { avg, healthy, critical, totalIssues }
  }, [plugins])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner message={error} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Jenkins Plugin Modernizer Stats
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          Tracking modernization progress across the Jenkins plugin ecosystem.
          {meta && (
            <span className="ml-2 text-xs text-gray-400">
              Last updated: {meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString() : 'unknown'}
              {meta.source !== 'live' && (
                <span className="ml-2 text-orange-500 font-medium">
                  ⚠ Using {meta.source} data
                </span>
              )}
            </span>
          )}
        </p>
      </header>

      {/* KPI banner */}
      {stats && (
        <section aria-label="Key metrics" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Total Plugins" value={plugins.length} icon="🔌" color="blue" />
          <MetricCard label="Avg Score" value={`${stats.avg}%`} icon="📊" color="blue"
            sub="ecosystem average" />
          <MetricCard label="Healthy" value={stats.healthy} icon="✅" color="green"
            sub="score ≥ 75%" />
          <MetricCard label="Need Attention" value={stats.critical} icon="🔴" color="red"
            sub="score < 25%" />
        </section>
      )}

      {/* Charts */}
      {plugins.length > 0 && (
        <div className="mb-8">
          <EcosystemCharts plugins={plugins} />
        </div>
      )}

      {/* Top / Bottom lists */}
      {plugins.length >= 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopTable
            title="🏆 Most Modernized"
            plugins={[...plugins].sort((a, b) => b.score - a.score).slice(0, 5)}
            navigate={navigate}
          />
          <TopTable
            title="⚠️ Needs Most Attention"
            plugins={[...plugins].sort((a, b) => a.score - b.score).slice(0, 5)}
            navigate={navigate}
          />
        </div>
      )}

      {/* Search + filter */}
      <div className="mb-6">
        <FilterPanel
          query={query} setQuery={setQuery}
          minScore={minScore} setMinScore={setMinScore}
          maxScore={maxScore} setMaxScore={setMaxScore}
          sortBy={sortBy} setSortBy={setSortBy}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          totalCount={plugins.length}
          filteredCount={results.length}
        />
      </div>

      {/* Plugin grid */}
      {results.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <section aria-label="Plugin list">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map(p => (
              <PluginCard
                key={p.id}
                plugin={p}
                onClick={() => navigate('plugin', p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function TopTable({ title, plugins, navigate }) {
  return (
    <section
      aria-labelledby={`table-${title}`}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
    >
      <h2 id={`table-${title}`} className="px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
        {title}
      </h2>
      <table className="w-full text-sm">
        <thead className="sr-only">
          <tr><th>Plugin</th><th>Score</th></tr>
        </thead>
        <tbody>
          {plugins.map((p, i) => (
            <tr
              key={p.id}
              onClick={() => navigate('plugin', p.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('plugin', p.id)}
              tabIndex={0}
              role="button"
              aria-label={`View ${p.displayName}, score ${p.score}%`}
              className="flex items-center px-5 py-2.5 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 transition-colors"
            >
              <span className="text-gray-400 font-mono text-xs w-5">{i + 1}</span>
              <span className="flex-1 truncate text-gray-800 dark:text-gray-200 font-medium">{p.displayName}</span>
              <span className={`font-bold text-sm ${p.score >= 75 ? 'text-green-600' : p.score >= 50 ? 'text-yellow-600' : p.score >= 25 ? 'text-orange-600' : 'text-red-600'}`}>
                {p.score}%
              </span>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
