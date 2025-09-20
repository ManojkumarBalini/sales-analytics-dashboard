const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    let dbStatus = 'unknown';
    
    switch(dbState) {
      case 0: dbStatus = 'disconnected'; break;
      case 1: dbStatus = 'connected'; break;
      case 2: dbStatus = 'connecting'; break;
      case 3: dbStatus = 'disconnecting'; break;
    }
    
    res.status(200).json({
      status: 'OK',
      message: 'Backend server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      database: {
        status: dbStatus,
        state: dbState
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
