FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ../apps/client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY ../apps/client/ ./

# Build the app
RUN npm run build

# Production stage - using a simple static file server
FROM node:18-alpine

# Install serve
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy the build output
COPY --from=build /app/dist ./

# Expose port
EXPOSE 3000

# Start serve
CMD ["serve", "-s", ".", "-l", "3000"]
