import numpy as np
import pandas as pd
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random

class TravelRecommendationEngine:
    """ML Engine for mood-based travel recommendations"""
    
    def __init__(self):
        # Initialize destination database
        self.destinations = self._load_destinations()
        self.mood_mapping = self._create_mood_mapping()
        self.activity_mapping = self._create_activity_mapping()
        
    def _load_destinations(self) -> pd.DataFrame:
        """Load destination database with features"""
        destinations_data = {
            'name': [
                'Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'New York, USA',
                'Santorini, Greece', 'Dubai, UAE', 'Maldives', 'Switzerland',
                'Iceland', 'Thailand', 'Barcelona, Spain', 'Amsterdam, Netherlands',
                'Rome, Italy', 'London, UK', 'Sydney, Australia', 'Mumbai, India',
                'Goa, India', 'Kerala, India', 'Manali, India', 'Rishikesh, India'
            ],
            'country': [
                'Indonesia', 'France', 'Japan', 'USA', 'Greece', 'UAE', 'Maldives',
                'Switzerland', 'Iceland', 'Thailand', 'Spain', 'Netherlands',
                'Italy', 'UK', 'Australia', 'India', 'India', 'India', 'India', 'India'
            ],
            'adventure_score': [8, 3, 6, 7, 4, 5, 2, 9, 10, 7, 6, 5, 4, 5, 6, 6, 7, 5, 8, 9],
            'relaxation_score': [9, 6, 5, 4, 10, 7, 10, 8, 7, 8, 7, 6, 6, 5, 7, 4, 8, 9, 7, 8],
            'romance_score': [8, 10, 7, 6, 10, 6, 9, 8, 7, 6, 7, 6, 8, 6, 7, 5, 7, 7, 6, 5],
            'culture_score': [7, 10, 9, 8, 8, 6, 3, 7, 6, 8, 9, 8, 10, 9, 6, 8, 5, 8, 4, 6],
            'nightlife_score': [7, 9, 8, 9, 5, 8, 3, 6, 4, 8, 9, 8, 7, 9, 7, 9, 8, 4, 3, 2],
            'budget_low': [30, 80, 70, 100, 60, 90, 150, 100, 80, 35, 65, 75, 70, 85, 90, 25, 20, 30, 25, 20],
            'budget_high': [80, 200, 150, 250, 150, 300, 500, 200, 150, 100, 150, 180, 150, 200, 180, 60, 50, 70, 50, 40],
            'best_season': [
                'Apr-Oct', 'Apr-Jun,Sep-Nov', 'Mar-May,Sep-Nov', 'Apr-Jun,Sep-Nov',
                'May-Sep', 'Nov-Mar', 'Nov-Apr', 'Jun-Sep', 'Jun-Aug', 'Nov-Mar',
                'May-Sep', 'Apr-Sep', 'Apr-Jun,Sep-Oct', 'May-Sep', 'Sep-Nov,Mar-May',
                'Oct-Mar', 'Nov-Feb', 'Oct-Mar', 'Mar-Jun,Sep-Nov', 'Mar-May,Sep-Nov'
            ],
            'safety_score': [7, 8, 9, 7, 8, 9, 9, 9, 9, 7, 8, 8, 7, 8, 9, 6, 7, 8, 7, 7]
        }
        return pd.DataFrame(destinations_data)
    
    def _create_mood_mapping(self) -> Dict:
        """Map moods to destination features"""
        return {
            'adventurous': {'weights': {'adventure_score': 0.4, 'culture_score': 0.2, 'relaxation_score': 0.1, 'romance_score': 0.1, 'nightlife_score': 0.2}},
            'calm': {'weights': {'relaxation_score': 0.5, 'culture_score': 0.2, 'adventure_score': 0.1, 'romance_score': 0.2}},
            'romantic': {'weights': {'romance_score': 0.5, 'relaxation_score': 0.3, 'culture_score': 0.2}},
            'stressed': {'weights': {'relaxation_score': 0.6, 'adventure_score': 0.1, 'culture_score': 0.3}},
            'excited': {'weights': {'adventure_score': 0.3, 'nightlife_score': 0.3, 'culture_score': 0.2, 'romance_score': 0.2}},
            'bored': {'weights': {'adventure_score': 0.4, 'culture_score': 0.3, 'nightlife_score': 0.3}},
            'happy': {'weights': {'adventure_score': 0.2, 'relaxation_score': 0.3, 'culture_score': 0.2, 'romance_score': 0.15, 'nightlife_score': 0.15}},
            'tired': {'weights': {'relaxation_score': 0.7, 'culture_score': 0.3}}
        }
    
    def _create_activity_mapping(self) -> Dict:
        """Map moods to activities"""
        return {
            'adventurous': [
                'Hiking and trekking', 'Water sports', 'Bungee jumping', 'Rock climbing',
                'Safari tours', 'Scuba diving', 'Paragliding', 'Mountain biking'
            ],
            'calm': [
                'Yoga and meditation', 'Beach relaxation', 'Spa treatments', 'Nature walks',
                'Reading by the beach', 'Sunset watching', 'Garden tours', 'Tea ceremonies'
            ],
            'romantic': [
                'Sunset dinners', 'Couple spa', 'Beach walks', 'Wine tasting',
                'Hot air balloon rides', 'Private boat tours', 'Candlelight dinners', 'Stargazing'
            ],
            'stressed': [
                'Meditation retreats', 'Spa and wellness', 'Nature therapy', 'Quiet beaches',
                'Forest bathing', 'Yoga classes', 'Hot springs', 'Peaceful gardens'
            ],
            'excited': [
                'Nightlife and clubs', 'Adventure sports', 'Festivals', 'City tours',
                'Food tours', 'Shopping', 'Entertainment shows', 'Theme parks'
            ],
            'bored': [
                'Cultural tours', 'Museums', 'Adventure activities', 'Local experiences',
                'Cooking classes', 'Art galleries', 'Historical sites', 'Street food tours'
            ]
        }
    
    def _calculate_destination_score(self, destination: pd.Series, mood: str, budget: Optional[float] = None) -> float:
        """Calculate recommendation score for a destination based on mood"""
        if mood.lower() not in self.mood_mapping:
            mood = 'happy'  # Default mood
        
        weights = self.mood_mapping[mood.lower()]['weights']
        score = 0
        
        for feature, weight in weights.items():
            if feature in destination.index:
                score += destination[feature] * weight
        
        # Budget filtering
        if budget:
            daily_budget = budget / 7  # Assuming 7 days
            if daily_budget < destination['budget_low']:
                score *= 0.3  # Penalize if too expensive
            elif daily_budget > destination['budget_high']:
                score *= 1.1  # Slight boost if well within budget
        
        return score
    
    def get_recommendations(self, mood: str, preferences: Optional[Dict] = None, 
                          budget: Optional[float] = None, duration: Optional[int] = None,
                          season: Optional[str] = None) -> Dict:
        """Get top destination recommendations"""
        preferences = preferences or {}
        
        # Calculate scores for all destinations
        scores = []
        for idx, dest in self.destinations.iterrows():
            score = self._calculate_destination_score(dest, mood, budget)
            scores.append((idx, score, dest))
        
        # Sort by score
        scores.sort(key=lambda x: x[1], reverse=True)
        
        # Get top 5 recommendations
        top_destinations = []
        for idx, score, dest in scores[:5]:
            activities = self.activity_mapping.get(mood.lower(), ['Sightseeing', 'Local experiences'])
            
            # Estimate cost
            daily_cost = (dest['budget_low'] + dest['budget_high']) / 2
            total_cost = daily_cost * (duration or 7)
            
            top_destinations.append({
                'name': dest['name'],
                'country': dest['country'],
                'score': round(score, 2),
                'estimated_cost': round(total_cost, 2),
                'best_season': dest['best_season'],
                'safety_score': int(dest['safety_score']),
                'activities': random.sample(activities, min(3, len(activities))),
                'highlights': self._get_highlights(dest['name'], mood)
            })
        
        return {
            'mood': mood,
            'recommendations': top_destinations,
            'suggested_activities': self.activity_mapping.get(mood.lower(), []),
            'travel_tips': self._get_travel_tips(mood)
        }
    
    def _get_highlights(self, destination: str, mood: str) -> List[str]:
        """Get destination highlights based on mood"""
        highlights_db = {
            'Bali, Indonesia': ['Beautiful beaches', 'Rich culture', 'Affordable luxury', 'Great food'],
            'Paris, France': ['Romantic atmosphere', 'World-class museums', 'Fine dining', 'Historic architecture'],
            'Tokyo, Japan': ['Unique culture', 'Amazing food', 'Technology hub', 'Clean and safe'],
            'Santorini, Greece': ['Stunning sunsets', 'White-washed buildings', 'Volcanic beaches', 'Romantic setting'],
            'Maldives': ['Crystal clear waters', 'Luxury resorts', 'Perfect for relaxation', 'Water activities']
        }
        return highlights_db.get(destination, ['Beautiful destination', 'Rich culture', 'Great experiences'])
    
    def _get_travel_tips(self, mood: str) -> List[str]:
        """Get travel tips based on mood"""
        tips = {
            'adventurous': [
                'Pack comfortable hiking gear',
                'Get travel insurance for adventure activities',
                'Stay hydrated during activities'
            ],
            'calm': [
                'Book accommodations in peaceful areas',
                'Plan for plenty of rest time',
                'Consider wellness retreats'
            ],
            'romantic': [
                'Book restaurants in advance',
                'Look for sunset viewing spots',
                'Consider couples packages'
            ]
        }
        return tips.get(mood.lower(), ['Plan ahead', 'Stay flexible', 'Enjoy your trip'])
    
    def generate_itinerary(self, destination: str, mood: str, duration: int,
                          budget: float, start_date: str, preferences: Optional[Dict] = None) -> Dict:
        """Generate day-by-day itinerary"""
        preferences = preferences or {}
        start = datetime.strptime(start_date, '%Y-%m-%d')
        
        # Get destination info
        dest_info = self.destinations[self.destinations['name'] == destination]
        if dest_info.empty:
            dest_info = self.destinations.iloc[0]  # Default
        else:
            dest_info = dest_info.iloc[0]
        
        daily_budget = budget / duration
        activities = self.activity_mapping.get(mood.lower(), ['Sightseeing', 'Local experiences'])
        
        itinerary = []
        for day in range(duration):
            date = start + timedelta(days=day)
            day_num = day + 1
            
            # Generate activities for the day
            day_activities = self._generate_day_activities(mood, day_num, duration)
            
            itinerary.append({
                'day': day_num,
                'date': date.strftime('%Y-%m-%d'),
                'morning': {
                    'activity': day_activities['morning'],
                    'time': '09:00 - 12:00',
                    'cost': round(daily_budget * 0.2, 2)
                },
                'afternoon': {
                    'activity': day_activities['afternoon'],
                    'time': '13:00 - 17:00',
                    'cost': round(daily_budget * 0.3, 2)
                },
                'evening': {
                    'activity': day_activities['evening'],
                    'time': '18:00 - 22:00',
                    'cost': round(daily_budget * 0.25, 2)
                },
                'accommodation': {
                    'type': self._get_accommodation_type(budget, mood),
                    'cost': round(daily_budget * 0.25, 2)
                },
                'total_daily_cost': round(daily_budget, 2)
            })
        
        return {
            'destination': destination,
            'mood': mood,
            'duration': duration,
            'total_budget': budget,
            'start_date': start_date,
            'itinerary': itinerary,
            'summary': {
                'total_estimated_cost': round(budget, 2),
                'average_daily_cost': round(daily_budget, 2),
                'recommended_transport': self._get_transport_recommendation(destination),
                'travel_tips': self._get_travel_tips(mood)
            }
        }
    
    def _generate_day_activities(self, mood: str, day: int, total_days: int) -> Dict:
        """Generate activities for a specific day"""
        activity_pool = {
            'adventurous': {
                'morning': ['Early morning hike', 'Adventure sports', 'Exploration tour'],
                'afternoon': ['Water activities', 'Mountain biking', 'Rock climbing'],
                'evening': ['Adventure campfire', 'Local adventure stories', 'Stargazing']
            },
            'calm': {
                'morning': ['Yoga session', 'Beach walk', 'Meditation'],
                'afternoon': ['Spa treatment', 'Nature walk', 'Reading time'],
                'evening': ['Sunset watching', 'Quiet dinner', 'Relaxation']
            },
            'romantic': {
                'morning': ['Romantic breakfast', 'Couple spa', 'Beach stroll'],
                'afternoon': ['Private tour', 'Wine tasting', 'Scenic drive'],
                'evening': ['Sunset dinner', 'Romantic walk', 'Stargazing']
            }
        }
        
        default_activities = {
            'morning': ['Breakfast and exploration', 'Local tour', 'Sightseeing'],
            'afternoon': ['Lunch and activities', 'Cultural visit', 'Shopping'],
            'evening': ['Dinner', 'Entertainment', 'Relaxation']
        }
        
        mood_activities = activity_pool.get(mood.lower(), default_activities)
        
        return {
            'morning': random.choice(mood_activities['morning']),
            'afternoon': random.choice(mood_activities['afternoon']),
            'evening': random.choice(mood_activities['evening'])
        }
    
    def _get_accommodation_type(self, budget: float, mood: str) -> str:
        """Get accommodation recommendation"""
        daily_budget = budget / 7
        
        if daily_budget > 150:
            return 'Luxury resort or 5-star hotel'
        elif daily_budget > 80:
            return '4-star hotel or boutique stay'
        elif daily_budget > 40:
            return '3-star hotel or comfortable guesthouse'
        else:
            return 'Budget hotel or hostel'
    
    def _get_transport_recommendation(self, destination: str) -> str:
        """Get transport recommendation"""
        if 'India' in destination:
            return 'Domestic flight + local transport'
        else:
            return 'International flight + local transport'
    
    def get_safety_score(self, destination: str) -> Dict:
        """Get safety information for destination"""
        dest_info = self.destinations[self.destinations['name'] == destination]
        if dest_info.empty:
            safety_score = 7
        else:
            safety_score = int(dest_info.iloc[0]['safety_score'])
        
        safety_levels = {
            9: 'Very Safe',
            8: 'Safe',
            7: 'Generally Safe',
            6: 'Moderate Caution',
            5: 'Exercise Caution'
        }
        
        return {
            'destination': destination,
            'safety_score': safety_score,
            'safety_level': safety_levels.get(safety_score, 'Moderate Caution'),
            'tips': [
                'Keep important documents safe',
                'Be aware of local customs',
                'Stay in well-reviewed accommodations'
            ]
        }

