const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded credentials (use your first name for both username and password)
const hardcodedUsername = 'Kendra'; // Replace with your first name
const hardcodedPassword = 'Kendra'; // Replace with your first name

// JWT secret key (store this in .env for production)
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the provided username and password match the hardcoded credentials
  if (username === hardcodedUsername && password === hardcodedPassword) {
    // Generate JWT token
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });

    // Send token back to the client
    res.json({ token });
  } else {
    // Send an error if credentials do not match
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
