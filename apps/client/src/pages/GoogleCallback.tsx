import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [status, setStatus] = useState('Processing your login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const code = new URLSearchParams(window.location.search).get('code');

        if (!code) {
          setStatus('Error: No authorization code received from Google');
          return;
        }

        setStatus('Authenticating with Google...');

        // The code is already being processed by the backend during the redirect
        // We just need to extract the token from the URL
        const token = new URLSearchParams(window.location.search).get('token');

        if (!token) {
          // If no token in the URL, the backend might have redirected to the root with the token
          // Check if we're being redirected from the root with a token
          setStatus('No token in callback URL, checking session storage...');

          // Try to get the token from sessionStorage (set by auth.tsx when token is in root URL)
          const storedToken = sessionStorage.getItem('google_auth_token');

          if (storedToken) {
            setStatus('Found token in session storage');
            sessionStorage.removeItem('google_auth_token'); // Clean up
            return processToken(storedToken);
          }

          setStatus('Error: No token received from backend');
          return;
        }

        return processToken(token);
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to authenticate'}`);
      }
    };

    const processToken = (token: string) => {
      // Create a mock response to maintain compatibility with the rest of the code
      const data = {
        token,
        user: {
          id: 'google-user',
          username: 'Google User',
          provider: 'google'
        }
      };

      // No need to check response.ok since we're not making a fetch request

      // Save the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update auth context
      setToken(data.token);
      setUser(data.user);

      // Redirect to the main app
      setStatus('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    };

    handleCallback();
  }, [navigate, setToken, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Google Authentication</h1>
        <div className="animate-pulse">
          <p className="text-muted-foreground">{status}</p>
        </div>
      </div>
    </div>
  );
}
