// Load environment variables from .env file
require('dotenv').config();
const cors = require('cors')
const express = require('express');
const app = express();



// Middleware
app.use(express.json()); // Parses incoming JSON requests

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // If there's no token, respond with Unauthorized status

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If there's an error verifying the token, respond with Forbidden status

    req.user = user; // Store the user information in the request object
    next(); // Move to the next middleware or route handler
  });
};

module.exports = authenticateToken;


// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Import routes
const indexRoutes = require('./routes/routes');

// Use routes
app.use('/', indexRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});