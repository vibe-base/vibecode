#!/bin/bash

# Test script for FastAPI endpoints
echo "Testing FastAPI endpoints..."

# Test health endpoint
echo -e "\n1. Testing health endpoint..."
curl -s https://0192.ai/api/fastapi/health | jq .

# Test projects endpoint without token
echo -e "\n2. Testing projects endpoint without token..."
curl -s https://0192.ai/api/projects/test | jq .

# Create a project without token
echo -e "\n3. Creating a project without token..."
curl -s https://0192.ai/api/projects/create-test | jq .

echo -e "\nTests completed."
