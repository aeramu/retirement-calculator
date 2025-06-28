'use client'

import { Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { YearData } from '../types'
import { formatCurrency, formatCompactCurrency } from '../utils/formatters'

interface AssetsChartProps {
    data: YearData[]
}

export function AssetsChart({ data }: AssetsChartProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Assets Over Time
            </h3>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="age" className="text-gray-600 dark:text-gray-400" />
                        <YAxis
                            tickFormatter={formatCompactCurrency}
                            className="text-gray-600 dark:text-gray-400"
                        />
                        <Tooltip
                            formatter={(value) => [formatCurrency(Number(value)), 'Assets']}
                            contentStyle={{
                                backgroundColor: 'var(--tw-prose-body)',
                                border: '1px solid var(--tw-prose-pre-border)',
                                borderRadius: '0.5rem'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="assets"
                            stroke="#8884d8"
                            strokeWidth={3}
                            name="Total Assets"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
} 