'use client'

import { motion } from 'framer-motion'
import { FaPlane, FaHotel, FaUtensils, FaCamera } from 'react-icons/fa'

interface TimelineProps {
  itinerary: any[]
}

export default function TravelTimeline({ itinerary }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
      <div className="space-y-8">
        {itinerary.map((day, idx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start gap-6"
          >
            <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {day.day}
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Day {day.day}</h3>
              <p className="text-gray-600 mb-4">
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaCamera className="text-yellow-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{day.morning.activity}</p>
                    <p className="text-sm text-gray-500">{day.morning.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUtensils className="text-orange-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{day.afternoon.activity}</p>
                    <p className="text-sm text-gray-500">{day.afternoon.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaHotel className="text-purple-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{day.evening.activity}</p>
                    <p className="text-sm text-gray-500">{day.evening.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

