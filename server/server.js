//const https = require('https');
//const fs = require('fs');
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

// Use CORS middleware to allow requests from https://localhost:4200
app.use(cors({ origin: 'http://localhost:4200' }));

// SSL certificate and key
// const sslOptions = {
//   key: fs.readFileSync('certs/server.key'),
//   cert: fs.readFileSync('certs/server.cert')
// };

// Use express.json() to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// HTTPS server
// https.createServer(sslOptions, app).listen(3000, () => {
//   console.log('Secure backend running on port 3000');
// });

// Set up routes
app.use('/auth', authRoutes);
app.use('/charts', chartRoutes);

// Start the HTTP server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});