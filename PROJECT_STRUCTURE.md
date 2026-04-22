# Project Structure

```
travel_AI/
├── frontend/                 # Next.js 14 Frontend Application
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Main page with step-by-step flow
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── error.tsx         # Error boundary
│   │   └── loading.tsx       # Loading state
│   ├── components/           # React Components
│   │   ├── MoodSelector.tsx  # Mood selection with emojis
│   │   ├── BudgetSlider.tsx  # Budget input slider
│   │   ├── DurationSelector.tsx # Trip duration selector
│   │   ├── Recommendations.tsx  # Destination recommendations display
│   │   ├── ItineraryView.tsx    # Full itinerary view with PDF export
│   │   ├── TravelTimeline.tsx   # Timeline visualization
│   │   ├── LoadingSpinner.tsx   # Loading component
│   │   └── ErrorBoundary.tsx    # Error handling
│   ├── lib/
│   │   └── api.ts            # API client functions
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── api_server/               # Node.js/Express API Server
│   ├── server.js             # Express server with routes
│   └── package.json
│
├── ml_engine/                # FastAPI ML Engine
│   ├── main.py               # FastAPI application
│   ├── ml_models.py          # ML recommendation engine
│   └── requirements.txt      # Python dependencies
│
├── README.md                 # Main documentation
├── SETUP.md                  # Detailed setup guide
├── QUICKSTART.md             # Quick start guide
└── package.json              # Root package.json with scripts
```

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: React Icons

### Backend API (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Purpose**: Middleware between frontend and ML engine
- **Features**: Itinerary saving, API routing, data aggregation

### ML Engine (FastAPI)
- **Framework**: FastAPI
- **ML Library**: scikit-learn, pandas, numpy
- **Purpose**: Core AI/ML logic for recommendations
- **Features**: 
  - Mood-based destination scoring
  - Itinerary generation
  - Weather integration
  - Safety scoring

## Data Flow

1. User selects mood → Frontend
2. User sets preferences → Frontend
3. Frontend → API Server → ML Engine
4. ML Engine processes → Returns recommendations
5. User selects destination → Frontend
6. Frontend → API Server → ML Engine (generate itinerary)
7. ML Engine → Returns day-by-day itinerary
8. User can save, share, or download PDF

## Key Features

### Mood-Based Recommendations
- 8 predefined moods + custom input
- ML scoring algorithm
- Budget-aware filtering
- Season-based suggestions

### Smart Itinerary Generator
- Day-by-day planning
- Morning/Afternoon/Evening activities
- Accommodation recommendations
- Cost breakdown per day

### Additional Features
- Weather integration (OpenWeatherMap)
- Safety scores
- PDF export
- Save to profile
- Share functionality
- Responsive design
- Smooth animations

## API Endpoints

### ML Engine (Port 8000)
- `POST /api/recommendations` - Get destination recommendations
- `POST /api/itinerary` - Generate itinerary
- `GET /api/weather/{city}` - Get weather data
- `GET /api/safety/{destination}` - Get safety score

### API Server (Port 3001)
- `POST /api/recommendations` - Proxy to ML engine
- `POST /api/itinerary` - Proxy to ML engine
- `POST /api/itinerary/save` - Save itinerary to DB
- `GET /api/itinerary/saved/:userId` - Get saved itineraries
- `GET /api/weather/:city` - Proxy weather request
- `GET /api/safety/:destination` - Proxy safety request
- `GET /api/flights/:destination` - Mock flight prices
- `GET /api/tips/:country` - Travel tips

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - API server URL
- `NEXT_PUBLIC_ML_API_URL` - ML engine URL

### API Server
- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `ML_API_URL` - ML engine URL
- `WEATHER_API_KEY` - OpenWeatherMap API key (optional)

### ML Engine
- `WEATHER_API_KEY` - OpenWeatherMap API key (optional)

## Running the Application

See `QUICKSTART.md` for detailed instructions.

**Quick Start:**
1. Install dependencies in all three directories
2. Set up environment variables
3. Start MongoDB
4. Run ML engine (port 8000)
5. Run API server (port 3001)
6. Run frontend (port 3000)
7. Open http://localhost:3000

