# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# First, copy only package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application with environment variables
ARG VITE_GITHUB_CLIENT_ID
ARG VITE_API_URL
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

# Build using the correct script from package.json
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy env.sh script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
