/**
 * EcosystemCharts.jsx
 * Score distribution bar chart and health donut chart using Recharts.
 * Both charts are fully keyboard-navigable and have accessible descriptions.
 */
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { useMemo } from 'react'

const SCORE_BUCKETS = [
  { label: '0–24',  min: 0,  max: 24,  color: '#ef4444' },
  { label: '25–49', min: 25, max: 49,  color: '#f97316' },
  { label: '50–74', min: 50, max: 74,  color: '#eab308' },
  { label: '75–100',min: 75, max: 100, color: '#22c55e' },
]

const PIE_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-100">{label}</p>
      <p className="text-gray-600 dark:text-gray-300">{payload[0].value} plugins</p>
    </div>
  )
}

export default function EcosystemCharts({ plugins }) {
  const barData = useMemo(() =>
    SCORE_BUCKETS.map(b => ({
      ...b,
      count: plugins.filter(p => p.score >= b.min && p.score <= b.max).length,
    }))
  , [plugins])

  const pieData = useMemo(() => [
    { name: 'Healthy (75–100)',   value: plugins.filter(p => p.score >= 75).length },
    { name: 'Moderate (50–74)',   value: plugins.filter(p => p.score >= 50 && p.score < 75).length },
    { name: 'Needs Work (25–49)', value: plugins.filter(p => p.score >= 25 && p.score < 50).length },
    { name: 'Critical (0–24)',    value: plugins.filter(p => p.score < 25).length },
  ].filter(d => d.value > 0), [plugins])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar chart */}
      <section
        aria-labelledby="dist-chart-title"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
      >
        <h2 id="dist-chart-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Score Distribution
        </h2>
        <p className="sr-only">
          Bar chart showing how many plugins fall in each score range.
          {barData.map(b => `${b.label}: ${b.count} plugins.`).join(' ')}
        </p>
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Pie chart */}
      <section
        aria-labelledby="health-chart-title"
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
      >
        <h2 id="health-chart-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Ecosystem Health
        </h2>
        <p className="sr-only">
          Donut chart showing ecosystem health breakdown.
          {pieData.map(d => `${d.name}: ${d.value} plugins.`).join(' ')}
        </p>
        <div aria-hidden="true">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip formatter={(v) => [`${v} plugins`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
