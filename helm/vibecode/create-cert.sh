#!/bin/bash
# Create a self-signed certificate for 0192.ai

# Create a private key
openssl genrsa -out 0192.ai.key 2048

# Create a certificate signing request
openssl req -new -key 0192.ai.key -out 0192.ai.csr -subj "/CN=0192.ai/O=GigaHard/C=US"

# Create a self-signed certificate
openssl x509 -req -days 365 -in 0192.ai.csr -signkey 0192.ai.key -out 0192.ai.crt

# Create a Kubernetes Secret
kubectl create secret tls 0192-ai-tls --cert=0192.ai.crt --key=0192.ai.key -n kube-system

# Clean up
rm 0192.ai.csr
