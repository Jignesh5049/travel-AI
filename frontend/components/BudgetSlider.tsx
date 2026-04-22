'use client'

import { motion } from 'framer-motion'

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Budget</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Trip Budget</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(value)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>$500</span>
          <span>$25,000</span>
          <span>$50,000</span>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Estimated daily budget:</strong>{' '}
            <span className="text-blue-600 font-semibold">
              {formatCurrency(value / 7)}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

