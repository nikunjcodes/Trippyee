
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const natural = require('natural');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URL, MONGO_DB, MONGO_COLLECTION, PORT = 5000 } = process.env;
const client = new MongoClient(MONGO_URL);
const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'by']);

const cleanDescription = (description) => description ? description.replace(/[\[\]"\\'']/g, '') : '';
const cleanPlaceDescription = (description) => description ? description.replace(/[\[\]\"\'0-9.]/g, '') : '';


async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1); // Exit if unable to connect
  }
}
connectToMongo();


app.get('/api/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const keywords = tokenizer.tokenize(query.toLowerCase()).filter(word => !stopwords.has(word) && word.length > 2);
    const db = client.db(MONGO_DB);
    const collection = db.collection("cities");

    const exactMatchQuery = { City: { $regex: new RegExp(`^${query}$`, 'i') } };
    const partialMatchQuery = {
      $or: [
        { City: { $regex: keywords.join('|'), $options: 'i' } },
        { City_desc: { $regex: keywords.join('|'), $options: 'i' } },
        { Best_time_to_visit: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    };

    const [exactMatches, partialMatches] = await Promise.all([
      collection.find(exactMatchQuery).toArray(),
      collection.find({ $and: [partialMatchQuery, { City: { $not: { $regex: new RegExp(`^${query}$`, 'i') } } }] }).toArray()
    ]);


    const prioritizedCities = [...exactMatches, ...partialMatches].map(city => ({
      ...city,
      matchCount: keywords.reduce((count, keyword) =>
        count + ['City', 'City_desc', 'Best_time_to_visit'].reduce((sum, field) =>
          sum + (city[field]?.toLowerCase().includes(keyword) ? 1 : 0), 0), 0
      ),
      City_desc: cleanDescription(city.City_desc)
    }));

    res.json(prioritizedCities);
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "An error occurred while searching for cities" });
  }
});

app.get('/api/autocomplete', async (req, res) => {
  const { q: query } = req.query;
  if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

  try {
    const db = client.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);
    const results = await collection.find({ City: { $regex: new RegExp(`^${query}`, 'i') } }).limit(10).toArray();
    res.json(results.map(result => result.City));
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/places/:cityName', async (req, res) => {
  const { cityName } = req.params;
  if (!cityName) return res.status(400).json({ error: "City name parameter is required" });

  try {
    const db = client.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);
    const places = await collection.find({ City: cityName }).toArray();
    const cleanedPlaces = places.map(place => ({
      ...place,
      Place_Desc: cleanDescription(place.Place_Desc)
    }));
    res.json(cleanedPlaces);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "An error occurred while fetching places" });
  }
});

app.post('/api/itinerary', async (req, res) => {
  const { cityName, tripDetails } = req.body;
  if (!cityName || !tripDetails) return res.status(400).json({ error: "City name and trip details are required" });

  try {
    const db = client.db(MONGO_DB);
    const placesCollection = db.collection("places");
    const places = await placesCollection.find({ City: cityName }).toArray();

    const durationInDays = Math.ceil(
      (new Date(tripDetails.endDate) - new Date(tripDetails.startDate)) / (1000 * 60 * 60 * 24)
    );
    const maxPlacesPerDay = 4;
    const sortedPlaces = places.sort((a, b) => b.Ratings - a.Ratings);

    const itinerary = Array.from({ length: durationInDays }, (_, day) => ({
      day: day + 1,
      activities: sortedPlaces.slice(day * maxPlacesPerDay, (day + 1) * maxPlacesPerDay).map(place => ({
        name: cleanPlaceDescription(place.Place),
        description: place.Place_Desc,
        rating: place.Ratings,
        distance: place.Distance
      }))
    })).filter(day => day.activities.length);

    res.json(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "An error occurred while generating the itinerary" });
  }
});

app.post('/api/match-cities', async (req, res) => {
  const { tripDuration } = req.body;
  if (!tripDuration) return res.status(400).json({ error: "Trip duration is required" });

  try {
    const db = client.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);

    const matchQuery = {
      Min_no_of_days: { $lte: tripDuration },
      Max_no_of_days: { $gte: tripDuration + 2 }
    };
    const cities = await collection.find(matchQuery).toArray();

    res.json(cities);
  } catch (error) {
    console.error("Error matching cities:", error);
    res.status(500).json({ error: "An error occurred while matching cities" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
