'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendar, FaMapMarkerAlt, FaDollarSign, FaDownload, FaShare, FaSave } from 'react-icons/fa'
import { API_URL } from '@/lib/api'
// Dynamic imports for PDF generation
const generatePDF = async () => {
  const { default: jsPDF } = await import('jspdf')
  const { default: html2canvas } = await import('html2canvas')
  return { jsPDF, html2canvas }
}

interface ItineraryViewProps {
  destination: any
  mood: string
  duration: number
  budget: number
}

export default function ItineraryView({
  destination,
  mood,
  duration,
  budget,
}: ItineraryViewProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState<any>(null)
  const [safety, setSafety] = useState<any>(null)

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const startDate = new Date().toISOString().split('T')[0]
        const response = await fetch(
          `${API_URL}/api/itinerary`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destination: destination.name,
              mood,
              duration,
              budget,
              start_date: startDate,
            }),
          }
        )
        const data = await response.json()
        setItinerary(data)

        // Fetch weather and safety
        const cityName = destination.name.split(',')[0]
        const [weatherRes, safetyRes] = await Promise.all([
          fetch(`${API_URL}/api/weather/${cityName}`),
          fetch(`${API_URL}/api/safety/${destination.name}`),
        ])
        setWeather(await weatherRes.json())
        setSafety(await safetyRes.json())
      } catch (error) {
        console.error('Error fetching itinerary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [destination, mood, duration, budget])

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('itinerary-content')
      if (!element) return

      const { jsPDF, html2canvas } = await generatePDF()
      const canvas = await html2canvas(element, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`itinerary-${destination.name.replace(/,/g, '-')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/api/itinerary/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123', // In production, get from auth
          itinerary,
        }),
      })
      alert('Itinerary saved successfully!')
    } catch (error) {
      console.error('Error saving itinerary:', error)
      alert('Failed to save itinerary')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Travel Itinerary: ${destination.name}`,
        text: `Check out my travel plan for ${destination.name}!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized itinerary...</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return <div className="text-center text-red-600">Failed to generate itinerary</div>
  }

  return (
    <div className="max-w-5xl mx-auto" id="itinerary-content">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl mb-6">
        <h2 className="text-4xl font-bold mb-2">{itinerary.destination}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <FaCalendar /> {itinerary.duration} days
          </span>
          <span className="flex items-center gap-2">
            <FaDollarSign /> ${itinerary.total_budget.toLocaleString()}
          </span>
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt /> {mood} mood
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaDownload /> Download PDF
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSave /> Save
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaShare /> Share
        </button>
      </div>

      {/* Weather & Safety Info */}
      {(weather || safety) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {weather && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Current Weather</h3>
              <p>
                {weather.temperature}°C, {weather.condition}
              </p>
              <p className="text-sm text-gray-600">
                Humidity: {weather.humidity}% | Wind: {weather.wind_speed} km/h
              </p>
            </div>
          )}
          {safety && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Safety Information</h3>
              <p>
                Safety Score: <strong>{safety.safety_score}/10</strong> ({safety.safety_level})
              </p>
            </div>
          )}
        </div>
      )}

      {/* Itinerary Days */}
      <div className="space-y-6">
        {itinerary.itinerary?.map((day: any, idx: number) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                {day.day}
              </div>
              <div>
                <h3 className="text-xl font-bold">Day {day.day}</h3>
                <p className="text-gray-600">{new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🌅 Morning</h4>
                <p className="text-sm text-gray-700 mb-1">{day.morning.activity}</p>
                <p className="text-xs text-gray-500">{day.morning.time}</p>
                <p className="text-xs text-green-600 mt-2">${day.morning.cost}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">☀️ Afternoon</h4>
                <p className="text-sm text-gray-700 mb-1">{day.afternoon.activity}</p>
                <p className="text-xs text-gray-500">{day.afternoon.time}</p>
                <p className="text-xs text-green-600 mt-2">${day.afternoon.cost}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🌙 Evening</h4>
                <p className="text-sm text-gray-700 mb-1">{day.evening.activity}</p>
                <p className="text-xs text-gray-500">{day.evening.time}</p>
                <p className="text-xs text-green-600 mt-2">${day.evening.cost}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">Accommodation</h4>
                  <p className="text-sm text-gray-600">{day.accommodation.type}</p>
                </div>
                <p className="text-green-600 font-bold">${day.accommodation.cost}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-end">
              <span className="text-sm text-gray-600">
                Daily Total: <strong className="text-blue-600">${day.total_daily_cost}</strong>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      {itinerary.summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
        >
          <h3 className="text-2xl font-bold mb-4">Trip Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Total Estimated Cost</p>
              <p className="text-2xl font-bold text-green-600">
                ${itinerary.summary.total_estimated_cost.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Average Daily Cost</p>
              <p className="text-2xl font-bold text-blue-600">
                ${itinerary.summary.average_daily_cost.toLocaleString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-1">Recommended Transport</p>
              <p className="font-semibold">{itinerary.summary.recommended_transport}</p>
            </div>
          </div>

          {itinerary.summary.travel_tips && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Travel Tips</h4>
              <ul className="space-y-1">
                {itinerary.summary.travel_tips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

