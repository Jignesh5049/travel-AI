'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaMapMarkerAlt, FaDollarSign, FaShieldAlt, FaStar } from 'react-icons/fa'
import { API_URL } from '@/lib/api'

interface RecommendationsProps {
  recommendations: any
  onSelect: (destination: any) => void
}

export default function Recommendations({ recommendations, onSelect }: RecommendationsProps) {
  const [weatherData, setWeatherData] = useState<any>({})

  useEffect(() => {
    // Fetch weather for top destinations
    recommendations.recommendations?.slice(0, 3).forEach(async (dest: any) => {
      try {
        const response = await fetch(`${API_URL}/api/weather/${dest.name.split(',')[0]}`)
        const data = await response.json()
        setWeatherData((prev: any) => ({ ...prev, [dest.name]: data }))
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    })
  }, [recommendations])

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Perfect Destinations for Your Mood: {recommendations.mood}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recommendations.recommendations?.map((dest: any, idx: number) => (
          <motion.div
            key={dest.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => onSelect(dest)}
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                Score: {dest.score}
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">{dest.name}</h3>
                <p className="text-sm opacity-90">{dest.country}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-blue-500" />
                <span className="text-sm text-gray-600">{dest.best_season}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span className="font-bold text-green-600">
                    ${dest.estimated_cost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Safety:</span>
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className="text-green-500" />
                    <span className="font-semibold">{dest.safety_score}/10</span>
                  </div>
                </div>
              </div>

              {weatherData[dest.name] && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Weather:</strong> {weatherData[dest.name].temperature}°C,{' '}
                    {weatherData[dest.name].condition}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Activities:</p>
                <div className="flex flex-wrap gap-2">
                  {dest.activities.map((activity: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelect(dest)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Itinerary →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {recommendations.travel_tips && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold mb-4">Travel Tips</h3>
          <ul className="space-y-2">
            {recommendations.travel_tips.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

