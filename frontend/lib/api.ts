const DEFAULT_API_URL = 'http://localhost:3001'
const DEFAULT_ML_API_URL = 'http://localhost:8000'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
export const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || DEFAULT_ML_API_URL

export const api = {
  getRecommendations: async (data: any) => {
    const response = await fetch(`${API_URL}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  generateItinerary: async (data: any) => {
    const response = await fetch(`${API_URL}/api/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  getWeather: async (city: string) => {
    const response = await fetch(`${API_URL}/api/weather/${city}`)
    return response.json()
  },

  getSafety: async (destination: string) => {
    const response = await fetch(`${API_URL}/api/safety/${destination}`)
    return response.json()
  },

  getFlights: async (destination: string) => {
    const response = await fetch(`${API_URL}/api/flights/${destination}`)
    return response.json()
  },

  getTravelTips: async (country: string) => {
    const response = await fetch(`${API_URL}/api/tips/${country}`)
    return response.json()
  },

  saveItinerary: async (itinerary: any) => {
    const response = await fetch(`${API_URL}/api/itinerary/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary),
    })
    return response.json()
  },
}

