const mongoose = require('mongoose');
require('dotenv').config();

let mongoServer;
let usingMemoryServer = false;

/**
 * Connects to a MongoDB instance for the test suite.
 *
 * Primary strategy: spin up an in-memory MongoDB via `mongodb-memory-server`
 * (no external MongoDB required, fully isolated per test run).
 *
 * Fallback strategy: if the in-memory binary cannot be downloaded/started
 * (e.g. restricted network / offline CI environment), fall back to a real
 * MongoDB instance defined by `MONGO_URI_TEST` (see `.env.example`).
 */
const connectTestDB = async () => {
  try {
    // eslint-disable-next-line global-require
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    usingMemoryServer = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[tests/setup] mongodb-memory-server unavailable (${err.message}). ` +
        'Falling back to MONGO_URI_TEST — make sure a real MongoDB instance is reachable.'
    );
    const fallbackUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/todo_list_db_test';
    await mongoose.connect(fallbackUri);
    usingMemoryServer = false;
  }
};

const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (usingMemoryServer && mongoServer) await mongoServer.stop();
};

const clearTestDB = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
};

module.exports = { connectTestDB, closeTestDB, clearTestDB };
