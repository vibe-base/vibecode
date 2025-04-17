#!/bin/bash
set -e

echo "Building and deploying FastAPI with Kubernetes integration..."
./rebuild-fastapi.sh

echo "Building and deploying frontend with container management UI..."
./rebuild-frontend.sh

echo "All components have been rebuilt and deployed!"
echo "You can now access the application at https://0192.ai/"
