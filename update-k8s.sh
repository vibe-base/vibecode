#!/bin/bash
set -e

# Replace with your actual DockerHub username
DOCKER_USERNAME="your-dockerhub-username"
DOCKER_IMAGE="$DOCKER_USERNAME/vibecode-client:latest"

# Update the Kubernetes deployment
echo "Updating Kubernetes deployment..."
kubectl set image deployment/frontend frontend=$DOCKER_IMAGE -n vibecode

# Check the rollout status
echo "Checking rollout status..."
kubectl rollout status deployment/frontend -n vibecode

echo "Deployment updated successfully!"
