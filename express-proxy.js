const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://fastapi:8000';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up logging
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    responseTime: tokens['response-time'](req, res),
    timestamp: new Date().toISOString()
  });
}));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Skip authentication for test endpoint
  if (req.path === '/api/test' || req.path === '/health') {
    return next();
  }

  // Get token from Authorization header or query parameter
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Test endpoint that always returns 200 OK
app.all('/api/test', (req, res) => {
  console.log('Test endpoint hit:', req.method, req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  // Return a simple response
  return res.json({
    message: 'Test endpoint successful',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock authentication endpoint for development
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // In a real application, you would validate the credentials against a database
  if (username && password) {
    // Create a mock user
    const user = {
      id: 'mock-user-id',
      username,
      email: `${username}@example.com`,
      full_name: username.charAt(0).toUpperCase() + username.slice(1),
      avatar_url: 'https://via.placeholder.com/150',
      provider: 'local'
    };
    
    // Generate a JWT token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
    
    return res.json({ token, user });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Get current user from token
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// Proxy all other /api requests to FastAPI with authentication
app.all('/api/*', verifyToken, async (req, res) => {
  const path = req.path;
  const method = req.method.toLowerCase();
  const query = req.query;
  const body = req.body;
  
  console.log(`Proxying ${method.toUpperCase()} ${path} to FastAPI`);
  
  try {
    // Add user information to the request
    const headers = {
      'Content-Type': 'application/json',
      'X-User-ID': req.user.id,
      'X-User-Email': req.user.email,
      'X-User-Name': req.user.username
    };
    
    // Forward the request to FastAPI
    const response = await axios({
      method,
      url: `${FASTAPI_URL}${path}`,
      params: query,
      data: body,
      headers
    });
    
    // Return the response from FastAPI
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying request to FastAPI:', error.message);
    
    // Return the error response from FastAPI
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
