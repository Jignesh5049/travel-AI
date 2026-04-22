# Setup Guide

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend API:**
```bash
cd api_server
npm install
```

**ML Engine:**
```bash
cd ml_engine
pip install -r requirements.txt
```

### 2. Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

**API Server** (`api_server/.env`):
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/travel_ai
ML_API_URL=http://localhost:8000
WEATHER_API_KEY=your_openweathermap_key
```

**ML Engine** (`ml_engine/.env`):
```
WEATHER_API_KEY=your_openweathermap_key
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update the connection string.

### 4. Run the Application

**Terminal 1 - ML Engine:**
```bash
cd ml_engine
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - API Server:**
```bash
cd api_server
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Mood-based destination recommendations
- ✅ AI-powered itinerary generation
- ✅ Budget-aware planning
- ✅ Weather integration
- ✅ Safety scores
- ✅ PDF export
- ✅ Save and share itineraries
- ✅ Responsive design

## Optional: Get Weather API Key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to `.env` files

Without the API key, the app will use mock weather data.

