#!/bin/bash
set -e

# Move the new files to replace the old ones
mv src/App.tsx.new src/App.tsx
mv Dockerfile.new Dockerfile

# Replace with your actual DockerHub username
DOCKER_USERNAME="your-dockerhub-username"
DOCKER_IMAGE="$DOCKER_USERNAME/vibecode-client:latest"

echo "Building Docker image: $DOCKER_IMAGE"
docker build -t $DOCKER_IMAGE .

echo "Pushing Docker image to DockerHub"
docker push $DOCKER_IMAGE

echo "Image built and pushed successfully!"
