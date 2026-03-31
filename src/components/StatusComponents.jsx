/**
 * ErrorBanner.jsx
 * Accessible error state component shown when data fails to load.
 */
export function ErrorBanner({ message }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-3xl mx-auto mt-16 px-4"
    >
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center shadow">
        <div className="text-4xl mb-3" aria-hidden="true">⚠️</div>
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
          Failed to load plugin data
        </h2>
        <p className="text-red-600 dark:text-red-300 text-sm mb-4">{message}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This usually means the build-time data fetch failed. Check the{' '}
          <a
            href="https://github.com/SACHIN-619/jenkins-plugin-modernizer-stats/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-200"
          >
            GitHub Actions logs
          </a>{' '}
          for details.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

/**
 * LoadingSpinner.jsx
 * Accessible loading state with aria-live announcement.
 */
export function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading plugin data"
      className="flex flex-col items-center justify-center min-h-64 gap-4"
    >
      <div className="w-12 h-12 border-4 border-blue-200 border-t-jenkins-blue rounded-full animate-spin" aria-hidden="true" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading plugin data...</p>
    </div>
  )
}

/**
 * EmptyState.jsx
 * Shown when search/filter returns no results.
 */
export function EmptyState({ onClear }) {
  return (
    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
      <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
      <p className="text-lg font-medium mb-2">No plugins match your filters</p>
      <p className="text-sm mb-4">Try adjusting your search query or score range.</p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Clear all filters
      </button>
    </div>
  )
}
