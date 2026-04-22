'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface MoodSelectorProps {
  onSelect: (mood: string) => void
}

const moods = [
  { id: 'adventurous', emoji: '🏔️', label: 'Adventurous', color: 'from-red-400 to-red-600' },
  { id: 'calm', emoji: '🧘', label: 'Calm', color: 'from-teal-400 to-teal-600' },
  { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'from-pink-400 to-pink-600' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'from-gray-400 to-gray-600' },
  { id: 'excited', emoji: '🎉', label: 'Excited', color: 'from-yellow-400 to-yellow-600' },
  { id: 'bored', emoji: '😑', label: 'Bored', color: 'from-purple-400 to-purple-600' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-blue-400 to-blue-600' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: 'from-indigo-400 to-indigo-600' },
]

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [customMood, setCustomMood] = useState<string>('')

  const handleMoodClick = (moodId: string) => {
    setSelectedMood(moodId)
    setTimeout(() => onSelect(moodId), 300)
  }

  const handleCustomSubmit = () => {
    if (customMood.trim()) {
      onSelect(customMood.trim().toLowerCase())
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        How are you feeling today?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodClick(mood.id)}
            className={`p-6 rounded-xl bg-gradient-to-br ${mood.color} text-white shadow-lg hover:shadow-xl transition-all ${
              selectedMood === mood.id ? 'ring-4 ring-white ring-offset-2' : ''
            }`}
          >
            <div className="text-4xl mb-2">{mood.emoji}</div>
            <div className="font-semibold">{mood.label}</div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Or describe your mood in your own words:
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={customMood}
            onChange={(e) => setCustomMood(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
            placeholder="e.g., nostalgic, energetic, peaceful..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCustomSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

