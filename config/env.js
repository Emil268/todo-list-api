require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  API_PREFIX: process.env.API_PREFIX || '/api/v1',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_list_db',
  MONGO_URI_TEST:
    process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/todo_list_db_test',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_COOKIE_EXPIRES_IN: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 1,

  API_KEY: process.env.API_KEY || 'dev_api_key_change_me',

  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
