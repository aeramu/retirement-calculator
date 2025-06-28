'use client'

import { DollarSign, Calendar, CalendarDays, ChevronDown, ChevronRight } from 'lucide-react'
import { CalculatorInputs as InputsType } from '../types'
import { formatNumber, parseNumber, formatAge, parseAge, parsePercentage } from '../utils/formatters'
import { InputModeToggle } from './InputModeToggle'
import { useState } from 'react'

// Helper functions for monthly/annual conversions
const getDisplayValue = (annualValue: number, mode: 'monthly' | 'annual' | undefined): number => {
  return mode === 'monthly' ? Math.round(annualValue / 12) : annualValue;
};

const getAnnualValue = (displayValue: number, mode: 'monthly' | 'annual' | undefined): number => {
  return mode === 'monthly' ? displayValue * 12 : displayValue;
};

interface CalculatorInputsProps {
  inputs: InputsType
  updateInput: (key: keyof InputsType, value: number | string | boolean) => void
}

export function CalculatorInputs({ inputs, updateInput }: CalculatorInputsProps) {
  const [showRetirementIncome, setShowRetirementIncome] = useState(false)



  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
        Calculator Inputs
      </h2>

      {/* Personal & Current Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Personal & Current Status</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Age
            </label>
            <input
              type="text"
              value={formatAge(inputs.currentAge)}
              onChange={(e) => {
                const value = parseAge(e.target.value)
                updateInput('currentAge', value)
              }}
              placeholder="30"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Assets ($)
            </label>
            <input
              type="text"
              value={formatNumber(inputs.currentAssets)}
              onChange={(e) => {
                const value = parseNumber(e.target.value)
                if (!isNaN(value)) updateInput('currentAssets', value)
              }}
              placeholder="100,000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Expenses ($)
            </label>
            <InputModeToggle
              mode={inputs.expenseInputMode || 'annual'}
              onToggle={() => updateInput('expenseInputMode', inputs.expenseInputMode === 'monthly' ? 'annual' : 'monthly')}
            />
          </div>
          <input
            type="text"
            value={formatNumber(getDisplayValue(inputs.currentExpense, inputs.expenseInputMode))}
            onChange={(e) => {
              const displayValue = parseNumber(e.target.value)
              if (!isNaN(displayValue)) {
                const annualValue = getAnnualValue(displayValue, inputs.expenseInputMode)
                updateInput('currentExpense', annualValue)
              }
            }}
            placeholder={inputs.expenseInputMode === 'monthly' ? '4,200' : '50,000'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={true}
              disabled={true}
              className="w-3 h-3 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 opacity-50 cursor-not-allowed"
            />
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Inflation adjusted (always applied)
            </span>
          </label>
        </div>
      </div>

      {/* Investment Parameters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Investment Parameters</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inflation Rate (%)
            </label>
            <input
              type="text"
              value={inputs.inflationRate}
              onChange={(e) => {
                const value = parsePercentage(e.target.value)
                updateInput('inflationRate', value)
              }}
              placeholder="4"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Investment Return (%)
            </label>
            <input
              type="text"
              value={inputs.investmentReturn}
              onChange={(e) => {
                const value = parsePercentage(e.target.value)
                updateInput('investmentReturn', value)
              }}
              placeholder="8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Retirement Planning */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Retirement Planning</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Retirement Age
            </label>
            <input
              type="text"
              value={formatAge(inputs.retireAge)}
              onChange={(e) => {
                const value = parseAge(e.target.value)
                updateInput('retireAge', value)
              }}
              placeholder="60"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Life Expectancy
            </label>
            <input
              type="text"
              value={formatAge(inputs.dieAge)}
              onChange={(e) => {
                const value = parseAge(e.target.value)
                updateInput('dieAge', value)
              }}
              placeholder="90"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Optional: Partial Income in Retirement */}
      <div className="space-y-3">
        <button
          onClick={() => setShowRetirementIncome(!showRetirementIncome)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide hover:text-gray-800 dark:hover:text-gray-200 transition-colors w-full text-left"
        >
          {showRetirementIncome ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Optional: Income During Retirement
        </button>

        {showRetirementIncome && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div>
              <div className="flex flex-row items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Partial Income ($)
                </label>
                <InputModeToggle
                  mode={inputs.partialIncomeInputMode || 'annual'}
                  onToggle={() => updateInput('partialIncomeInputMode', inputs.partialIncomeInputMode === 'monthly' ? 'annual' : 'monthly')}
                />
              </div>
              <input
                type="text"
                value={formatNumber(getDisplayValue(inputs.partialIncome, inputs.partialIncomeInputMode))}
                onChange={(e) => {
                  const displayValue = parseNumber(e.target.value)
                  if (!isNaN(displayValue)) {
                    const annualValue = getAnnualValue(displayValue, inputs.partialIncomeInputMode)
                    updateInput('partialIncome', annualValue)
                  }
                }}
                placeholder={inputs.partialIncomeInputMode === 'monthly' ? '0' : '0'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputs.inflationAdjustPartialIncome}
                onChange={(e) => updateInput('inflationAdjustPartialIncome', e.target.checked)}
                className="w-3 h-3 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Adjust for inflation (amount increases every year)
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Until Age
              </label>
              <input
                type="text"
                value={formatAge(inputs.partialIncomeUntilAge)}
                onChange={(e) => {
                  const value = parseAge(e.target.value)
                  updateInput('partialIncomeUntilAge', value)
                }}
                placeholder="70"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This partial income is <strong>not applicable to FIRE calculations</strong>. FIRE Philosophy requires having enough assets to sustain you indefinitely, even in the worst-case scenario. Since partial income may stop, the FIRE calculation ensures you can cover full expenses from your assets alone. This guarantees true independence where you don't need to rely on any external income sources.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 