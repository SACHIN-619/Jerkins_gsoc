/**
 * useSearch.js
 * Fuzzy search + filter hook using Fuse.js.
 * Returns filtered plugin list based on query and active filters.
 */

import { useState, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'

const FUSE_OPTIONS = {
  keys: ['name', 'displayName', 'labels'],
  threshold: 0.35,
  includeScore: true,
}

export function useSearch(plugins) {
  const [query, setQuery] = useState('')
  const [minScore, setMinScore] = useState(0)
  const [maxScore, setMaxScore] = useState(100)
  const [sortBy, setSortBy] = useState('score-desc') // score-desc | score-asc | name | issues

  const fuse = useMemo(() => new Fuse(plugins, FUSE_OPTIONS), [plugins])

  const results = useMemo(() => {
    let list = plugins

    // Apply fuzzy search if query is non-empty
    if (query.trim().length > 0) {
      list = fuse.search(query.trim()).map(r => r.item)
    }

    // Apply score filter
    list = list.filter(p => p.score >= minScore && p.score <= maxScore)

    // Apply sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'score-desc': return b.score - a.score
        case 'score-asc': return a.score - b.score
        case 'name': return a.displayName.localeCompare(b.displayName)
        case 'issues': return b.openIssues - a.openIssues
        default: return 0
      }
    })

    return list
  }, [plugins, fuse, query, minScore, maxScore, sortBy])

  const clearFilters = useCallback(() => {
    setQuery('')
    setMinScore(0)
    setMaxScore(100)
    setSortBy('score-desc')
  }, [])

  return {
    query, setQuery,
    minScore, setMinScore,
    maxScore, setMaxScore,
    sortBy, setSortBy,
    results,
    clearFilters,
    hasActiveFilters: query !== '' || minScore !== 0 || maxScore !== 100 || sortBy !== 'score-desc',
  }
}
