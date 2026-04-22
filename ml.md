# ML Engine Presentation Notes (Travel AI)

This document explains the ML side of the project in simple and interview-ready language.

## 1) What the ML Engine Does

The ML Engine powers mood-based travel planning.

It provides:
- Destination recommendations from user mood, budget, and trip duration
- Day-by-day itinerary generation (morning/afternoon/evening)
- Safety score lookup by destination
- Weather data fetch (real API if key exists, mock fallback otherwise)

Main service file:
- ml_engine/main.py (FastAPI app)

Core model logic file:
- ml_engine/ml_models.py (TravelRecommendationEngine)

---

## 2) Is This "Machine Learning" or Rule-Based AI?

Current implementation is primarily a rule-based scoring engine with data-driven weights.

What is learned automatically right now:
- No model training pipeline is implemented in the current code
- No persisted trained model is loaded at runtime

What behaves like ML:
- Multi-feature weighted scoring
- Mood-to-feature mapping
- Dataframe-based ranking across destinations

How to explain in presentation:
- "This version uses a deterministic recommendation model (feature engineering + weighted scoring). It is ML-ready and can be upgraded to supervised ranking later using historical user feedback."

---

## 3) ML/Data Pipeline (Runtime)

1. User sends mood + optional preferences + budget + duration
2. Engine loads in-memory destination feature table (Pandas DataFrame)
3. Mood is mapped to feature weights (example: adventurous -> adventure_score weighted higher)
4. Every destination gets a total score using weighted sum
5. Budget logic adjusts score (penalty/boost)
6. Top 5 destinations are returned with estimated cost, activities, highlights, safety

For itinerary:
1. User selects destination + mood + duration + budget + start_date
2. Engine computes daily budget
3. Generates per-day activity blocks from mood activity pool
4. Returns structured itinerary JSON with daily costs and summary

---

## 4) Core Model: TravelRecommendationEngine

Class name:
- TravelRecommendationEngine

Important methods:
- _load_destinations(): creates destination feature table
- _create_mood_mapping(): mood -> feature weight map
- _calculate_destination_score(): weighted scoring + budget adjustment
- get_recommendations(): ranks and returns top destinations
- generate_itinerary(): creates day-wise plan and cost split
- get_safety_score(): returns score + safety level text

### 4.1 Feature Columns Used for Scoring

Each destination contains:
- adventure_score
- relaxation_score
- romance_score
- culture_score
- nightlife_score
- budget_low
- budget_high
- best_season
- safety_score

### 4.2 Scoring Logic (Simple Formula)

For destination D and mood M:

Base score:
score(D, M) = sum(feature_value_i * weight_i_for_mood)

Budget adjustment:
- daily_budget = total_budget / 7 (in recommendation phase)
- If daily_budget < budget_low: score *= 0.3
- Else if daily_budget > budget_high: score *= 1.1

Notes:
- If mood is unknown, default mood = happy
- Top 5 by descending score are returned

---

## 5) Python Libraries Used and Why

From ml_engine/requirements.txt and code usage:

### FastAPI (fastapi)
Use:
- Defines REST endpoints for ML engine
- Handles request/response lifecycle

Where:
- main.py

### Uvicorn (uvicorn)
Use:
- ASGI server to run FastAPI app

Where:
- main.py (__main__ block)

### Pydantic (pydantic)
Use:
- Request schema validation for input models
- Ensures type-safe payload parsing

Where:
- main.py (MoodInput, ItineraryRequest)

### Pandas (pandas)
Use:
- Stores destination dataset as DataFrame
- Supports row iteration/filtering/selecting destination records

Where:
- ml_models.py

### NumPy (numpy)
Use:
- Imported, but currently not required by core scoring path
- Kept for numeric operations and future model expansion

Where:
- main.py, ml_models.py imports

### Requests (requests)
Use:
- Calls OpenWeatherMap endpoint for real weather

Where:
- main.py (/api/weather/{city})

### python-dotenv (python-dotenv)
Use:
- Loads WEATHER_API_KEY from .env

Where:
- main.py

### scikit-learn (scikit-learn)
Use right now:
- Dependency is present but no sklearn estimator is used in current runtime code

Why keep it:
- Planned future extension: trainable recommendation/ranking model

### joblib (joblib)
Use right now:
- Included dependency, not used in current runtime code

Typical future use:
- Save/load trained sklearn models

### python-multipart
Use right now:
- Not actively used by existing endpoints

Why often included:
- Required when handling form-data file uploads in FastAPI

---

## 6) API Endpoints (ML Engine)

Base service in ml_engine/main.py:
- GET /
- POST /api/recommendations
- POST /api/itinerary
- GET /api/weather/{city}
- GET /api/safety/{destination}

### Input Models

POST /api/recommendations body:
- mood: str
- preferences: dict (optional)
- budget: float (optional)
- duration: int (optional)
- season: str (optional)

POST /api/itinerary body:
- destination: str
- mood: str
- duration: int
- budget: float
- start_date: str (YYYY-MM-DD)
- preferences: dict (optional)

---

## 7) Design Choices You Can Defend in Q&A

- Deterministic and explainable: every recommendation can be traced to feature weights
- Fast inference: scoring all rows in-memory is low latency
- No cold-start training problem: works immediately without historical data
- Easy to tune: product team can adjust mood weights without retraining
- Safe fallback behavior: unknown mood defaults to happy; weather has mock fallback

---

## 8) Current Limitations (Be Honest)

- No user-personalization learning loop yet
- No feedback-based model update
- Budget normalization uses fixed 7-day divisor in recommendation path
- Destination dataset is static and small (hard-coded)
- Some dependencies are future-ready but not used at runtime (sklearn, joblib)

---

## 9) Improvement Roadmap (If Asked "What Next?")

1. Collect implicit feedback (click, save, book) + explicit ratings
2. Train ranking model (for example: Gradient Boosting / XGBoost / LightGBM)
3. Persist model with joblib and load at startup
4. Replace static weights with learned weights
5. Add contextual features: seasonality, festival calendar, weather history
6. Add evaluation metrics: Precision@K, NDCG@K, CTR uplift, conversion rate
7. Add A/B testing between rule-based and trained ranker

---

## 10) Possible Interview/Panel Questions with Strong Answers

Q1. Why call this ML if no training is shown?
A. The current implementation is an explainable recommendation model using feature engineering and weighted ranking. It is part of an ML system architecture and is designed to evolve into a trainable ranker once behavior data is available.

Q2. Why use Pandas instead of a database query for ranking?
A. For this scale, Pandas gives quick iteration and clear feature operations. As data grows, we can shift feature storage to a database/vector store and keep ranking logic in a dedicated service.

Q3. How do you handle unknown moods?
A. Unknown moods are mapped to a safe default (happy), so the system always returns usable recommendations.

Q4. How is budget integrated?
A. Budget impacts score with penalty/boost rules after the base weighted score, which makes recommendations practical for user affordability.

Q5. Is the model explainable?
A. Yes. We can show exactly which feature scores and mood weights produced each recommendation.

Q6. Why include sklearn/joblib now?
A. They are included to support near-term upgrade to a trained model pipeline and model persistence without changing deployment shape.

Q7. How would you evaluate model quality?
A. Online: click/save/book conversion and session completion. Offline: ranking metrics such as Precision@K and NDCG@K using historical interaction logs.

Q8. What is the biggest technical risk currently?
A. Static dataset and hand-tuned weights may not generalize to diverse users, so feedback loop and retraining are the highest priority.

---

## 11) One-Minute Presentation Script

"Our ML engine is a FastAPI-based recommendation service built around an explainable weighted ranking model. We map user mood into feature weights like adventure, relaxation, culture, romance, and nightlife. For each destination, we compute a score, adjust it by budget constraints, and return the top options with estimated costs, activities, and safety details. We also generate a full day-by-day itinerary based on mood and budget. The architecture is intentionally ML-ready: we already use structured features and clean APIs, so the next step is replacing hand-tuned weights with a trained ranking model using user feedback data." 

---

## 12) Quick Cheat Sheet

- Engine type: Explainable weighted recommendation engine
- Main class: TravelRecommendationEngine
- Core data structure: Pandas DataFrame
- API framework: FastAPI + Pydantic
- Weather: OpenWeatherMap via requests + fallback
- Safety: Static score mapping from destination features
- Current training pipeline: Not implemented yet
- Upgrade path: Train ranker + persist with joblib + A/B test
