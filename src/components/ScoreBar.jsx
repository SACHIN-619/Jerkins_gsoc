/**
 * ScoreBar.jsx
 * Accessible progress bar showing a plugin's modernization score.
 */
export default function ScoreBar({ score, showLabel = true, size = 'md' }) {
  const color =
    score >= 75 ? 'bg-green-500' :
    score >= 50 ? 'bg-yellow-500' :
    score >= 25 ? 'bg-orange-500' :
                  'bg-red-500'

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Modernization score: ${score}%`}
        className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}
      >
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">
          {score}%
        </span>
      )}
    </div>
  )
}
