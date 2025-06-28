'use client'

import { useState, useMemo, useEffect } from 'react'
import { CalculatorInputs } from './types'
import { calculateRetirement } from './utils/calculations'
import { Header } from './components/Header'
import { CalculatorInputs as InputsComponent } from './components/CalculatorInputs'
import { SavingsCalculator } from './components/SavingsCalculator'
import { ResultsSummary } from './components/ResultsSummary'
import { BreakdownChart } from './components/BreakdownChart'
import { ThemeToggle } from './components/ThemeToggle'

const STORAGE_KEY = 'retirement-calculator-inputs'

const defaultInputs: CalculatorInputs = {
  currentExpense: 50000,
  currentAge: 25,
  inflationRate: 4,
  investmentReturn: 8,
  currentAssets: 100000,
  retireAge: 60,
  partialIncome: 0,
  partialIncomeUntilAge: 0,
  annualSavings: 12000,
  dieAge: 90,
  inflationAdjustPartialIncome: false,
  inflationAdjustSavings: false,
  strategy: 'CURRENT_PLAN',
  expenseInputMode: 'annual',
  partialIncomeInputMode: 'annual',
  savingsInputMode: 'annual'
}

const loadInputsFromStorage = (): CalculatorInputs => {
  if (typeof window === 'undefined') return defaultInputs

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate that all required fields exist
      const isValid = Object.keys(defaultInputs).every(key => key in parsed)
      if (isValid) {
        return { ...defaultInputs, ...parsed }
      }
    }
  } catch (error) {
    console.warn('Failed to load saved inputs:', error)
  }

  return defaultInputs
}

const saveInputsToStorage = (inputs: CalculatorInputs) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
  } catch (error) {
    console.warn('Failed to save inputs:', error)
  }
}

export default function RetirementCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs)

  // Load inputs from localStorage on component mount
  useEffect(() => {
    const savedInputs = loadInputsFromStorage()
    setInputs(savedInputs)
  }, [])

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    saveInputsToStorage(inputs)
  }, [inputs])

  const projectionData = useMemo(() => calculateRetirement(inputs), [inputs])

  const updateInput = (key: keyof CalculatorInputs, value: number | string | boolean) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const retirementAssets = projectionData.find(d => d.age === inputs.retireAge)?.assets || 0
  const finalAssets = projectionData[projectionData.length - 1]?.assets || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <InputsComponent inputs={inputs} updateInput={updateInput} />
          </div>

          {/* Charts Panel */}
          <div className="lg:col-span-2 space-y-6">
            <SavingsCalculator inputs={inputs} updateInput={updateInput} />
            <BreakdownChart data={projectionData} />
            <ResultsSummary
              retirementAssets={retirementAssets}
              finalAssets={finalAssets}
              inputs={inputs}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
