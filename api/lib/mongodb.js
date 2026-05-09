const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

function getClientPromise() {
    if (clientPromise) return clientPromise;

    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI is missing. Database features will be disabled.');
        clientPromise = Promise.resolve(null); // Return null instead of rejecting
        return clientPromise;
    }

    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
    return clientPromise;
}

module.exports = getClientPromise;
