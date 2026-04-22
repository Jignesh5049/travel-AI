# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- MongoDB (local or Atlas account)
- npm or yarn

## Installation (5 minutes)

### Step 1: Install Dependencies

Open 3 terminal windows and run:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 2 - Backend:**
```bash
cd api_server
npm install
```

**Terminal 3 - ML Engine:**
```bash
cd ml_engine
pip install -r requirements.txt
```

### Step 2: Create Environment Files

**Create `frontend/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

**Create `api_server/.env`:**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/travel_ai
ML_API_URL=http://localhost:8000
```

**Create `ml_engine/.env`:**
```
WEATHER_API_KEY=
```
(Leave empty for mock weather data, or add your OpenWeatherMap API key)

### Step 3: Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or skip this if using MongoDB Atlas (update MONGODB_URI in api_server/.env)

### Step 4: Run All Services

**Terminal 1 - ML Engine (Port 8000):**
```bash
cd ml_engine
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - API Server (Port 3001):**
```bash
cd api_server
npm start
```

**Terminal 3 - Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```

### Step 5: Open the App

Visit: **http://localhost:3000**

## Usage

1. **Select Your Mood** - Choose from adventurous, calm, romantic, etc.
2. **Set Preferences** - Adjust budget and trip duration
3. **View Recommendations** - See AI-suggested destinations
4. **Generate Itinerary** - Get a day-by-day travel plan
5. **Download PDF** - Save your itinerary

## Troubleshooting

**Port already in use?**
- Change ports in .env files and restart services

**MongoDB connection error?**
- Make sure MongoDB is running or use MongoDB Atlas

**ML Engine not starting?**
- Check Python version: `python --version` (needs 3.9+)
- Install dependencies: `pip install -r requirements.txt`

**Frontend build errors?**
- Delete `node_modules` and `.next` folder, then `npm install` again

## Features

✅ Mood-based recommendations  
✅ AI itinerary generation  
✅ Budget planning  
✅ Weather integration  
✅ Safety scores  
✅ PDF export  
✅ Save & share  

Enjoy planning your trip! 🌍✈️

