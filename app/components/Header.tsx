'use client'

import { Calculator } from 'lucide-react'

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Calculator className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Retirement Calculator</h1>
      </div>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        Plan your financial future with FIRE or Die with Zero strategies
      </p>
    </div>
  )
} 