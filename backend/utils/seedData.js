const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const dataGenerator = require('./dataGenerator'); // Fixed import

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await Customer.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    
    console.log('Existing data cleared');
    
    // Generate and insert customers
    const customers = await Customer.insertMany(dataGenerator.generateCustomers(50));
    console.log(`${customers.length} customers created`);
    
    // Generate and insert products
    const products = await Product.insertMany(dataGenerator.generateProducts(30));
    console.log(`${products.length} products created`);
    
    // Generate and insert orders
    const orders = await Order.insertMany(dataGenerator.generateOrders(200, customers, products));
    console.log(`${orders.length} orders created`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();