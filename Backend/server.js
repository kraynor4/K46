const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chartRoutes');

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Use CORS middleware to allow requests from http://localhost:4200
app.use(cors({ origin: 'http://localhost:4200' }));

// Use express.json() to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/k46_db',)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Set up routes
app.use('/auth', authRoutes);
app.use('/charts', chartRoutes);

// Start the server
app.listen(3000, () => console.log('Backend running on port 3000'));
