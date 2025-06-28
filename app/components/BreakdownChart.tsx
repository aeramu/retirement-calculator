'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { YearData } from '../types'
import { formatCurrency, formatCompactCurrency } from '../utils/formatters'

interface BreakdownChartProps {
  data: YearData[]
}

export function BreakdownChart({ data }: BreakdownChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Annual Financial Breakdown
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="age"
              className="text-gray-600 dark:text-gray-400"
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value))]}
              contentStyle={{
                backgroundColor: 'var(--tw-prose-body)',
                border: '1px solid var(--tw-prose-pre-border)',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            <Bar dataKey="assets" fill="#8884d8" name="Assets" />
            <Bar dataKey="expenses" fill="#82ca9d" name="Net Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 