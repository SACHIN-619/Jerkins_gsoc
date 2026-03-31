/**
 * FilterPanel.jsx
 * Search bar, score range filter, and sort control.
 * All state is lifted to useSearch hook — this is purely presentational.
 */
export default function FilterPanel({
  query, setQuery,
  minScore, setMinScore,
  maxScore, setMaxScore,
  sortBy, setSortBy,
  hasActiveFilters, clearFilters,
  totalCount, filteredCount,
}) {
  return (
    <section aria-label="Search and filter plugins" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="plugin-search" className="sr-only">Search plugins by name</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              id="plugin-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search plugins..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="search-hint"
            />
          </div>
          <p id="search-hint" className="sr-only">Fuzzy search across plugin names and labels</p>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort-select" className="sr-only">Sort plugins</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score-desc">Score: High → Low</option>
            <option value="score-asc">Score: Low → High</option>
            <option value="name">Name A–Z</option>
            <option value="issues">Most Issues</option>
          </select>
        </div>
      </div>

      {/* Score range */}
      <div className="mt-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">Score range:</span>
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="min-score" className="sr-only">Minimum score</label>
          <input
            id="min-score"
            type="number"
            min={0} max={maxScore}
            value={minScore}
            onChange={e => setMinScore(Math.max(0, Math.min(Number(e.target.value), maxScore)))}
            className="w-16 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Minimum score (0–100)"
          />
          <span className="text-gray-400 text-sm">–</span>
          <label htmlFor="max-score" className="sr-only">Maximum score</label>
          <input
            id="max-score"
            type="number"
            min={minScore} max={100}
            value={maxScore}
            onChange={e => setMaxScore(Math.min(100, Math.max(Number(e.target.value), minScore)))}
            className="w-16 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Maximum score (0–100)"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <p aria-live="polite" aria-atomic="true" className="text-sm text-gray-500 dark:text-gray-400">
            {filteredCount === totalCount
              ? `${totalCount} plugins`
              : `${filteredCount} of ${totalCount} plugins`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Clear all search filters"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
