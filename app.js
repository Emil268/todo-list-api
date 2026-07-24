const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const logger = require('./middlewares/logger.middleware');
const notFound = require('./middlewares/notFound.middleware');
const globalErrorHandler = require('./middlewares/error.middleware');

const app = express();

// ------------------------------------------------------------------
// Security & utility middlewares
// ------------------------------------------------------------------
app.use(helmet());
app.use(cors());
app.use(compression());

// Request logger (dedicated middleware, format depends on environment)
app.use(logger);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection & XSS
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Global rate limiter
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});
app.use(env.API_PREFIX, limiter);

// ------------------------------------------------------------------
// Health check
// ------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy.' });
});

// ------------------------------------------------------------------
// API Documentation (Swagger)
// ------------------------------------------------------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ------------------------------------------------------------------
// API Routes
// ------------------------------------------------------------------
app.use(env.API_PREFIX, routes);

// ------------------------------------------------------------------
// 404 handler (dedicated middleware)
// ------------------------------------------------------------------
app.all('*', notFound);

// ------------------------------------------------------------------
// Global error handler (must be last)
// ------------------------------------------------------------------
app.use(globalErrorHandler);

module.exports = app;
