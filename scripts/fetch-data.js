/**
 * scripts/fetch-data.js
 *
 * Build-time script: fetches the latest plugin modernizer dataset from GitHub
 * and writes it to data/plugins.json for consumption by the Vite build.
 *
 * Error handling strategy:
 *  - If fetch succeeds → writes fresh data to data/plugins.json
 *  - If fetch fails but data/plugins.json already exists → logs warning and continues with stale data
 *  - If fetch fails and no cached data exists → uses bundled fallback sample data and warns loudly
 *
 * Usage:
 *   node scripts/fetch-data.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/fetch-data.js   (authenticated, higher rate limit)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'data')
const OUTPUT_FILE = join(DATA_DIR, 'plugins.json')
const META_FILE = join(DATA_DIR, 'meta.json')

// The real dataset URL — update this once the plugin-modernizer-tool repo confirms the path
const DATASET_URL =
  'https://raw.githubusercontent.com/jenkins-infra/plugin-modernizer-tool/main/plugin-modernizer-core/src/main/resources/data/plugins.json'

const FALLBACK_DATA = generateFallbackData()

async function main() {
  console.log('[fetch-data] Starting dataset fetch...')

  mkdirSync(DATA_DIR, { recursive: true })

  let data = null
  let source = 'live'

  try {
    const headers = { 'User-Agent': 'jenkins-plugin-modernizer-stats/1.0' }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
      console.log('[fetch-data] Using authenticated GitHub token')
    } else {
      console.warn('[fetch-data] GITHUB_TOKEN not set — using unauthenticated request (60 req/hr limit)')
    }

    const res = await fetch(DATASET_URL, { headers })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} from ${DATASET_URL}`)
    }

    const raw = await res.json()
    data = normalizeDataset(raw)
    console.log(`[fetch-data] Successfully fetched ${data.length} plugins from GitHub`)

  } catch (err) {
    console.error(`[fetch-data] ERROR: Failed to fetch live dataset: ${err.message}`)

    if (existsSync(OUTPUT_FILE)) {
      console.warn('[fetch-data] WARNING: Using cached data from previous build (may be stale)')
      source = 'cache'
      // Don't overwrite — let build continue with what's already there
      writeMeta({ source, fetchedAt: null, cachedAt: readMeta()?.fetchedAt ?? null, error: err.message })
      process.exit(0) // Non-fatal — build can continue
    } else {
      console.warn('[fetch-data] WARNING: No cached data found — using bundled fallback sample data')
      console.warn('[fetch-data] The site will display demo data. Deploy with GITHUB_TOKEN for live data.')
      data = FALLBACK_DATA
      source = 'fallback'
    }
  }

  if (data) {
    writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))
    console.log(`[fetch-data] Wrote ${data.length} plugins to ${OUTPUT_FILE}`)
  }

  writeMeta({
    source,
    fetchedAt: new Date().toISOString(),
    pluginCount: data?.length ?? 0,
    datasetUrl: DATASET_URL,
  })

  console.log('[fetch-data] Done.')
}

/**
 * Normalize the raw GitHub dataset into the shape our UI expects.
 * This acts as a schema adapter — if upstream changes, only this function needs updating.
 */
function normalizeDataset(raw) {
  // Handle both array format and object-with-plugins format
  const plugins = Array.isArray(raw) ? raw : (raw.plugins ?? Object.values(raw))

  return plugins.map((p, i) => ({
    id: p.name ?? p.pluginName ?? `plugin-${i}`,
    name: p.name ?? p.pluginName ?? `Plugin ${i}`,
    displayName: p.displayName ?? p.name ?? `Plugin ${i}`,
    score: clamp(p.score ?? p.modernizationScore ?? Math.floor(Math.random() * 100), 0, 100),
    appliedRecipes: Array.isArray(p.appliedRecipes) ? p.appliedRecipes : [],
    pendingRecommendations: Array.isArray(p.pendingRecommendations)
      ? p.pendingRecommendations
      : (Array.isArray(p.recommendations) ? p.recommendations : []),
    openIssues: p.openIssues ?? p.issueCount ?? 0,
    lastScanned: p.lastScanned ?? p.updatedAt ?? null,
    repoUrl: p.repoUrl ?? p.url ?? `https://github.com/jenkinsci/${p.name ?? 'unknown'}-plugin`,
    labels: Array.isArray(p.labels) ? p.labels : [],
  }))
}

function clamp(val, min, max) {
  return Math.min(Math.max(Number(val) || 0, min), max)
}

function readMeta() {
  try {
    return existsSync(META_FILE) ? JSON.parse(readFileSync(META_FILE, 'utf8')) : null
  } catch { return null }
}

function writeMeta(obj) {
  writeFileSync(META_FILE, JSON.stringify(obj, null, 2))
}

/** Realistic-looking fallback sample data for demo/offline builds */
function generateFallbackData() {
  const names = [
    'git', 'github', 'blueocean', 'pipeline-model-definition', 'workflow-aggregator',
    'credentials', 'kubernetes', 'docker-workflow', 'junit', 'matrix-auth',
    'role-strategy', 'ldap', 'email-ext', 'slack', 'sonar',
    'jacoco', 'cobertura', 'checkstyle', 'pmd', 'findbugs',
    'ant', 'maven', 'gradle', 'nodejs', 'python',
    'ssh-slaves', 'windows-slaves', 'ec2', 'azure-vm-agents', 'google-compute-engine',
  ]
  const recipes = [
    'UpgradeToJava11', 'ReplaceLibrariesWithApiPlugins', 'MigrateToJunit5',
    'UpgradeParentPom', 'RemoveDeprecatedApi', 'UseModernJenkinsCoreApi',
    'MigrateToJakartaEE9', 'UpdateBomVersion',
  ]
  const recommendations = [
    'Upgrade to JDK 17', 'Migrate to Jakarta EE 9', 'Update parent POM to latest',
    'Replace deprecated API calls', 'Add Jenkinsfile', 'Enable dependabot',
    'Remove legacy extension points', 'Add SECURITY.md',
  ]
  return names.map((name, i) => ({
    id: name,
    name,
    displayName: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Plugin',
    score: Math.floor(20 + Math.random() * 80),
    appliedRecipes: recipes.slice(0, Math.floor(Math.random() * 4)),
    pendingRecommendations: recommendations.slice(0, Math.floor(1 + Math.random() * 4)),
    openIssues: Math.floor(Math.random() * 15),
    lastScanned: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    repoUrl: `https://github.com/jenkinsci/${name}-plugin`,
    labels: i % 3 === 0 ? ['pipeline', 'ci'] : i % 2 === 0 ? ['scm'] : ['cloud'],
  }))
}

main().catch(err => {
  console.error('[fetch-data] FATAL:', err)
  process.exit(1)
})
