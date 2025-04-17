const express = require('express');
const router = express.Router();

// Test endpoint that always returns 200 OK
router.all('/api/test', (req, res) => {
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

// Special handler for /api/projects endpoint with no authentication
router.all('/api/projects*', (req, res) => {
  console.log('Projects endpoint hit with no auth:', req.method, req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  // Return mock projects data
  return res.json([
    {
      id: 'mock-project-1',
      name: 'Mock Project 1',
      description: 'This is a mock project for development',
      language: 'Python',
      owner_id: 'mock-user-id',
      members: ['mock-user-id'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-project-2',
      name: 'Mock Project 2',
      description: 'Another mock project for development',
      language: 'JavaScript',
      owner_id: 'mock-user-id',
      members: ['mock-user-id'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
});

module.exports = router;
