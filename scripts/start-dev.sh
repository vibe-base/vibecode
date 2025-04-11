#!/bin/bash

# Start development environment
echo "Starting VibeCode development environment..."

# Load environment variables
set -a
source .env
set +a

# Start docker containers
docker-compose up -d

echo "Development environment started!"
echo "Client running at: http://localhost:${CLIENT_PORT:-3000}"
echo "Server running at: http://localhost:${SERVER_PORT:-8000}"
