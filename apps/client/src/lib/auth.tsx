import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a named function for the hook to make it compatible with Fast Refresh
function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the hook with a consistent name
export const useAuth = useAuthContext;

// Create a named function for the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect running');

    // Check if we have a token in localStorage
    const token = localStorage.getItem('auth_token');
    console.log('Token from localStorage:', token ? 'exists' : 'not found');

    if (token) {
      // Fetch user data from API
      console.log('Fetching user data with token from localStorage');
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }

    // Check if we're on the callback page with a token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    console.log('Token from URL:', urlToken ? 'exists' : 'not found');

    if (urlToken) {
      console.log('Found token in URL, saving to localStorage');
      // Save token to localStorage
      localStorage.setItem('auth_token', urlToken);
      // Remove token from URL to prevent it from being shared
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user data
      console.log('Fetching user data with token from URL');
      fetchUserData(urlToken);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      setIsLoading(true);
      console.log('Making API request to fetch user data');
      // Get the current hostname
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = hostname === 'localhost' ? ':8000' : '';

      const url = `${protocol}//${hostname}${port}/api/auth/me?token=${token}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser({
          username: userData.username,
          email: userData.email,
          fullName: userData.full_name,
          avatarUrl: userData.avatar_url,
        });
        console.log('User state updated');
      } else {
        console.error('API response not OK:', await response.text());
        // If the token is invalid, clear it
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  };

  const login = () => {
    // GitHub OAuth parameters
    const clientId = 'Iv23liWkm8qUlFlLAXKe'; // Your GitHub OAuth App Client ID

    // Get the current origin for the redirect URI
    const origin = window.location.origin;
    console.log(`Current origin: ${origin}`);

    // Build the redirect URI
    const redirectUri = encodeURIComponent(`${origin}/github-callback`);
    const scope = 'user:email';

    // Build the GitHub authorization URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    console.log(`Redirecting directly to GitHub: ${githubAuthUrl}`);

    // Redirect directly to GitHub
    window.location.href = githubAuthUrl;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth is now defined at the top of the file
