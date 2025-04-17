#!/bin/sh

# Get the current express pod
POD=$(kubectl get pods -n vibecode -l app=express -o name | head -n 1)

# Copy the index.js file from the pod
kubectl cp vibecode/$POD:/app/index.js ./express-original-index.js

# Add the new route handler
sed -i.bak '/app.get("\/api\/express\/auth\/google\/callback"/a\\
// Also support the /accounts/google/login/callback route for Google OAuth flow\
app.get("/accounts/google/login/callback",\
  passport.authenticate("google", { failureRedirect: "/login?error=google_auth_failed", session: false }),\
  (req, res) => {\
    console.log("Google OAuth callback received at /accounts/google/login/callback");\
    handleGoogleCallback(req, res);\
  }\
);' ./express-original-index.js

# Create a temporary directory for the express app
mkdir -p express-temp
cp ./express-original-index.js ./express-temp/index.js
cp ./express-dockerfile ./express-temp/Dockerfile

# Create a package.json file
cat > ./express-temp/package.json << EOF
{
  "name": "vibecode-express",
  "version": "1.0.0",
  "description": "Express server for VibeCode",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "passport": "^0.5.0",
    "passport-github2": "^0.1.12",
    "passport-google-oauth20": "^2.0.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^8.5.1",
    "axios": "^0.24.0",
    "body-parser": "^1.19.0",
    "morgan": "^1.10.0"
  }
}
EOF

# Build the Docker image
cd express-temp
docker build -t gigahard/vibecode-express:latest --platform linux/amd64 .
docker push gigahard/vibecode-express:latest

# Restart the express deployment
cd ..
kubectl rollout restart deployment/express -n vibecode

# Clean up
rm -rf express-temp
rm express-original-index.js
rm express-original-index.js.bak
