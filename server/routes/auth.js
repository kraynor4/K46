const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config(); // Ensure environment variables are loaded

// Use environment variables for credentials
const hardcodedUsername = process.env.AUTH_USERNAME; // Add this to your .env file
const hardcodedPassword = process.env.AUTH_PASSWORD; // Add this to your .env file

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', (req, res) => {
  console.log('Login request received');
  const { username, password } = req.body;
  console.log("Received username:", username);
  console.log("Received password:", password);

  // Check if the provided username and password match the hardcoded credentials
  if (username === hardcodedUsername && password === hardcodedPassword) {
    // Generate JWT token
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '30m' });
    console.log("Token generated:", token);

    // Send token back to the client
    res.json({ token });
  } else {
    // Send an error if credentials do not match
    console.log("Invalid credentials");
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

module.exports = router;
