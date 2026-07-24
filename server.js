const env = require('./config/env');
const { connectDB } = require('./config/db');
const app = require('./app');

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  process.exit(1);
});

let server;

(async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    // eslint-disable-next-line no-console
    console.log(`[Server] API base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
    // eslint-disable-next-line no-console
    console.log(`[Server] Swagger docs: http://localhost:${env.PORT}/api-docs`);
  });
})();

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('Process terminated.');
    });
  }
});

module.exports = server;
