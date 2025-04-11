FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "dist", "-l", "3000"]
