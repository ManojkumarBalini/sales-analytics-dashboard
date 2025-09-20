const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const validation = require('../middleware/validation');

// Generate analytics report
router.post('/generate', validation.validateDateRange, analyticsController.generateReport);

// Get all analytics reports
router.get('/reports', analyticsController.getReports);

// Get specific report by ID
router.get('/reports/:id', analyticsController.getReportById);

module.exports = router;