const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('../client/src/routes/userRoutes'); // Path to userRoutes.js
const receiptRoutes = require('../client/src/routes/receiptRoutes'); // Path to receiptRoutes.js


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Routes
app.use('/api/users', userRoutes); // All user-related routes will be prefixed with /api/users
app.use('/api/receipts', receiptRoutes); // All receipt-related routes will be prefixed with /api/receipts

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
