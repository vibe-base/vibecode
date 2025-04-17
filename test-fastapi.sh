#!/bin/bash

# Test the FastAPI health endpoint
echo "Testing FastAPI health endpoint..."
curl -s https://0192.ai/api/fastapi/health | jq .

# Test the FastAPI projects test endpoint
echo -e "\nTesting FastAPI projects test endpoint..."
curl -s https://0192.ai/api/projects/test | jq .

# Try to create a project (this will likely fail without authentication)
echo -e "\nTrying to create a project (will likely fail without authentication)..."
curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Test Project",
  "description": "A test project created via API",
  "language": "Python",
  "files": [
    {
      "name": "main.py",
      "content": "print(\"Hello, World!\")",
      "language": "python"
    }
  ]
}' https://0192.ai/api/projects
