const clientPromise = require('./lib/mongodb');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('dharun-portfolio');
    const collection = db.collection('content');

    // Read the current JSON data
    const dataPath = path.join(process.cwd(), 'data', 'content.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Update the database with the JSON content
    // We use replaceOne with upsert to ensure we only have one "master" content document
    const result = await collection.replaceOne(
      { type: 'master' },
      { type: 'master', ...jsonData },
      { upsert: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Data migrated from JSON to MongoDB successfully!",
      result
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
};
