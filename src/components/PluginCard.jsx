/**
 * PluginCard.jsx
 * Card in the plugin list — shows name, score bar, pending count, and open issues.
 */
import ScoreBar from './ScoreBar.jsx'

export default function PluginCard({ plugin, onClick }) {
  const scoreLabel =
    plugin.score >= 75 ? 'Healthy' :
    plugin.score >= 50 ? 'Moderate' :
    plugin.score >= 25 ? 'Needs Work' :
                         'Critical'

  const scoreColor =
    plugin.score >= 75 ? 'text-green-600 dark:text-green-400' :
    plugin.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
    plugin.score >= 25 ? 'text-orange-600 dark:text-orange-400' :
                         'text-red-600 dark:text-red-400'

  return (
    <article
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-150 cursor-pointer group"
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${plugin.displayName}, modernization score ${plugin.score}%`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {plugin.displayName}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">{plugin.id}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0 ${scoreColor}`}>
          {scoreLabel}
        </span>
      </div>

      <ScoreBar score={plugin.score} size="md" />

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span title="Pending recommendations">
          📋 {plugin.pendingRecommendations.length} pending
        </span>
        <span title="Applied recipes">
          ✅ {plugin.appliedRecipes.length} applied
        </span>
        {plugin.openIssues > 0 && (
          <span title="Open GitHub issues" className="text-orange-500">
            🐛 {plugin.openIssues} issues
          </span>
        )}
      </div>
    </article>
  )
}
