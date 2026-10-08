import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      dbName: 'competitive_vocab',
      serverSelectionTimeoutMS: 5000,
      autoIndex: config.nodeEnv !== 'production'
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`[Database Warning] MongoDB connection failed: ${error.message}`);
    console.log('[Database Notice] The API server is running. If local MongoDB is not running yet, configure MONGODB_URI in server/.env with a valid local or Atlas connection string.');
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`[Database Error] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[Database Disconnected] Lost connection to MongoDB.');
});

export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const readyState = mongoose.connection.readyState;
  return {
    state: states[readyState] || 'unknown',
    readyState,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null
  };
};
