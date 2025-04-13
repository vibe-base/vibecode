const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // In production, you should restrict this to your frontend domain
  methods: ['GET', 'POST'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Express API is running');
});

// GitHub OAuth callback endpoint
app.get('/api/express/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }
  
  try {
    console.log(`Received GitHub code: ${code}`);
    
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    
    const { access_token, error } = tokenResponse.data;
    
    if (error) {
      console.error(`GitHub error: ${error}`);
      return res.status(400).json({ error: `GitHub error: ${error}` });
    }
    
    if (!access_token) {
      console.error('No access token received from GitHub');
      return res.status(400).json({ error: 'No access token received from GitHub' });
    }
    
    console.log('Successfully obtained GitHub access token');
    
    // Get user data from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`
      }
    });
    
    const githubUser = userResponse.data;
    
    // Get user email
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${access_token}`
      }
    });
    
    const emails = emailsResponse.data;
    const primaryEmail = emails.find(email => email.primary);
    
    if (!primaryEmail) {
      console.error('No primary email found for GitHub user');
      return res.status(400).json({ error: 'No primary email found for GitHub user' });
    }
    
    // Create user object
    const user = {
      username: githubUser.login,
      email: primaryEmail.email,
      full_name: githubUser.name || '',
      github_id: githubUser.id.toString(),
      avatar_url: githubUser.avatar_url,
      created_at: new Date().toISOString()
    };
    
    console.log(`User data: ${JSON.stringify(user, null, 2)}`);
    
    // Create JWT token
    const token = jwt.sign(
      { sub: user.username },
      process.env.SECRET_KEY || 'your_secret_key_for_jwt_tokens',
      { expiresIn: '1h' }
    );
    
    // In a real application, you would store the user in a database here
    
    // Return user data and token
    return res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    });
    
  } catch (error) {
    console.error('Error processing GitHub callback:', error.message);
    console.error(error.stack);
    return res.status(500).json({ 
      error: 'Failed to authenticate with GitHub',
      details: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  console.log(`GitHub Client ID: ${process.env.GITHUB_CLIENT_ID || 'Not set'}`);
  console.log(`GitHub Redirect URI: ${process.env.GITHUB_REDIRECT_URI || 'Not set'}`);
});
