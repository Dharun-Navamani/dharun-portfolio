const clientPromise = require('./lib/mongodb');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // 1. Try to get data from MongoDB
    try {
      const client = await clientPromise;
      const db = client.db('dharun-portfolio');
      const collection = db.collection('content');
      
      const dbData = await collection.findOne({ type: 'master' });
      
      if (dbData) {
        // Remove MongoDB internal ID before sending
        const { _id, type, ...content } = dbData;
        return res.status(200).json(content);
      }
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON:", dbError.message);
    }

    // 2. Fallback to local JSON file if DB fails or is empty
    const dataPath = path.join(process.cwd(), 'data', 'content.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Critical error in get-content:", error);
    res.status(500).json({ error: "Failed to load content" });
  }
};
