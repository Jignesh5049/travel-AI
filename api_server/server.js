const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const DEFAULT_PORT = 3001;
const DEFAULT_ML_API_URL = 'http://localhost:8000';
const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/travel_ai';

const PORT = process.env.PORT || DEFAULT_PORT;
const ML_API_URL = process.env.ML_API_URL || DEFAULT_ML_API_URL;
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const itinerarySchema = new mongoose.Schema({
  userId: String,
  destination: String,
  mood: String,
  duration: Number,
  budget: Number,
  startDate: String,
  itinerary: Object,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userId: String,
  preferences: Object,
  savedItineraries: [String],
  createdAt: { type: Date, default: Date.now }
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Travel AI API Server is running' });
});

// Get recommendations from ML engine
app.post('/api/recommendations', async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/api/recommendations`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Generate itinerary
app.post('/api/itinerary', async (req, res) => {
  try {
    const response = await axios.post(`${ML_API_URL}/api/itinerary`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// Save itinerary
app.post('/api/itinerary/save', async (req, res) => {
  try {
    const { userId, itinerary } = req.body;
    const savedItinerary = new Itinerary({
      userId: userId || 'anonymous',
      destination: itinerary.destination,
      mood: itinerary.mood,
      duration: itinerary.duration,
      budget: itinerary.total_budget,
      startDate: itinerary.start_date,
      itinerary: itinerary
    });
    await savedItinerary.save();
    res.json({ success: true, id: savedItinerary._id });
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ error: 'Failed to save itinerary' });
  }
});

// Get saved itineraries
app.get('/api/itinerary/saved/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching saved itineraries:', error);
    res.status(500).json({ error: 'Failed to fetch saved itineraries' });
  }
});

// Get weather
app.get('/api/weather/:city', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/api/weather/${req.params.city}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to get weather data' });
  }
});

// Get safety score
app.get('/api/safety/:destination', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/api/safety/${req.params.destination}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching safety data:', error);
    res.status(500).json({ error: 'Failed to get safety data' });
  }
});

// Get flight estimates (mock)
app.get('/api/flights/:destination', (req, res) => {
  const { destination } = req.params;
  // Mock flight prices
  const basePrice = Math.floor(Math.random() * 500) + 200;
  res.json({
    destination,
    economy: basePrice,
    business: basePrice * 2.5,
    first: basePrice * 5,
    currency: 'USD',
    note: 'Estimated prices, actual prices may vary'
  });
});

// Get travel tips
app.get('/api/tips/:country', (req, res) => {
  const { country } = req.params;
  const tips = {
    'India': [
      'Carry cash as many places don\'t accept cards',
      'Bargain at local markets',
      'Respect local customs and traditions',
      'Try street food but be cautious',
      'Use reputable transport services'
    ],
    'France': [
      'Learn basic French phrases',
      'Tipping is appreciated but not mandatory',
      'Many shops close for lunch',
      'Respect meal times',
      'Carry cash for small purchases'
    ],
    'Japan': [
      'Remove shoes when entering homes',
      'Carry cash, many places don\'t accept cards',
      'Be punctual, it\'s very important',
      'Don\'t eat while walking',
      'Bow when greeting'
    ]
  };

  res.json({
    country,
    tips: tips[country] || [
      'Research local customs',
      'Keep important documents safe',
      'Stay hydrated',
      'Respect local culture',
      'Have travel insurance'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

