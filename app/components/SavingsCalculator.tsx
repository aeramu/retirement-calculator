'use client'

import { Calculator, ChevronDown, ChevronUp, Target, TrendingDown } from 'lucide-react'
import { CalculatorInputs as InputsType } from '../types'
import { calculateFireSavings, calculateDieWithZeroSavings } from '../utils/calculations'
import { formatNumber, parseNumber } from '../utils/formatters'
import { InputModeToggle } from './InputModeToggle'
import { useState } from 'react'

// Helper functions for monthly/annual conversions
const getDisplayValue = (annualValue: number, mode: 'monthly' | 'annual' | undefined): number => {
  return mode === 'monthly' ? Math.round(annualValue / 12) : annualValue;
};

const getAnnualValue = (displayValue: number, mode: 'monthly' | 'annual' | undefined): number => {
  return mode === 'monthly' ? displayValue * 12 : displayValue;
};

interface SavingsCalculatorProps {
  inputs: InputsType
  updateInput: (key: keyof InputsType, value: number | string | boolean) => void
}

export function SavingsCalculator({ inputs, updateInput }: SavingsCalculatorProps) {
  const [showFireExplanation, setShowFireExplanation] = useState(false)
  const [showDieWithZeroExplanation, setShowDieWithZeroExplanation] = useState(false)

  const handleCalculateFireSavings = () => {
    const requiredSavings = calculateFireSavings(inputs)
    updateInput('annualSavings', Math.round(requiredSavings))
  }

  const handleCalculateDieWithZeroSavings = () => {
    const requiredSavings = calculateDieWithZeroSavings(inputs)
    updateInput('annualSavings', Math.round(requiredSavings))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center mb-3">
        <Calculator className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Calculate Required Savings
      </h3>

      {/* Main Layout: Input on left, Buttons on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Left Column: Savings Input Field */}
        <div>
          <div className="flex flex-row items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Savings ($)
            </label>
            <InputModeToggle
              mode={inputs.savingsInputMode || 'annual'}
              onToggle={() => updateInput('savingsInputMode', inputs.savingsInputMode === 'monthly' ? 'annual' : 'monthly')}
            />
          </div>
          <input
            type="text"
            value={formatNumber(getDisplayValue(inputs.annualSavings, inputs.savingsInputMode))}
            onChange={(e) => {
              const displayValue = parseNumber(e.target.value)
              if (!isNaN(displayValue)) {
                const annualValue = getAnnualValue(displayValue, inputs.savingsInputMode)
                updateInput('annualSavings', annualValue)
              }
            }}
            placeholder={inputs.savingsInputMode === 'monthly' ? '1,000' : '12,000'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={inputs.inflationAdjustSavings}
              onChange={(e) => updateInput('inflationAdjustSavings', e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Adjust for inflation (amount increases every year)
            </span>
          </label>
        </div>

        {/* Right Column: Main Calculation Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCalculateFireSavings}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <Target className="h-4 w-4 mr-2" />
            Calculate for FIRE
          </button>

          <button
            onClick={handleCalculateDieWithZeroSavings}
            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Calculate for Die with Zero
          </button>
        </div>
      </div>

      {/* Explanations Section Below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* FIRE Explanation */}
        <div>
          <button
            onClick={() => setShowFireExplanation(!showFireExplanation)}
            className="w-full px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md transition-colors flex items-center justify-center text-sm"
          >
            {showFireExplanation ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            What is FIRE?
          </button>
          {showFireExplanation && (
            <div className="mt-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-green-800 dark:text-green-200">
              <h4 className="font-semibold mb-2">Financial Independence, Retire Early (FIRE)</h4>
              <ul className="flex flex-col gap-1 list-disc list-inside">
                <li><strong>What it is:</strong> A strategy to achieve complete financial independence from work by building enough wealth to live indefinitely</li>
                <li><strong>Philosophy:</strong> Live off the &quot;interest&quot; forever while preserving your wealth</li>
                <li><strong>Benefit:</strong> Financial security even if you live much longer than expected</li>
                <li><strong>Trade-off:</strong> Requires more savings but offers maximum safety and potential inheritance</li>
              </ul>
            </div>
          )}
        </div>

        {/* Die with Zero Explanation */}
        <div>
          <button
            onClick={() => setShowDieWithZeroExplanation(!showDieWithZeroExplanation)}
            className="w-full px-3 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md transition-colors flex items-center justify-center text-sm"
          >
            {showDieWithZeroExplanation ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            What is Die with Zero?
          </button>
          {showDieWithZeroExplanation && (
            <div className="mt-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md text-sm text-purple-800 dark:text-purple-200">
              <h4 className="font-semibold mb-2">Die with Zero Strategy</h4>
              <ul className="flex flex-col gap-1 list-disc list-inside">
                <li><strong>What it is:</strong> A strategy to spend all your wealth during your lifetime, ending with zero dollars at death</li>
                <li><strong>Philosophy:</strong> Maximize your life experiences by using all available resources during your lifetime</li>
                <li><strong>Benefit:</strong> Allows for higher spending in retirement since you&apos;re not preserving wealth</li>
                <li><strong>Trade-off:</strong> Requires less savings but carries risk if you live longer than expected</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 