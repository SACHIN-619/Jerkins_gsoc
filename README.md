# Jenkins Plugin Modernizer Stats

> A public, static visualization site tracking the modernization status of Jenkins plugins.
> Built for **Google Summer of Code 2026** — Jenkins organization.

[![Build and Deploy](https://github.com/SACHIN-619/jenkins-plugin-modernizer-stats/actions/workflows/deploy.yml/badge.svg)](https://github.com/SACHIN-619/jenkins-plugin-modernizer-stats/actions/workflows/deploy.yml)

**Live site:** https://SACHIN-619.github.io/jenkins-plugin-modernizer-stats/

---

## What this does

The [Jenkins Plugin Modernizer tool](https://github.com/jenkins-infra/plugin-modernizer-tool) scans Jenkins plugins and produces a machine-readable dataset tracking modernization progress. This site makes that data human-readable through:

- **Ecosystem Dashboard** — KPI cards, score distribution chart, ecosystem health donut chart, top/bottom plugin tables
- **Per-Plugin Report Pages** — modernization score, applied recipes, pending recommendations, open issues, GitHub links
- **Search & Filter** — fuzzy search (Fuse.js), score range filter, sort controls
- **Automatic daily refresh** — GitHub Actions fetches the latest dataset every day at 06:00 UTC

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | TailwindCSS 3 |
| Charts | Recharts |
| Search | Fuse.js |
| Data pipeline | Node.js + GitHub API (Octokit) |
| CI/CD | GitHub Actions → GitHub Pages |

## Local development

```bash
# 1. Clone
git clone https://github.com/SACHIN-619/jenkins-plugin-modernizer-stats.git
cd jenkins-plugin-modernizer-stats

# 2. Install dependencies
npm install

# 3. Fetch the latest plugin dataset (requires internet access)
npm run fetch-data
# Optional: set GITHUB_TOKEN for higher API rate limits
# GITHUB_TOKEN=ghp_xxx npm run fetch-data

# 4. Start dev server
npm run dev
# → http://localhost:5173/jenkins-plugin-modernizer-stats/
```

## Build for production

```bash
npm run build
# Output → dist/
```

The build script runs `fetch-data` first, then Vite build. If the data fetch fails, the build uses the last cached dataset (or bundled fallback sample data for first-time builds).

## Data pipeline

```
GitHub Actions (daily cron / PR merge)
    │
    ▼
scripts/fetch-data.js
    │  fetches dataset JSON from plugin-modernizer-tool repo
    │  normalizes schema
    │  writes data/plugins.json + data/meta.json
    ▼
vite build
    │  copies data/*.json to dist/
    │  bundles React app
    ▼
GitHub Pages deployment
```

### Error handling

The fetch script has three-level fallback:

1. **Live fetch succeeds** → fresh data written to `data/plugins.json`
2. **Live fetch fails + cache exists** → warns loudly, build continues with stale data
3. **Live fetch fails + no cache** → uses bundled sample data, warns loudly in console

## Project structure

```
jenkins-plugin-modernizer-stats/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: fetch → build → deploy
├── scripts/
│   └── fetch-data.js           # Build-time data pipeline
├── src/
│   ├── components/
│   │   ├── EcosystemCharts.jsx # Recharts dashboard charts
│   │   ├── FilterPanel.jsx     # Search + filter + sort
│   │   ├── MetricCard.jsx      # KPI stat card
│   │   ├── Navbar.jsx          # Top nav with dark mode toggle
│   │   ├── PluginCard.jsx      # Plugin list item
│   │   ├── ScoreBar.jsx        # Accessible progress bar
│   │   └── StatusComponents.jsx# Error, Loading, Empty states
│   ├── hooks/
│   │   ├── usePlugins.js       # Data loading hook
│   │   └── useSearch.js        # Fuzzy search + filter hook
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard page
│   │   └── PluginDetail.jsx    # Per-plugin report page
│   ├── App.jsx                 # Root component + routing
│   ├── index.css               # Tailwind directives
│   └── main.jsx                # React entry point
├── data/                       # Generated at build time (gitignored)
│   ├── plugins.json
│   └── meta.json
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Accessibility

- WCAG 2.1 AA target
- All interactive elements are keyboard-navigable
- Charts have `aria-hidden` with text alternatives (`sr-only`)
- `role="progressbar"` with `aria-valuenow/min/max` on score bars
- `aria-live` regions on search results count and loading state
- Skip-to-main-content link

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via the GitHub Actions workflow.

To deploy manually:
```bash
npm run build
# Then deploy the dist/ folder to any static host
```

## Contributing

This project is part of a GSoC 2026 proposal for the Jenkins organization. Contributions, issues, and suggestions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add X'`)
4. Push and open a PR

## License

Apache 2.0 — same as the Jenkins project.
