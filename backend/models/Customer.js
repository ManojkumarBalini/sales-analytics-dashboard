const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  region: {
    type: String,
    required: true
  },
  customerType: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);