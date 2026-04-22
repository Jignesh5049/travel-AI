'use client'

import { motion } from 'framer-motion'

interface DurationSelectorProps {
  value: number
  onChange: (value: number) => void
}

const durations = [3, 5, 7, 10, 14, 21, 30]

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Trip Duration</h3>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
        {durations.map((days) => (
          <motion.button
            key={days}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(days)}
            className={`p-4 rounded-lg font-semibold transition-all ${
              value === days
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {days}
            <div className="text-xs mt-1">days</div>
          </motion.button>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Selected: <strong className="text-blue-600">{value} days</strong>
        </p>
      </div>
    </motion.div>
  )
}

