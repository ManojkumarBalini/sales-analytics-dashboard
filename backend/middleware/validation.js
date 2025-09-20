const validateDateRange = (req, res, next) => {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    if (start > end) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }
    
    // Add dates to request object for later use
    req.dates = { start, end };
    next();
  };
  
  module.exports = {
    validateDateRange
  };