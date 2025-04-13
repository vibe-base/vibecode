const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const port = process.env.PORT || 5000;

// Auth0 JWT validation middleware
const jwtCheck = auth({
  audience: 'https://api.vibecode.gigahard.ai',
  issuerBaseURL: `https://${process.env.VITE_AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

// Enable CORS
app.use(cors());
app.use(express.json());

// Protected route example
app.get('/api/protected', jwtCheck, (req, res) => {
  res.json({ message: 'Protected endpoint accessed successfully' });
});

console.log('Starting minimal Express server...');

// Simple route
app.get('/', (req, res) => {
  res.send('Express server is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// GitHub callback route
app.get('/api/express/auth/github/callback', (req, res) => {
  const code = req.query.code || 'no-code';
  console.log(`GitHub callback received with code: ${code}`);

  res.json({
    message: 'GitHub callback received',
    code: code,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Keep the process alive
process.stdin.resume();

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting gracefully.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting gracefully.');
  process.exit(0);
});
