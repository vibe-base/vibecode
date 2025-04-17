#!/bin/sh

# Create a temporary directory for the FastAPI app
mkdir -p fastapi-temp

# Get the current FastAPI code
echo "Copying FastAPI code from the pod..."
POD=$(kubectl get pods -n vibecode -l app=fastapi -o name | head -n 1)
kubectl cp vibecode/$POD:/app fastapi-temp

# Update the auth.py file
echo "Updating auth.py file..."
cp fastapi-auth.py fastapi-temp/app/core/auth.py

# Create a requirements.txt file if it doesn't exist
if [ ! -f fastapi-temp/requirements.txt ]; then
  echo "Creating requirements.txt file..."
  cat > fastapi-temp/requirements.txt << EOF
fastapi>=0.68.0,<0.69.0
uvicorn>=0.15.0,<0.16.0
sqlalchemy>=1.4.23,<1.5.0
pydantic>=1.8.0,<2.0.0
pydantic-settings>=2.0.0,<3.0.0
python-jose[cryptography]>=3.3.0,<3.4.0
passlib[bcrypt]>=1.7.4,<1.8.0
python-multipart>=0.0.5,<0.0.6
httpx>=0.23.0,<0.24.0
psycopg2-binary>=2.9.1,<2.10.0
EOF
fi

# Copy the Dockerfile
cp fastapi-dockerfile fastapi-temp/Dockerfile

# Build the Docker image
echo "Building Docker image..."
cd fastapi-temp
docker build -t gigahard/vibecode-fastapi:latest --platform linux/amd64 .
docker push gigahard/vibecode-fastapi:latest

# Restart the FastAPI deployment
echo "Restarting FastAPI deployment..."
cd ..
kubectl rollout restart deployment/fastapi -n vibecode

# Clean up
echo "Cleaning up..."
rm -rf fastapi-temp
