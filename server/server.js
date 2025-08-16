const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Import custom modules
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const nasaRoutes = require('./routes/nasaRoutes');
const interventionRoutes = require('./routes/interventionRoutes');
const cityRoutes = require('./routes/cityRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.nasa.gov", "https://gpm.nasa.gov", "https://lpdaac.usgs.gov"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// NASA API specific rate limiting (stricter)
const nasaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 NASA API requests per minute
  message: {
    error: 'NASA API rate limit exceeded. Please wait before making more requests.',
  },
});
app.use('/api/nasa/', nasaLimiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, 'https://your-production-domain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'NASA Healthy Cities Server is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'NASA Healthy Cities API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      nasa: {
        temperature: 'GET /api/nasa/temperature',
        precipitation: 'GET /api/nasa/precipitation',
        vegetation: 'GET /api/nasa/vegetation',
        elevation: 'GET /api/nasa/elevation',
        airQuality: 'GET /api/nasa/air-quality',
        riskIndices: 'GET /api/nasa/risk-indices',
      },
      cities: {
        list: 'GET /api/cities',
        details: 'GET /api/cities/:id',
        search: 'GET /api/cities/search',
      },
      interventions: {
        types: 'GET /api/interventions/types',
        calculate: 'POST /api/interventions/calculate',
        optimize: 'POST /api/interventions/optimize',
      },
      analysis: {
        costBenefit: 'POST /api/analysis/cost-benefit',
        riskAssessment: 'POST /api/analysis/risk-assessment',
        policyBrief: 'POST /api/analysis/policy-brief',
      },
    },
    documentation: '/api/docs',
  });
});

// API Routes
app.use('/api/nasa', nasaRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/analysis', analysisRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} was not found on this server.`,
    availableEndpoints: '/api',
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 NASA Healthy Cities Server running on port ${PORT}`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('🌍 Ready to serve NASA Earth observation data!');
  logger.info(`🔗 API Documentation: http://localhost:${PORT}/api`);
  logger.info('✅ Server startup complete - No database required!');
});

module.exports = app;
