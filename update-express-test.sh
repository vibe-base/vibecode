#!/bin/sh

# Create a temporary directory for the Express app
mkdir -p express-test-temp

# Create a simple index.js file with the test endpoint
cat > ./express-test-temp/index.js << EOF
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import test endpoint router
const testRouter = require('./test-endpoint');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

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

// Use test endpoint router
app.use(testRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for debugging
app.all('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  res.json({
    message: 'Catch-all route hit',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOF

# Copy the test endpoint router
cp express-test-endpoint.js express-test-temp/test-endpoint.js

# Create a package.json file
cat > ./express-test-temp/package.json << EOF
{
  "name": "vibecode-express-test",
  "version": "1.0.0",
  "description": "Express server for VibeCode with test endpoints",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "cors": "^2.8.5",
    "body-parser": "^1.19.0",
    "morgan": "^1.10.0"
  }
}
EOF

# Create a Dockerfile
cat > ./express-test-temp/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
EOF

# Build the Docker image
cd express-test-temp
docker build -t gigahard/vibecode-express:latest --platform linux/amd64 .
docker push gigahard/vibecode-express:latest

# Restart the express deployment
cd ..
kubectl rollout restart deployment/express -n vibecode

# Clean up
rm -rf express-test-temp
