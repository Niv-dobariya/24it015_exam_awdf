require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

// Core Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Global custom request logger middleware: [METHOD] [PATH] [TIMESTAMP]
app.use(requestLogger);

// API Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'EventHub Ticket Booking System API',
    version: 'v1',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'standby',
    endpoints: {
      auth: '/api/v1/auth',
      events: '/api/v1/events',
      tickets: '/api/v1/tickets'
    }
  });
});

// Mount Routes at /api/v1/
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);

// Global Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Database Connection & Server Bootstrap
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB connected successfully to ${MONGO_URI}`);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] EventHub Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB at ${MONGO_URI}:`, error.message);
    console.log('[Notice] Starting Express server in standby mode so endpoints can still be inspected...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] EventHub Backend running on http://localhost:${PORT} (Database pending)`);
    });
  }
};

startServer();

module.exports = app;
