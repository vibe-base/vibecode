# VibeCode Frontend Container

This directory contains the Docker configuration for the VibeCode frontend application. The frontend is built with React and Vite, and served using Nginx.

## Configuration

The container includes:

- A multi-stage build process that compiles the React application
- Nginx configuration for serving the static files
- Support for SPA routing
- Gzip compression for better performance
- Cache headers for static assets
- A health check endpoint at `/health`

## Building the Docker Image

To build the frontend Docker image:

```bash
docker build -t gigahard/vibecode-client:latest .
```

## Testing Locally

A docker-compose.yml file is provided for testing the frontend container locally:

```bash
docker-compose up
```

This will start the frontend container on port 3000.

## Environment Variables

The following environment variables can be set:

- `NODE_ENV` - The Node.js environment (development, production)
- `VITE_API_URL` - The URL for the API (default: /api)

## Ports

The container exposes port 3000.

## Volumes

The container uses a volume for the static files:

- `frontend_data` - For storing the static files
