#!/bin/bash

# Get the FastAPI pod name
FASTAPI_POD=$(kubectl get pods -n vibecode -l app=fastapi -o jsonpath='{.items[0].metadata.name}')

# Create a project using curl inside the pod
kubectl exec -n vibecode $FASTAPI_POD -- curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2stdXNlci1pZCIsInVzZXJuYW1lIjoibW9ja191c2VyIiwiZW1haWwiOiJtb2NrQGV4YW1wbGUuY29tIiwiZnVsbF9uYW1lIjoiTW9jayBVc2VyIiwicHJvdmlkZXIiOiJtb2NrIn0.8J7ySQkLN6KuSEUzD7tHpQmEzWrs2d6SFbxuFxrCLQ4" -d '{
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
}' http://localhost:8000/api/projects
