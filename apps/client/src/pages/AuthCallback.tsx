import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [status, setStatus] = useState('Processing your login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const code = new URLSearchParams(window.location.search).get('code');

        if (!code) {
          setStatus('Error: No authorization code received from GitHub');
          return;
        }

        setStatus('Authenticating with GitHub...');

        // Check if we have a token in the URL (similar to Google OAuth flow)
        const token = new URLSearchParams(window.location.search).get('token');

        if (token) {
          // If we have a token, process it directly
          setStatus('Token found in URL, processing...');
          return processToken(token);
        }

        // Otherwise, exchange the code for a token via API
        setStatus('Exchanging code for token...');

        // Send the code to our backend
        const response = await fetch('/api/auth/github/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to authenticate with GitHub');
        }

        const data = await response.json();

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
      } catch (error) {
        console.error('GitHub callback error:', error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to authenticate'}`);
      }
    };

    const processToken = (token: string) => {
      // Create a mock response to maintain compatibility with the rest of the code
      const data = {
        token,
        user: {
          id: 'github-user',
          username: 'GitHub User',
          provider: 'github'
        }
      };

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
        <h1 className="text-2xl font-bold mb-4">GitHub Authentication</h1>
        <div className="animate-pulse">
          <p className="text-muted-foreground">{status}</p>
        </div>
      </div>
    </div>
  );
}
