// Add this route handler after line 237
app.get('/accounts/google/login/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  (req, res) => {
    console.log('Google OAuth callback received at /accounts/google/login/callback');
    handleGoogleCallback(req, res);
  }
);
