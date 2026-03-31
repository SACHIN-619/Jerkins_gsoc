/**
 * Navbar.jsx
 * Top navigation bar with Jenkins branding, dark mode toggle, and skip-to-content link.
 */

export default function Navbar({ darkMode, setDarkMode, navigate }) {
  return (
    <>
      {/* Accessibility: skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className="bg-jenkins-blue dark:bg-gray-900 shadow-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo + title */}
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 rounded"
            aria-label="Jenkins Plugin Modernizer Stats — go to dashboard"
          >
            {/* Jenkins logo mark (simplified SVG) */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="white" fillOpacity="0.15"/>
              <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm0 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S6 21.52 6 16 10.48 6 16 6z" fill="white"/>
              <circle cx="16" cy="16" r="5" fill="white" fillOpacity="0.8"/>
            </svg>
            <span className="hidden sm:inline">Plugin Modernizer Stats</span>
            <span className="sm:hidden">Plugin Stats</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/jenkins-infra/plugin-modernizer-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm opacity-80 hover:opacity-100 transition-opacity hidden md:inline"
              aria-label="View plugin-modernizer-tool on GitHub (opens in new tab)"
            >
              Source Dataset ↗
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
