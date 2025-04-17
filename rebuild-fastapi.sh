#!/bin/bash
set -e

# Build the FastAPI Docker image
echo "Building FastAPI Docker image..."
docker build -t gigahard/vibecode-fastapi:latest --platform linux/amd64 ./apps/fastapi

# Push the image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push gigahard/vibecode-fastapi:latest

# Restart the FastAPI deployment in Kubernetes
echo "Restarting FastAPI deployment..."
kubectl rollout restart deployment/fastapi -n vibecode

# Wait for the deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/fastapi -n vibecode

echo "FastAPI deployment updated successfully!"
