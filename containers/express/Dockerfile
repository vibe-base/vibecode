# Use a simple node image for both architectures
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create a simple Express app for testing
RUN npm init -y && \
    npm install express && \
    echo 'const express = require("express"); \
    const app = express(); \
    const port = process.env.PORT || 5000; \
    app.get("/", (req, res) => { \
      res.send("Express API is running and supports both AMD64 and ARM64 architectures"); \
    }); \
    app.get("/health", (req, res) => { \
      res.status(200).send("OK"); \
    }); \
    app.listen(port, () => { \
      console.log(`Express server listening on port ${port}`); \
    });' > index.js

# Expose port 5000
EXPOSE 5000

# Start the Express server
CMD ["node", "index.js"]
