#!/bin/bash
set -e

# Function to build an image
build_image() {
  local service=$1
  local script_path=$2
  
  echo "========================================="
  echo "Building $service image..."
  echo "========================================="
  
  if [ -f "$script_path" ]; then
    cd $(dirname "$script_path")
    ./$(basename "$script_path")
    cd - > /dev/null
  else
    echo "Error: Build script not found at $script_path"
    exit 1
  fi
  
  echo "Completed building $service image."
  echo
}

# Ensure buildx is available and set up a builder if needed
if ! docker buildx inspect mybuilder &>/dev/null; then
  echo "Setting up Docker Buildx builder..."
  docker buildx create --name mybuilder --use
else
  docker buildx use mybuilder
fi

# Make sure the builder is running
docker buildx inspect --bootstrap

# Build all images
build_image "Client" "containers/client/buildx.sh"
build_image "Express" "containers/express/buildx.sh"
build_image "FastAPI" "containers/fastapi/buildx.sh"
build_image "Caddy" "containers/caddy/build.sh"

echo "========================================="
echo "All images have been built successfully!"
echo "They now support both AMD64 and ARM64 platforms."
echo "========================================="
