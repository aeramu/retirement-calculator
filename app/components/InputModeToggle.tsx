'use client'

interface InputModeToggleProps {
    mode: 'monthly' | 'annual' | undefined
    onToggle: () => void
}

export function InputModeToggle({ mode, onToggle }: InputModeToggleProps) {
    return (
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 min-w-[100px] sm:min-w-[110px]">
            <button
                onClick={() => mode !== 'monthly' && onToggle()}
                className={`flex-1 flex items-center justify-center px-2 py-1.5 rounded-xl text-xs sm:text-xs font-medium transition-all ${mode === 'monthly'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
            >
                Monthly
            </button>
            <button
                onClick={() => mode !== 'annual' && onToggle()}
                className={`flex-1 flex items-center justify-center px-2 py-1.5 rounded-xl text-xs sm:text-xs font-medium transition-all ${mode === 'annual' || !mode
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
            >
                Annual
            </button>
        </div>
    )
} 