const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use your MongoDB URI directly or from environment variable
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://manojkumar:Manoj%408143@cluster0.0xoc1yz.mongodb.net/sales_analytics?retryWrites=true&w=majority';
    
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
