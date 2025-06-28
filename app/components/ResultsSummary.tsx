'use client'

import { TrendingUp } from 'lucide-react'
import { CalculatorInputs } from '../types'
import { formatCurrency } from '../utils/formatters'
import { safeCompound } from '../utils/calculations'

interface ResultsSummaryProps {
    retirementAssets: number
    finalAssets: number
    inputs: CalculatorInputs
}

export function ResultsSummary({ retirementAssets, finalAssets, inputs }: ResultsSummaryProps) {
    // Calculate inflated expenses at retirement
    const yearsToRetirement = inputs.retireAge - inputs.currentAge

    // Calculate what the retirement assets would be worth in today's purchasing power
    const inflationCompoundFactor = safeCompound(1, inputs.inflationRate / 100, yearsToRetirement)
    const todaysValueOfRetirementAssets = retirementAssets / inflationCompoundFactor

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Key Results
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Assets at Retirement:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(retirementAssets)}
                    </span>
                </div>
                <div className="flex justify-between pl-4">
                    <span className="text-sm text-gray-500 dark:text-gray-500">In today's values:</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                        {formatCurrency(todaysValueOfRetirementAssets)}
                    </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Final Assets:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(finalAssets)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Die Age:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {inputs.dieAge} years old
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
} 