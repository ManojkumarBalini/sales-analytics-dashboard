const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
  reportDate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  avgOrderValue: {
    type: Number,
    default: 0
  },
  topProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: Number,
    revenue: Number
  }],
  topCustomers: [{
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    name: String,
    orderCount: Number,
    totalSpent: Number
  }],
  regionWiseStats: [{
    region: String,
    orders: Number,
    revenue: Number
  }],
  categoryWiseStats: [{
    category: String,
    orders: Number,
    revenue: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);