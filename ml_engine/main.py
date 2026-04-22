from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import requests
import os
from dotenv import load_dotenv
from ml_models import TravelRecommendationEngine

load_dotenv()

app = FastAPI(title="Travel AI ML Engine")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML engine
ml_engine = TravelRecommendationEngine()

class MoodInput(BaseModel):
    mood: str
    preferences: Optional[Dict] = {}
    budget: Optional[float] = None
    duration: Optional[int] = None
    season: Optional[str] = None

class ItineraryRequest(BaseModel):
    destination: str
    mood: str
    duration: int
    budget: float
    start_date: str
    preferences: Optional[Dict] = {}

@app.get("/")
def root():
    return {"message": "Travel AI ML Engine is running"}

@app.post("/api/recommendations")
async def get_recommendations(mood_input: MoodInput):
    """Get destination recommendations based on mood"""
    try:
        recommendations = ml_engine.get_recommendations(
            mood=mood_input.mood,
            preferences=mood_input.preferences,
            budget=mood_input.budget,
            duration=mood_input.duration,
            season=mood_input.season
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/itinerary")
async def generate_itinerary(request: ItineraryRequest):
    """Generate day-by-day itinerary"""
    try:
        itinerary = ml_engine.generate_itinerary(
            destination=request.destination,
            mood=request.mood,
            duration=request.duration,
            budget=request.budget,
            start_date=request.start_date,
            preferences=request.preferences
        )
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather/{city}")
async def get_weather(city: str):
    """Get weather forecast for a city"""
    try:
        api_key = os.getenv("WEATHER_API_KEY", "")
        if not api_key:
            # Return mock data if no API key
            return {
                "city": city,
                "temperature": 22,
                "condition": "Sunny",
                "humidity": 65,
                "wind_speed": 10
            }
        
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                "city": city,
                "temperature": data["main"]["temp"],
                "condition": data["weather"][0]["main"],
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"]
            }
        else:
            raise HTTPException(status_code=404, detail="Weather data not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/safety/{destination}")
async def get_safety_score(destination: str):
    """Get safety score for a destination"""
    try:
        # Mock safety scores (in production, use real safety API)
        safety_data = ml_engine.get_safety_score(destination)
        return safety_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

