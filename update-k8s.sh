#!/bin/bash
set -e

# Update the Kubernetes deployment
echo "Updating Kubernetes deployment..."
kubectl set image deployment/frontend frontend=gigahard/vibecode-client:latest -n vibecode

# Check the rollout status
echo "Checking rollout status..."
kubectl rollout status deployment/frontend -n vibecode

# Verify the pods
echo "Verifying pods..."
kubectl get pods -n vibecode -l app=frontend
