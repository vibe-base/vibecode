const express = require('express');
const axios = require('axios');
const app = express();

// GitHub OAuth route - redirects to GitHub
app.get('/api/auth/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

// GitHub callback route
app.get('/github-callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for token
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    // Get user data
    const { access_token } = tokenRes.data;
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Send success page that sets token and redirects
    res.send(`
      <script>
        localStorage.setItem('token', '${access_token}');
        localStorage.setItem('user', '${JSON.stringify(userRes.data)}');
        window.location.href = '/';
      </script>
    `);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});