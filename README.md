# Travel AI

Mood-based travel planning platform with recommendation intelligence,
itinerary generation, and practical trip insights.

![frontend](https://img.shields.io/badge/frontend-Next.js%2014-111111)
![api](https://img.shields.io/badge/api-Express-0A0A0A)
![ml](https://img.shields.io/badge/ml-FastAPI-009688)
![database](https://img.shields.io/badge/database-MongoDB-2E7D32)
![license](https://img.shields.io/badge/license-MIT-blue)

## Why This Project

Travel AI helps users answer one practical question quickly:
where should I travel right now, given my mood, budget, and available time?

It combines:
- mood-aware recommendations
- budget-constrained planning
- weather and safety context
- save, share, and export workflows for generated itineraries

## Quick Navigation

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Runbook](#runbook)
- [API Contract](#api-contract)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)

## System Architecture

```text
Browser (Next.js)
	|
	v
API Server (Express, :3001)
	|\
	| \--> MongoDB (itinerary persistence)
	|
	v
ML Engine (FastAPI, :8000)
	|
	v
OpenWeatherMap (optional via WEATHER_API_KEY)
```

### Service Responsibilities

| Service | Responsibility |
|---|---|
| Frontend | User interaction, mood and preference collection, itinerary visualization, export and share actions |
| API Server | Request orchestration, persistence, and API boundary for the client |
| ML Engine | Recommendation logic, itinerary generation, weather enrichment, and safety scoring |
| MongoDB | Persisted itineraries for later retrieval |

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| API | Node.js, Express, Axios, Mongoose |
| ML | FastAPI, Python, NumPy, pandas, scikit-learn |
| Data | MongoDB |

## Repository Structure

```text
TRAVEL_AI/
	frontend/     Next.js client app
	api_server/   Express API and MongoDB interaction
	ml_engine/    FastAPI ML service
	README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.9+
- MongoDB, local or Atlas

### Install Dependencies

```bash
npm install
cd frontend && npm install
cd ../api_server && npm install
cd ../ml_engine && pip install -r requirements.txt
```

## Environment Variables

### Frontend

File: frontend/.env.local

| Variable | Required | Default | Description |
|---|---|---|---|
| NEXT_PUBLIC_API_URL | Yes | http://localhost:3001 | API server base URL |
| NEXT_PUBLIC_ML_API_URL | No | http://localhost:8000 | Optional ML base URL |

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

### API Server

File: api_server/.env

| Variable | Required | Default | Description |
|---|---|---|---|
| PORT | No | 3001 | API server port |
| MONGODB_URI | No | mongodb://localhost:27017/travel_ai | MongoDB connection string |
| ML_API_URL | No | http://localhost:8000 | ML engine base URL |

Example:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/travel_ai
ML_API_URL=http://localhost:8000
```

### ML Engine

File: ml_engine/.env

| Variable | Required | Default | Description |
|---|---|---|---|
| WEATHER_API_KEY | No | empty | OpenWeatherMap key; mock weather is returned when unset |

Example:

```env
WEATHER_API_KEY=your_openweathermap_key
```

## Runbook

Start each service in a separate terminal from the repository root.

1. Start ML engine

```bash
npm run ml
```

2. Start API server

```bash
npm run backend
```

3. Start frontend

```bash
npm run dev
```

Primary URL: http://localhost:3000

## Root Scripts

| Command | Purpose |
|---|---|
| npm run dev | Start frontend in development |
| npm run backend | Start Express API server |
| npm run ml | Start FastAPI ML service via uvicorn |
| npm run build | Build frontend for production |
| npm run start | Run the built frontend |

## API Contract

Base URL: http://localhost:3001

| Method | Path | Description |
|---|---|---|
| GET | / | Health check |
| POST | /api/recommendations | Forward recommendation request to ML engine |
| POST | /api/itinerary | Forward itinerary generation request to ML engine |
| POST | /api/itinerary/save | Persist itinerary to MongoDB |
| GET | /api/itinerary/saved/:userId | Fetch saved itineraries by user |
| GET | /api/weather/:city | Get weather from ML engine |
| GET | /api/safety/:destination | Get safety signal from ML engine |
| GET | /api/flights/:destination | Mock flight estimate response |
| GET | /api/tips/:country | Curated travel tips |

## Data Model Notes

Primary persisted document: itineraries

- userId
- destination
- mood
- duration
- budget
- startDate
- itinerary (full generated payload)
- createdAt

## Security Notes

- Do not commit real API keys, credentials, or certificate files.
- Keep .env files local and excluded by .gitignore.
- Rotate any exposed credentials immediately.
- Use environment variables in all non-local environments.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Frontend requests fail | Incorrect API URL | Verify NEXT_PUBLIC_API_URL and API process status |
| API cannot call ML | ML service unavailable or wrong ML_API_URL | Start ML service and validate ML_API_URL |
| MongoDB connection errors | Invalid URI or network access issue | Validate MONGODB_URI and database access rules |
| Weather returns fallback | Missing or invalid WEATHER_API_KEY | Set a valid WEATHER_API_KEY in ml_engine/.env |

## Production Checklist

- Lock down CORS origins per environment
- Add request validation schemas on the API boundary
- Add centralized error handling and structured logs
- Add authentication and authorization for itinerary persistence
- Add rate limiting and abuse protection
- Add CI for lint, tests, and dependency security scanning
