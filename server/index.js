const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const findFreePort = require('find-free-port');
const nodemailer = require("nodemailer");

const userRoutes = require('../client/src/routes/userRoutes');
const receiptRoutes = require('../client/src/routes/receiptRoutes');
const groupRoutes = require('../client/src/routes/groupRoutes');
const paymentRoutes = require('../client/src/routes/paymentRoutes');

const app = express();

// Strict CORS Configuration to Fix Login Issues
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow sending cookies and authentication headers
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle CORS preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, '../client/build')));

// Database Connection (Persistent Connection)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Test Database Connection
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to the database.');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/payments', paymentRoutes);

// Default Route (Fixes "Cannot GET /" Error)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Gmail Route (email sender)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_PASS   
  }
});

app.post("/send-email", async (req, res) => {
  const { email, subject, html } = req.body;
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${subject} - Ref #${Date.now()}`,
      headers: { "Message-ID": `<${Date.now()}@mass-splitter.com>` }, // Ensures a unique message
      html: `${html}`
  };
  try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

// Automatically find a free port starting at 5000
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
