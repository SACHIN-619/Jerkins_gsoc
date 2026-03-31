/**
 * usePlugins.js
 * Custom hook — loads and validates plugin data from the build-time generated JSON.
 * Provides loading, error, and data states to consumers.
 */

import { useState, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

export function usePlugins() {
  const [plugins, setPlugins] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [pluginRes, metaRes] = await Promise.allSettled([
          fetch(`${BASE}plugins.json`),
          fetch(`${BASE}meta.json`),
        ])

        if (pluginRes.status === 'rejected') {
          throw new Error(`Failed to load plugin data: ${pluginRes.reason}`)
        }
        if (!pluginRes.value.ok) {
          throw new Error(`HTTP ${pluginRes.value.status} loading plugins.json`)
        }

        const data = await pluginRes.value.json()

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array of plugins')
        }

        if (!cancelled) {
          setPlugins(data)
          if (metaRes.status === 'fulfilled' && metaRes.value.ok) {
            setMeta(await metaRes.value.json())
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          console.error('[usePlugins] Error loading data:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { plugins, meta, loading, error }
}
