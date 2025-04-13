#!/bin/bash

# Check if namespace argument is provided
NAMESPACE=${1:-default}

# Create namespace if it doesn't exist
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Prompt for GitHub credentials
echo "Enter GitHub Client ID:"
read -r CLIENT_ID

echo "Enter GitHub Client Secret:"
read -r CLIENT_SECRET

# Create the secret with validation disabled
kubectl create secret generic vibecode-github-oauth \
  --namespace="$NAMESPACE" \
  --from-literal=GITHUB_CLIENT_ID="$CLIENT_ID" \
  --from-literal=GITHUB_CLIENT_SECRET="$CLIENT_SECRET" \
  --validate=false

echo "GitHub OAuth secrets created in namespace: $NAMESPACE"

# Verify the secret was created
echo "Verifying secret creation..."
kubectl get secret vibecode-github-oauth -n "$NAMESPACE"
