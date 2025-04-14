FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the Express server
CMD ["node", "index.js"]
