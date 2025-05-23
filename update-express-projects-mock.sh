#!/bin/sh

# Create a temporary directory for the Express app
mkdir -p express-auth-temp

# Create a simple index.js file with the mock auth middleware
cat > ./express-auth-temp/index.js << EOF
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import middlewares
const mockAuthRouter = require('./mock-auth');
const fastApiAuthRouter = require('./fastapi-auth');
const projectsRouter = require('./projects-mock');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Configure GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_REDIRECT_URI || 'https://vibecode.gigahard.ai/github-callback'
}, (accessToken, refreshToken, profile, done) => {
  // Get user emails
  axios.get('https://api.github.com/user/emails', {
    headers: { Authorization: \`token \${accessToken}\` }
  })
    .then(response => {
      const primaryEmail = response.data.find(email => email.primary) || response.data[0];

      // Create user object
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email: primaryEmail ? primaryEmail.email : null,
        avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        accessToken
      };

      return done(null, user);
    })
    .catch(error => {
      console.error('Error fetching user emails:', error);
      // Still return the user without email if there's an error
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        email: null,
        avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        accessToken
      };
      return done(null, user);
    });
}));

// Configure Google OAuth Strategy
console.log('Configuring Google OAuth Strategy');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
console.log('Google Redirect URI:', process.env.GOOGLE_REDIRECT_URI || 'https://vibecode.gigahard.ai/auth/google/callback');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI || 'https://vibecode.gigahard.ai/auth/google/callback'
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

// Set up logging
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    responseTime: tokens['response-time'](req, res),
    timestamp: new Date().toISOString()
  });
}));

// Use mock auth middleware (must be before other auth middleware)
app.use(mockAuthRouter);

// Use projects mock router (must be before FastAPI auth middleware)
app.use(projectsRouter);

// GitHub OAuth route - redirects to GitHub
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Also support the /api/express/auth/github route for backward compatibility
app.get('/api/express/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Google OAuth route - redirects to Google
app.get('/api/auth/google', (req, res, next) => {
  console.log('Google OAuth route hit');
  console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set');
  console.log('Google Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Also support the /api/express/auth/google route for backward compatibility
app.get('/api/express/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Helper function to handle GitHub callback
function handleGitHubCallback(req, res) {
  try {
    console.log('GitHub authentication successful');

    // Create a JWT token with user information
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      full_name: req.user.displayName,
      avatar_url: req.user.avatarUrl,
      provider: 'github'
    };

    // Sign the JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Redirect to the frontend callback URL with the token
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 'https://vibecode.gigahard.ai/github-callback';
    console.log(\`Redirecting to: \${redirectUri}\`);

    // Return JSON response for API requests
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ token, user });
    }

    // Otherwise redirect with token as query parameter
    res.redirect(\`\${redirectUri}?token=\${token}\`);
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.redirect('/login?error=github_callback_error');
  }
}

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

    // Redirect to the frontend callback URL with the token
    // Since we're already at the callback URL, redirect to the main app with the token
    console.log('Google OAuth callback successful, redirecting to main app');

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

// GitHub OAuth callback route
app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=github_auth_failed', session: false }),
  (req, res) => handleGitHubCallback(req, res)
);

// Also support the /api/express/auth/github/callback route for backward compatibility
app.get('/api/express/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=github_auth_failed', session: false }),
  (req, res) => handleGitHubCallback(req, res)
);

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

// Also support the /accounts/google/login/callback/ route for Google OAuth flow
app.get('/accounts/google/login/callback/',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => {
    console.log('Google OAuth callback received at /accounts/google/login/callback/');
    handleGoogleCallback(req, res);
  }
);

// Also support the /api/express/auth/google/callback route for backward compatibility
app.get('/api/express/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => handleGoogleCallback(req, res)
);

// API endpoint to handle GitHub code exchange (for frontend-initiated flow)
app.post('/api/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'GitHub code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token from GitHub' });
    }

    // Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: \`token \${access_token}\`
      }
    });

    // Get user emails
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: \`token \${access_token}\`
      }
    });

    const primaryEmail = emailsResponse.data.find(email => email.primary) || emailsResponse.data[0];

    // Create user object
    const user = {
      id: userResponse.data.id,
      username: userResponse.data.login,
      email: primaryEmail ? primaryEmail.email : null,
      full_name: userResponse.data.name || userResponse.data.login,
      avatar_url: userResponse.data.avatar_url,
      provider: 'github'
    };

    // Create JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Return token and user info
    return res.json({ token, user });
  } catch (error) {
    console.error('Error exchanging GitHub code:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// API endpoint to handle Google code exchange (for frontend-initiated flow)
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Google code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://vibecode.gigahard.ai/auth/google/callback',
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token from Google' });
    }

    // Get user profile
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: \`Bearer \${access_token}\`
      }
    });

    // Create user object
    const user = {
      id: userResponse.data.id,
      username: userResponse.data.name,
      email: userResponse.data.email,
      full_name: userResponse.data.name,
      avatar_url: userResponse.data.picture,
      provider: 'google'
    };

    // Create JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Return token and user info
    return res.json({ token, user });
  } catch (error) {
    console.error('Error exchanging Google code:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Also support the /api/express/auth/google/callback endpoint for backward compatibility
app.post('/api/express/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Google code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://vibecode.gigahard.ai/auth/google/callback',
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token from Google' });
    }

    // Get user profile
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: \`Bearer \${access_token}\`
      }
    });

    // Create user object
    const user = {
      id: userResponse.data.id,
      username: userResponse.data.name,
      email: userResponse.data.email,
      full_name: userResponse.data.name,
      avatar_url: userResponse.data.picture,
      provider: 'google'
    };

    // Create JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Return token and user info
    return res.json({ token, user });
  } catch (error) {
    console.error('Error exchanging Google code:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Also support the /api/express/auth/github/callback endpoint for backward compatibility
app.post('/api/express/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'GitHub code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token from GitHub' });
    }

    // Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: \`token \${access_token}\`
      }
    });

    // Get user emails
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: \`token \${access_token}\`
      }
    });

    const primaryEmail = emailsResponse.data.find(email => email.primary) || emailsResponse.data[0];

    // Create user object
    const user = {
      id: userResponse.data.id,
      username: userResponse.data.login,
      email: primaryEmail ? primaryEmail.email : null,
      full_name: userResponse.data.name || userResponse.data.login,
      avatar_url: userResponse.data.avatar_url,
      provider: 'github'
    };

    // Create JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    // Return token and user info
    return res.json({ token, user });
  } catch (error) {
    console.error('Error exchanging GitHub code:', error);
    return res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// User info endpoint - returns the current user based on JWT token
app.get('/api/auth/me', (req, res) => {
  try {
    // Get token from Authorization header or query parameter
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if this is a mock token (already handled by mockAuthRouter)
    if (token.startsWith('mock_token_')) {
      // This should have been handled by mockAuthRouter
      console.log('Mock token in /api/auth/me not handled by mockAuthRouter');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token', details: err.message });
      }

      // Return user info
      return res.json({ user: decoded });
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Also support the /api/express/auth/me endpoint for backward compatibility
app.get('/api/express/auth/me', (req, res) => {
  try {
    // Get token from Authorization header or query parameter
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Check if this is a mock token (already handled by mockAuthRouter)
    if (token.startsWith('mock_token_')) {
      // This should have been handled by mockAuthRouter
      console.log('Mock token in /api/express/auth/me not handled by mockAuthRouter');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token', details: err.message });
      }

      // Return user info
      return res.json({ user: decoded });
    });
  } catch (error) {
    console.error('Error in /api/express/auth/me:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Use FastAPI auth middleware
app.use(fastApiAuthRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOF

# Copy the FastAPI auth middleware
cp express-fastapi-auth-fixed.js express-auth-temp/fastapi-auth.js

# Copy the mock auth middleware
cp express-mock-auth-updated.js express-auth-temp/mock-auth.js

# Copy the projects mock router
cp express-projects-mock.js express-auth-temp/projects-mock.js

# Create a package.json file
cat > ./express-auth-temp/package.json << EOF
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

# Create a Dockerfile
cat > ./express-auth-temp/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
EOF

# Build the Docker image
cd express-auth-temp
docker build -t gigahard/vibecode-express:latest --platform linux/amd64 .
docker push gigahard/vibecode-express:latest

# Update the express deployment with the NODE_ENV environment variable
cd ..
cat > ./express-env-patch.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: express
  namespace: vibecode
spec:
  template:
    spec:
      containers:
      - name: express
        env:
        - name: FASTAPI_URL
          value: http://fastapi:8000
        - name: NODE_ENV
          value: development
EOF

# Apply the patch
kubectl apply -f express-env-patch.yaml

# Restart the express deployment
kubectl rollout restart deployment/express -n vibecode

# Clean up
rm -rf express-auth-temp
rm express-env-patch.yaml
