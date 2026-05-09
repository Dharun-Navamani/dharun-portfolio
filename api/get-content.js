const getClientPromise = require('./lib/mongodb');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // 1. Try to get data from MongoDB
    try {
      const client = await Promise.race([
        getClientPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000))
      ]);
      
      if (client) {
        const db = client.db('dharun-portfolio');
      const collection = db.collection('content');
      
      const dbData = await collection.findOne({ type: 'master' });
      
      if (dbData) {
        const { _id, type, ...content } = dbData;
        return res.status(200).json(content);
      }
      }
    } catch (dbError) {
      console.warn("Database connection failed or timed out, falling back to JSON:", dbError.message);
    }

    // 2. Fallback to local JSON file
    try {
      // Using require() is the most reliable way to include JSON files in Vercel bundles
      const jsonData = require('./content.json');
      return res.status(200).json(jsonData);
    } catch (requireError) {
      console.warn("require('./content.json') failed, trying fs fallback:", requireError.message);
      
      const dataPath = path.join(__dirname, 'content.json');
      if (fs.existsSync(dataPath)) {
        const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return res.status(200).json(jsonData);
      }
      
      return res.status(500).json({ error: "Content file not found", details: requireError.message });
    }

  } catch (error) {
    console.error("Critical error in get-content:", error);
    // ALWAYS return JSON, never let it crash to HTML
    res.status(500).json({ error: "Failed to load content", details: error.message });
  }
};
