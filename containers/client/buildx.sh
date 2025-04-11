#!/bin/bash
set -e

# Ensure buildx is available and set up a builder if needed
if ! docker buildx inspect mybuilder &>/dev/null; then
  echo "Setting up Docker Buildx builder..."
  docker buildx create --name mybuilder --use
else
  docker buildx use mybuilder
fi

# Make sure the builder is running
docker buildx inspect --bootstrap

# Build the Docker image with multi-architecture support
echo "Building Client Docker image for multiple architectures (amd64, arm64)..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag gigahard/vibecode-client:latest \
  --push \
  .

echo "Multi-architecture image built and pushed successfully!"
echo "The image now supports both AMD64 and ARM64 platforms."
