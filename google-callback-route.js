// Add a route handler for the specific callback URL
app.get('/accounts/google/login/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => handleGoogleCallback(req, res)
);
