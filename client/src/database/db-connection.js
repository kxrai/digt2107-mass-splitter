// db-connection.js

const path = require('path');
const mysql = require('mysql2');

// Load environment variables from the .env file located one directory up
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Debug: Log the resolved .env path
console.log('Resolved .env path:', path.resolve(__dirname, '../.env'));

// Debug: Log the loaded database config to verify environment variables
console.log('Database Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME, // Ensure consistency
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = connection;
