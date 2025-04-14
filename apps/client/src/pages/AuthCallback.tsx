import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      setError('No authorization code received');
      setIsLoading(false);
      return;
    }

    const exchangeCode = async () => {
      try {
        console.log('Exchanging GitHub code for token');

        // Send the code to our backend API
        const response = await fetch('/api/auth/github/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          console.error(`Server error: ${response.status}`);
          const errorText = await response.text();
          console.error(`Response body: ${errorText}`);
          throw new Error(`Authentication failed: ${response.statusText}`);
        }

        // Try to parse the response as JSON
        let data;
        try {
          data = await response.json();
          console.log('Received token response:', data);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Invalid response format from server');
        }

        if (!data.token) {
          throw new Error('No token received from server');
        }

        // Store the token and user data
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Update auth context
        setToken(data.token);
        setUser(data.user);

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsLoading(false);
      }
    };

    exchangeCode();
  }, [navigate, setToken, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">GitHub Authentication</h1>
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">Connecting to GitHub...</p>
      </div>
    </div>
  );
}
