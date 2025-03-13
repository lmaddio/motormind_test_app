import * as dotenv from 'dotenv';
import * as mongodb from 'mongodb';

dotenv.config();
const { MongoClient, ServerApiVersion } = mongodb;

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
};

let client: mongodb.MongoClient;

export const connectToMongoDB = async () => {
  if (!client) {
    try {
      client = await MongoClient.connect(uri, options);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
    }
  }

  return client;
};

export const getConnectedClient = () => client;