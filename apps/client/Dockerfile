FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple index.html file
RUN echo '<html><body><h1>VibeCode Client</h1><p>This is a placeholder for the VibeCode client application.</p></body></html>' > /usr/share/nginx/html/index.html

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
