#!/bin/sh

# Replace environment variables in the built JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|RUNTIME_GITHUB_CLIENT_ID|${GITHUB_CLIENT_ID}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|RUNTIME_API_URL|${API_URL}|g" {} \;

# Replace localhost:8000 with the correct URL
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://localhost:8000/api/auth/github/exchange|${VITE_GITHUB_CALLBACK_URL}|g" {} \;