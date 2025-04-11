# Use a simple nginx image for both architectures
FROM nginx:alpine

# Copy a custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple index.html file for testing
RUN echo '<html><body><h1>VibeCode Client</h1><p>This is a placeholder for the VibeCode client application.</p><p>This image supports both AMD64 and ARM64 architectures.</p></body></html>' > /usr/share/nginx/html/index.html

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
