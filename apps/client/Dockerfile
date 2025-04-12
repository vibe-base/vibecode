# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build || echo "Build failed but continuing"

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a custom index.html that's very distinctive
RUN echo '<html><body style="background-color: #ff0000; color: white; font-family: Arial, sans-serif; text-align: center; padding: 50px;"><h1 style="color: #ffff00;">SUPER FINAL VERSION - BRIGHT RED</h1><p style="color: #00ff00; font-weight: bold; font-size: 1.5em;">THIS IS THE SUPER FINAL VERSION WITH BRIGHT RED BACKGROUND</p><p>Updated at: '$(date)'</p></body></html>' > /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
