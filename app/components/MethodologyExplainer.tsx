'use client'

import { useState } from 'react'
import { Info, X, Target, TrendingDown } from 'lucide-react'

interface MethodologyExplainerProps {
    method: 'fire' | 'dieWithZero'
}

export function MethodologyExplainer({ method }: MethodologyExplainerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const methodInfo = {
        fire: {
            title: "FIRE (Financial Independence, Retire Early)",
            icon: Target,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-700",
            description: "The FIRE movement focuses on achieving financial independence through aggressive saving and investing, allowing you to retire much earlier than traditional retirement age.",
            keyPrinciples: [
                "Save 25x your annual expenses",
                "Follow the 4% withdrawal rule",
                "Preserve capital for long-term sustainability",
                "Aim for 25% savings rate during accumulation",
                "Conservative approach that typically leaves inheritance"
            ],
            calculation: "This method calculates how much you need to save to sustain your lifestyle indefinitely. It assumes you can safely withdraw 4% of your portfolio annually without depleting the principal."
        },
        dieWithZero: {
            title: "Die with Zero",
            icon: TrendingDown,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-200 dark:border-purple-700",
            description: "Based on Bill Perkins' philosophy, this approach optimizes your spending to maximize life experiences while ensuring you use up your assets by the end of life rather than leaving a large inheritance.",
            keyPrinciples: [
                "Optimize spending throughout your lifetime",
                "Maximize experiences while you can enjoy them",
                "Don't over-save for an uncertain future",
                "Aim for 20% savings rate during accumulation",
                "Spend down assets to zero by age 90"
            ],
            calculation: "This method calculates how to spend your assets over your remaining lifetime, ensuring you don't run out too early but also don't die with significant unused wealth."
        }
    }

    const info = methodInfo[method]
    const IconComponent = info.icon

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center space-x-2 text-sm ${info.color} hover:underline`}
            >
                <Info className="h-4 w-4" />
                <span>Learn about {method === 'fire' ? 'FIRE' : 'Die with Zero'}</span>
            </button>
        )
    }

    return (
        <div className={`${info.bgColor} ${info.borderColor} border rounded-lg p-4 mt-4`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${info.color}`} />
                    <h4 className={`font-semibold ${info.color}`}>{info.title}</h4>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{info.description}</p>

            <div className="mb-3">
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Key Principles:</h5>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {info.keyPrinciples.map((principle, index) => (
                        <li key={index} className="flex items-start">
                            <span className={`${info.color} mr-2`}>•</span>
                            {principle}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">How it&apos;s calculated:</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{info.calculation}</p>
            </div>
        </div>
    )
} 