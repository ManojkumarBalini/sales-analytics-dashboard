const regions = ['North', 'South', 'East', 'West'];
const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
const customerTypes = ['regular', 'premium', 'vip'];

// Simple random data generator functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Generate customers
const generateCustomers = (count) => {
  const customers = [];
  for (let i = 0; i < count; i++) {
    customers.push({
      name: `Customer ${i+1}`,
      email: `customer${i+1}@example.com`,
      region: getRandomElement(regions),
      customerType: getRandomElement(customerTypes),
      joinDate: getRandomDate(new Date(2020, 0, 1), new Date())
    });
  }
  return customers;
};

// Generate products
const generateProducts = (count) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      name: `Product ${i+1}`,
      category: getRandomElement(categories),
      price: getRandomInt(10, 500),
      description: `Description for product ${i+1}`,
      inStock: Math.random() > 0.1 // 90% chance of being in stock
    });
  }
  return products;
};

// Generate orders
const generateOrders = (count, customers, products) => {
  const orders = [];
  // Generate dates from 2022 to current date + 1 year (to include some future dates)
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // Add one year to include some future dates
  
  for (let i = 0; i < count; i++) {
    const productCount = getRandomInt(1, 5);
    const orderProducts = [];
    let totalAmount = 0;
    
    for (let j = 0; j < productCount; j++) {
      const product = getRandomElement(products);
      const quantity = getRandomInt(1, 3);
      const price = product.price;
      
      orderProducts.push({
        productId: product._id,
        quantity,
        price
      });
      
      totalAmount += quantity * price;
    }
    
    const customer = getRandomElement(customers);
    
    orders.push({
      orderDate: getRandomDate(startDate, endDate),
      customerId: customer._id,
      products: orderProducts,
      totalAmount,
      region: customer.region,
      status: getRandomElement(['pending', 'completed', 'cancelled'])
    });
  }
  return orders;
};

// Export all functions and data
module.exports = {
  generateCustomers,
  generateProducts,
  generateOrders,
  regions,
  categories,
  customerTypes
};