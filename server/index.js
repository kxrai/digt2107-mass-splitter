const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('Resolved .env path:', path.resolve(__dirname, '../.env'));

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const findFreePort = require('find-free-port');

const userRoutes = require('../client/src/routes/userRoutes'); 
const receiptRoutes = require('../client/src/routes/receiptRoutes');
const groupRoutes = require('../client/src/routes/groupRoutes');
const friendRoutes = require('../client/src/routes/friendRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/friends', friendRoutes);

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  // port: process.env.DB_PORT, // Include if you have DB_PORT defined
  user: process.env.DB_USERNAME,      // Changed from DB_USER
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,  // Changed from DB_NAME
});


// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if connection fails
  }
  console.log('Connected to the database.');
});

// Automatically find a free port starting at 5000
const DEFAULT_PORT = 5000;
findFreePort(DEFAULT_PORT, (err, freePort) => {
  if (err) {
    console.error('Error finding a free port:', err);
    process.exit(1);
  }

  app.listen(freePort, () => {
    console.log(`Server running on port ${freePort}`);
  });
});
