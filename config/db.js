const mongoose = require('mongoose');
const env = require('./env');

/**
 * Establish connection to MongoDB using Mongoose.
 * Exits the process on failure (except in test environment,
 * where the caller/test-runner manages the connection lifecycle).
 */
const connectDB = async () => {
  const uri = env.NODE_ENV === 'test' ? env.MONGO_URI_TEST : env.MONGO_URI;

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri, {
      // Modern Mongoose (6+/8+) no longer needs useNewUrlParser / useUnifiedTopology
      // but they are harmless if left, so omitted here for cleanliness.
    });

    // eslint-disable-next-line no-console
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
