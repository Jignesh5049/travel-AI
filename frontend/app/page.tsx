'use client'

import { useState } from 'react'
import MoodSelector from '@/components/MoodSelector'
import BudgetSlider from '@/components/BudgetSlider'
import DurationSelector from '@/components/DurationSelector'
import Recommendations from '@/components/Recommendations'
import ItineraryView from '@/components/ItineraryView'
import { motion } from 'framer-motion'
import { API_URL } from '@/lib/api'

export default function Home() {
  const [step, setStep] = useState<'mood' | 'preferences' | 'recommendations' | 'itinerary'>('mood')
  const [mood, setMood] = useState<string>('')
  const [budget, setBudget] = useState<number>(5000)
  const [duration, setDuration] = useState<number>(7)
  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood)
    setStep('preferences')
  }

  const handlePreferencesSubmit = async () => {
    setStep('recommendations')
    // Fetch recommendations
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          budget,
          duration,
        }),
      })
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const handleDestinationSelect = (destination: any) => {
    setSelectedDestination(destination)
    setStep('itinerary')
  }

  const handleBack = () => {
    if (step === 'itinerary') {
      setStep('recommendations')
    } else if (step === 'recommendations') {
      setStep('preferences')
    } else if (step === 'preferences') {
      setStep('mood')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🌍 AI Mood-Based Travel Planner
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your perfect destination based on how you feel
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['mood', 'preferences', 'recommendations', 'itinerary'].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s
                      ? 'bg-blue-600 text-white'
                      : ['mood', 'preferences', 'recommendations', 'itinerary'].indexOf(step) > idx
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                >
                  {idx + 1}
                </div>
                {idx < 3 && (
                  <div
                    className={`w-16 h-1 ${['mood', 'preferences', 'recommendations', 'itinerary'].indexOf(step) > idx
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {step !== 'mood' && (
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back
          </button>
        )}

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step === 'mood' && (
            <MoodSelector onSelect={handleMoodSelect} />
          )}

          {step === 'preferences' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <BudgetSlider value={budget} onChange={setBudget} />
              <DurationSelector value={duration} onChange={setDuration} />
              <button
                onClick={handlePreferencesSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Get Recommendations →
              </button>
            </div>
          )}

          {step === 'recommendations' && recommendations && (
            <Recommendations
              recommendations={recommendations}
              onSelect={handleDestinationSelect}
            />
          )}

          {step === 'itinerary' && selectedDestination && (
            <ItineraryView
              destination={selectedDestination}
              mood={mood}
              duration={duration}
              budget={budget}
            />
          )}
        </motion.div>
      </div>
    </main>
  )
}

