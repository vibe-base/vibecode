#!/bin/sh

# Build the Docker image
docker build -t gigahard/vibecode-client:latest --platform linux/amd64 -f frontend-update-dockerfile .
docker push gigahard/vibecode-client:latest

# Restart the frontend deployment
kubectl rollout restart deployment/frontend -n vibecode
