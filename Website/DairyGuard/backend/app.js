const express = require('express');
const cors = require('cors');
const config = require('./config/default');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security and CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger (Development mode)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api', routes);

// 404 Route handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
