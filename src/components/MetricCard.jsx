/**
 * MetricCard.jsx
 * Summary stat card used in the dashboard KPI banner.
 */
export default function MetricCard({ label, value, sub, color = 'blue', icon }) {
  const colors = {
    blue:   'bg-blue-50   dark:bg-blue-900/20  border-blue-200  dark:border-blue-700  text-blue-700  dark:text-blue-300',
    green:  'bg-green-50  dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300',
    red:    'bg-red-50    dark:bg-red-900/20   border-red-200   dark:border-red-700   text-red-700   dark:text-red-300',
  }

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
        </div>
        {icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}
      </div>
    </div>
  )
}
