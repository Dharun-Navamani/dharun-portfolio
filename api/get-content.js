const clientPromise = require('./lib/mongodb');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // 1. Try to get data from MongoDB
    try {
      // Add a timeout for the database connection
      const client = await Promise.race([
        clientPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000))
      ]);
      
      const db = client.db('dharun-portfolio');
      const collection = db.collection('content');
      
      const dbData = await collection.findOne({ type: 'master' });
      
      if (dbData) {
        const { _id, type, ...content } = dbData;
        return res.status(200).json(content);
      }
    } catch (dbError) {
      console.warn("Database connection failed or timed out, falling back to JSON:", dbError.message);
    }

    // 2. Fallback to local JSON file
    // Using __dirname is more reliable in Vercel serverless environments
    const dataPath = path.join(__dirname, '..', 'data', 'content.json');
    
    if (fs.existsSync(dataPath)) {
      const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return res.status(200).json(jsonData);
    } else {
      console.error("Fallback JSON file not found at:", dataPath);
      return res.status(500).json({ error: "Content file not found" });
    }

  } catch (error) {
    console.error("Critical error in get-content:", error);
    // ALWAYS return JSON, never let it crash to HTML
    res.status(500).json({ error: "Failed to load content", details: error.message });
  }
};
