#!/bin/bash
set -e

# Build the Docker image
echo "Building Client Docker image..."
docker build -t gigahard/vibecode-client:latest .

# Ask if the user wants to push the image
read -p "Do you want to push the image to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Pushing image to Docker Hub..."
    docker push gigahard/vibecode-client:latest
    echo "Image pushed successfully!"
else
    echo "Skipping push to Docker Hub."
fi

echo "Done!"
