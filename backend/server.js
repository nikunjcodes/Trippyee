const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const natural = require('natural');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://nikunj:mongo123@cluster0.rf2xhnp.mongodb.net/cities"; 
const client = new MongoClient(uri);

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'by']);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
  }
}

connectToMongo();

app.get('/api/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    const keywords = tokenizer.tokenize(query.toLowerCase())
      .filter(word => !stopwords.has(word) && word.length > 2);
    console.log(keywords);
    const db = client.db("cities");
    const collection = db.collection("cities");

    const searchQuery = {
      $or: [
        { City: { $regex: keywords.join('|'), $options: 'i' } },
        { City_desc: { $regex: keywords.join('|'), $options: 'i' } },
        { Best_time_to_visit: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    };

    const cities = await collection.find(searchQuery).limit(10).toArray();
  
    res.json(cities);

  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "An error occurred while searching for cities" });
  }
});
app.get('/api/autocomplete', async (req, res) => {
  const query = req.query.q;

  try {
    const db = client.db("cities"); // Access the database
    const collection = db.collection("cities"); // Access the collection

    // Use regex to match city names starting with the query
    const results = await collection.find({
      City: { $regex: new RegExp(`^${query}`, 'i') }
    }).limit(10).toArray();

    // Send the results back
    res.json(results.map(result => result.City)); // Send back only city names for suggestions

  } catch (err) {
    console.error('Error in autocomplete:', err);
    res.status(500).send('Server error');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});