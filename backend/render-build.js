// Script specifically for Render deployment
const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting Render build process...');

// Check if we're in production
if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected');
  
  // Create a .env file for production
  const envContent = `
PORT=10000
MONGODB_URI=mongodb+srv://manojkumar:Manoj%408143@cluster0.0xoc1yz.mongodb.net/sales_analytics?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://sales-analytics-dashboard-frotend.onrender.com
  `.trim();
  
  fs.writeFileSync('.env', envContent);
  console.log('Created production .env file');
}

// Run npm install
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during npm install: ${error}`);
    process.exit(1);
  }
  
  console.log('npm install completed successfully');
  console.log('Build process completed');
});
