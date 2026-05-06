const clientPromise = require('./lib/mongodb');

module.exports = async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('dharun-portfolio'); // You can change this to your desired DB name

    // Test the connection by getting server status
    const result = await db.command({ ping: 1 });
    
    res.status(200).json({ 
      success: true, 
      message: "Successfully connected to MongoDB!", 
      result 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ 
      success: false, 
      error: e.message 
    });
  }
};
