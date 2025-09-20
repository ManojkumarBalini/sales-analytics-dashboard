const Order = require('../models/Order');
const AnalyticsReport = require('../models/AnalyticsReport');

// Generate analytics report
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Validate date range
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

    // Aggregation pipeline
    const aggregationPipeline = [
      {
        $match: {
          orderDate: { 
            $gte: start, 
            $lte: new Date(end.getTime() + 24 * 60 * 60 * 1000) // Include the entire end day
          },
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $facet: {
          // Total orders and revenue
          summary: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                avgOrderValue: { $avg: '$totalAmount' }
              }
            }
          ],
          // Top products
          topProducts: [
            { $unwind: '$products' },
            {
              $group: {
                _id: '$products.productId',
                name: { $first: { $arrayElemAt: ['$productDetails.name', 0] } },
                quantity: { $sum: '$products.quantity' },
                revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
              }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
          ],
          // Top customers
          topCustomers: [
            {
              $group: {
                _id: '$customerId',
                name: { $first: '$customer.name' },
                orderCount: { $sum: 1 },
                totalSpent: { $sum: '$totalAmount' }
              }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
          ],
          // Region-wise stats
          regionStats: [
            {
              $group: {
                _id: '$region',
                orders: { $sum: 1 },
                revenue: { $sum: '$totalAmount' }
              }
            }
          ],
          // Category-wise stats
          categoryStats: [
            { $unwind: '$products' },
            {
              $lookup: {
                from: 'products',
                localField: 'products.productId',
                foreignField: '_id',
                as: 'productInfo'
              }
            },
            { $unwind: '$productInfo' },
            {
              $group: {
                _id: '$productInfo.category',
                orders: { $sum: 1 },
                revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
              }
            }
          ]
        }
      }
    ];

    const results = await Order.aggregate(aggregationPipeline).allowDiskUse(true);
    
    if (results[0].summary.length === 0) {
      return res.status(404).json({ error: 'No data found for the selected date range' });
    }

    const summary = results[0].summary[0];
    
    // Create analytics report
    const analyticsReport = new AnalyticsReport({
      startDate: start,
      endDate: end,
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      avgOrderValue: summary.avgOrderValue,
      topProducts: results[0].topProducts.map(p => ({
        productId: p._id,
        name: p.name,
        quantity: p.quantity,
        revenue: p.revenue
      })),
      topCustomers: results[0].topCustomers.map(c => ({
        customerId: c._id,
        name: c.name,
        orderCount: c.orderCount,
        totalSpent: c.totalSpent
      })),
      regionWiseStats: results[0].regionStats.map(r => ({
        region: r._id,
        orders: r.orders,
        revenue: r.revenue
      })),
      categoryWiseStats: results[0].categoryStats.map(c => ({
        category: c._id,
        orders: c.orders,
        revenue: c.revenue
      }))
    });

    await analyticsReport.save();
    
    res.status(201).json({
      message: 'Analytics report generated successfully',
      report: analyticsReport
    });
  } catch (error) {
    console.error('Error generating analytics report:', error);
    res.status(500).json({ error: 'Failed to generate report. Please try a different date range.' });
  }
};

// Get all analytics reports
exports.getReports = async (req, res) => {
  try {
    const reports = await AnalyticsReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching analytics reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await AnalyticsReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching analytics report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
