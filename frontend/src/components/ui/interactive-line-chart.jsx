// components/ui/interactive-line-chart.jsx
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

const RANGE_OPTIONS = [
  { label: '1Y', value: '1Y', years: 1 },
  { label: '3Y', value: '3Y', years: 3 },
  { label: '5Y', value: '5Y', years: 5 },
  { label: 'All', value: 'all', years: null },
]

export const InteractiveLineChart = ({
  data,
  xAxisKey,
  lineKey,
  gradientFrom = '#a78bfa',
  gradientTo = '#c084fc',
  height = 400,
  title = 'Net Asset Value Trend',
  valuePrefix = '',
}) => {
  const [activeRange, setActiveRange] = useState('5Y')

  const toDate = (value) => {
    if (!value) return null
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value
    if (typeof value === 'number') {
      const d = new Date(value)
      return isNaN(d.getTime()) ? null : d
    }

    const s = String(value).trim()
    if (!s) return null

    // ISO first
    if (/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(s)) {
      const d = new Date(s)
      return isNaN(d.getTime()) ? null : d
    }

    // dd-mm-yyyy / dd/mm/yyyy (common NAV format)
    const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
    if (m) {
      const day = Number(m[1])
      const month = Number(m[2])
      const year = Number(m[3])
      const d = new Date(year, month - 1, day)
      return isNaN(d.getTime()) ? null : d
    }

    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d
  }

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []

    const selectedRange = RANGE_OPTIONS.find((r) => r.value === activeRange)
    if (!selectedRange || selectedRange.value === 'all') {
      return data
    }

    const cutoffDate = new Date()
    cutoffDate.setFullYear(cutoffDate.getFullYear() - selectedRange.years)

    return data.filter((item) => {
      const d = toDate(item?.[xAxisKey])
      return d && d >= cutoffDate
    })
  }, [data, activeRange, xAxisKey])

  const formatDate = (value) => {
    const date = toDate(value)
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getRangeButtonClass = (rangeValue) => {
    const isActive = activeRange === rangeValue
    return `px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
      isActive
        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/5'
    }`
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <p className="text-gray-500 text-sm">No chart data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate min and max values for better Y-axis domain
  const values = filteredData
    .map((d) => d?.[lineKey] ?? d?.value)
    .filter((v) => typeof v === 'number' && !Number.isNaN(v))

  const minValue = values.length ? Math.min(...values) : 0
  const maxValue = values.length ? Math.max(...values) : 0
  const padding = values.length ? (maxValue - minValue) * 0.1 : 1
  const yDomain = [Math.max(0, minValue - padding), maxValue + padding]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Chart Header with Range Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h4 className="text-white text-sm font-medium tracking-wide">{title}</h4>
          <p className="text-gray-500 text-xs mt-0.5">
            {filteredData.length.toLocaleString()} data points •
            {activeRange === 'all'
              ? ' Full historical range'
              : ` Last ${activeRange} of performance`}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 rounded-full p-1 border border-white/10">
          {RANGE_OPTIONS.map((range) => (
            <button
              key={range.value}
              onClick={() => setActiveRange(range.value)}
              className={getRangeButtonClass(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full rounded-xl overflow-hidden">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={filteredData} margin={{ top: 15, right: 20, left: 5, bottom: 15 }}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.4} />
                <stop offset="50%" stopColor={gradientTo} stopOpacity={0.15} />
                <stop offset="100%" stopColor={gradientTo} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={gradientFrom} />
                <stop offset="100%" stopColor={gradientTo} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey={xAxisKey}
              tickFormatter={formatDate}
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              interval="preserveStartEnd"
              minTickGap={50}
              dy={5}
            />

            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => `${valuePrefix}${value.toFixed(2)}`}
              domain={yDomain}
              width={65}
              dx={-5}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1a1f2e] border border-purple-500/30 rounded-lg p-3 shadow-xl backdrop-blur-sm">
                      <p className="text-gray-400 text-xs mb-1.5 font-medium">
                        {formatDate(label)}
                      </p>
                      <p className="text-white text-base font-semibold">
                        NAV: {valuePrefix}
                        {payload[0]?.value?.toFixed(3)}
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-white/10">
                        <p className="text-purple-400 text-xs">
                          Value: {valuePrefix}
                          {payload[0]?.value?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              }}
              cursor={{
                stroke: 'rgba(167, 139, 250, 0.4)',
                strokeWidth: 1.5,
                strokeDasharray: '4 4',
              }}
            />

            <Area
              type="monotone"
              dataKey={lineKey}
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              fill="url(#navGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: gradientFrom,
                stroke: '#fff',
                strokeWidth: 2,
                cursor: 'pointer',
              }}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      {filteredData.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-gray-500 text-xs">Current</span>
            <span className="text-white text-xs font-mono">
              {valuePrefix}
              {filteredData[filteredData.length - 1]?.value?.toFixed(3)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-500 text-xs">Highest</span>
            <span className="text-white text-xs font-mono">
              {valuePrefix}
              {Math.max(...filteredData.map((d) => d.value)).toFixed(3)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-gray-500 text-xs">Lowest</span>
            <span className="text-white text-xs font-mono">
              {valuePrefix}
              {Math.min(...filteredData.map((d) => d.value)).toFixed(3)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
