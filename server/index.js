const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const findFreePort = require('find-free-port');

const userRoutes = require('../client/src/routes/userRoutes');
const receiptRoutes = require('../client/src/routes/receiptRoutes');
const groupRoutes = require('../client/src/routes/groupRoutes');
const paymentRoutes = require('../client/src/routes/paymentRoutes');

const app = express();

// ✅ Strict CORS Configuration to Fix Login Issues
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow sending cookies and authentication headers
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle CORS preflight requests
app.options('*', cors());

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

// ✅ Database Connection (Persistent Connection)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// ✅ Test Database Connection
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to the database.');
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ Default Route (Fixes "Cannot GET /" Error)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Automatically find a free port starting at 5000
const DEFAULT_PORT = 5000;
findFreePort(DEFAULT_PORT, (err, freePort) => {
  if (err) {
    console.error('❌ Error finding a free port:', err);
    process.exit(1);
  }

  app.listen(freePort, () => {
    console.log(`🚀 Server running on port ${freePort}`);
  });
});
