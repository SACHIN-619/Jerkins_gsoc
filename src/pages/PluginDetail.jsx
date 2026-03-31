/**
 * pages/PluginDetail.jsx
 * Per-plugin report page: score, applied recipes, pending recommendations, GitHub link.
 */
import ScoreBar from '../components/ScoreBar.jsx'

export default function PluginDetail({ plugin, navigate }) {
  // Guard: plugin not found (stale link, wrong id, etc.)
  if (!plugin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">🔌</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Plugin not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          This plugin may have been removed from the modernizer dataset or the link may be outdated.
        </p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  const lastScanned = plugin.lastScanned
    ? new Date(plugin.lastScanned).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown'

  const scoreLabel =
    plugin.score >= 75 ? 'Healthy' :
    plugin.score >= 50 ? 'Moderate' :
    plugin.score >= 25 ? 'Needs Work' : 'Critical'

  const scoreColor =
    plugin.score >= 75 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' :
    plugin.score >= 50 ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30' :
    plugin.score >= 25 ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30' :
                         'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <button
          onClick={() => navigate('dashboard')}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* Plugin header */}
      <header className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {plugin.displayName}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-0.5">{plugin.id}</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border ${scoreColor}`}>
            {scoreLabel}
          </span>
        </div>

        {/* Score */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Modernization Score
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {plugin.score}%
            </span>
          </div>
          <ScoreBar score={plugin.score} showLabel={false} size="lg" />
        </div>

        {/* Meta */}
        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400 text-xs">Applied Recipes</dt>
            <dd className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{plugin.appliedRecipes.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400 text-xs">Pending</dt>
            <dd className="font-semibold text-orange-600 dark:text-orange-400 mt-0.5">{plugin.pendingRecommendations.length}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400 text-xs">Open Issues</dt>
            <dd className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{plugin.openIssues}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400 text-xs">Last Scanned</dt>
            <dd className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5 text-xs">{lastScanned}</dd>
          </div>
        </dl>
      </header>

      {/* Applied Recipes */}
      <section aria-labelledby="applied-title" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-6">
        <h2 id="applied-title" className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span aria-hidden="true">✅</span> Applied Recipes
          <span className="text-sm font-normal text-gray-400">({plugin.appliedRecipes.length})</span>
        </h2>
        {plugin.appliedRecipes.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No recipes have been applied yet.</p>
        ) : (
          <ul className="space-y-2" aria-label="Applied modernization recipes">
            {plugin.appliedRecipes.map((recipe, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" aria-hidden="true"/>
                {recipe}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending Recommendations */}
      <section aria-labelledby="pending-title" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-6">
        <h2 id="pending-title" className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span aria-hidden="true">📋</span> Pending Recommendations
          <span className="text-sm font-normal text-gray-400">({plugin.pendingRecommendations.length})</span>
        </h2>
        {plugin.pendingRecommendations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            🎉 All recommendations have been applied — this plugin is fully modernized!
          </p>
        ) : (
          <ul className="space-y-2" aria-label="Pending modernization recommendations">
            {plugin.pendingRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Labels */}
      {plugin.labels?.length > 0 && (
        <section aria-label="Plugin labels" className="mb-6">
          <div className="flex flex-wrap gap-2">
            {plugin.labels.map((label, i) => (
              <span key={i} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* External links */}
      <div className="flex flex-wrap gap-3">
        <a
          href={plugin.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={`View ${plugin.displayName} on GitHub (opens in new tab)`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
        <a
          href={`${plugin.repoUrl}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label={`View open issues for ${plugin.displayName} on GitHub (opens in new tab)`}
        >
          🐛 {plugin.openIssues} Open Issues
        </a>
      </div>
    </div>
  )
}
