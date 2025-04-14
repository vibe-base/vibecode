import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [exchanging, setExchanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle GitHub code exchange
  useEffect(() => {
    console.log('AuthCallback rendered');

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    console.log('GitHub code in URL:', code ? code : 'not present');
    console.log('Full URL:', window.location.href);

    // Function to exchange code for token
    const exchangeCodeForToken = async (code: string) => {
      try {
        setExchanging(true);
        console.log('Exchanging GitHub code for token');

        // Update to correct FastAPI endpoint
        const backendUrl = `http://localhost:8000/api/fastapi/auth/github/exchange?code=${code}`;
        console.log(`Using backend URL: ${backendUrl}`);

        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server error: ${response.status} - ${errorText}`);
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Received token from backend:', data);

        // Save token to localStorage
        localStorage.setItem('auth_token', data.access_token);

        // Navigate to the home page
        window.location.href = '/';
      } catch (error) {
        console.error('Error calling backend API:', error);
        setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setExchanging(false);
      }
    };

    // Exchange code for token if we have a code
    if (code && !isAuthenticated && !exchanging) {
      exchangeCodeForToken(code);
    } else if (!code && !isLoading && !isAuthenticated) {
      // If we don't have a code and we're not authenticated, redirect to home
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Render loading or error state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">GitHub Authentication</h1>
        {error ? (
          <div className="mt-4 text-red-500">
            <p>Authentication failed</p>
            <p className="text-sm mt-2">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-2 text-muted-foreground">Please wait while we log you in...</p>
            <p className="mt-2 text-sm text-gray-500">
              Status: {exchanging ? 'Exchanging code for token...' :
                      isLoading ? 'Loading user data...' :
                      isAuthenticated ? 'Authenticated!' : 'Waiting...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
