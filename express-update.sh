#!/bin/sh

# Create a temporary directory for the express app
mkdir -p express-temp

# Create a simple index.js file with the new route handler
cat > ./express-temp/index.js << EOF
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Configure Google OAuth Strategy
console.log('Configuring Google OAuth Strategy');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('Google Redirect URI:', process.env.GOOGLE_REDIRECT_URI);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => {
  console.log('Google OAuth callback received');
  console.log('Profile:', JSON.stringify(profile));
  // Create user object
  const user = {
    id: profile.id,
    username: profile.displayName,
    displayName: profile.displayName,
    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
    avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
    accessToken
  };

  return done(null, user);
}));

// Helper function to handle Google callback
function handleGoogleCallback(req, res) {
  try {
    console.log('Google authentication successful');

    // Create a JWT token with user information
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      full_name: req.user.displayName,
      avatar_url: req.user.avatarUrl,
      provider: 'google'
    };

    // Sign the JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Return JSON response for API requests
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ token, user });
    }

    // Otherwise redirect to the main app with token as query parameter
    // Include source=google to indicate this is from Google OAuth
    res.redirect(\`/?token=\${token}&source=google\`);
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect('/login?error=google_callback_error');
  }
}

// Google OAuth route - redirects to Google
app.get('/api/auth/google', (req, res, next) => {
  console.log('Google OAuth route hit');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => handleGoogleCallback(req, res)
);

// Also support the /auth/google/callback route for direct Google OAuth flow
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => handleGoogleCallback(req, res)
);

// Add a route handler for the specific callback URL
app.get('/accounts/google/login/callback/',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => {
    console.log('Google OAuth callback received at /accounts/google/login/callback/');
    handleGoogleCallback(req, res);
  }
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOF

# Create a package.json file
cat > ./express-temp/package.json << EOF
{
  "name": "vibecode-express-google-oauth",
  "version": "1.0.0",
  "description": "Express server for VibeCode Google OAuth",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "passport": "^0.5.0",
    "passport-google-oauth20": "^2.0.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^8.5.1"
  }
}
EOF

# Create a Dockerfile
cat > ./express-temp/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
EOF

# Build the Docker image
cd express-temp
docker build -t gigahard/vibecode-express-google-oauth:latest --platform linux/amd64 .
docker push gigahard/vibecode-express-google-oauth:latest

# Create a new deployment for the Google OAuth handler
cd ..
cat > ./express-google-oauth-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express-google-oauth
  namespace: vibecode
spec:
  replicas: 1
  selector:
    matchLabels:
      app: express-google-oauth
  template:
    metadata:
      labels:
        app: express-google-oauth
    spec:
      containers:
      - name: express-google-oauth
        image: gigahard/vibecode-express-google-oauth:latest
        imagePullPolicy: Always
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "5000"
        - name: GOOGLE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              key: GOOGLE_CLIENT_ID
              name: vibecode-new-google-oauth
        - name: GOOGLE_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              key: GOOGLE_CLIENT_SECRET
              name: vibecode-new-google-oauth
        - name: GOOGLE_REDIRECT_URI
          value: https://0192.ai/accounts/google/login/callback/
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              key: JWT_SECRET
              name: vibecode-new-github-oauth
        ports:
        - containerPort: 5000
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: express-google-oauth
  namespace: vibecode
spec:
  ports:
  - port: 5000
    targetPort: 5000
    protocol: TCP
  selector:
    app: express-google-oauth
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: express-google-oauth
  namespace: vibecode
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    traefik.ingress.kubernetes.io/router.tls.certresolver: letsencrypt
spec:
  rules:
  - host: 0192.ai
    http:
      paths:
      - path: /accounts/google/login/callback/
        pathType: Prefix
        backend:
          service:
            name: express-google-oauth
            port:
              number: 5000
EOF

# Apply the deployment
kubectl apply -f express-google-oauth-deployment.yaml

# Clean up
rm -rf express-temp
