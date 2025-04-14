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
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
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
    const token = localStorage.getItem('token');
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
    const urlUser = urlParams.get('user');
    const urlError = urlParams.get('error');

    console.log('Token from URL:', urlToken ? 'exists' : 'not found');
    console.log('User data from URL:', urlUser ? 'exists' : 'not found');
    console.log('Error from URL:', urlError ? urlError : 'none');

    if (urlError) {
      console.error('Authentication error from URL:', urlError);
      setIsLoading(false);
      return;
    }

    if (urlToken) {
      console.log('Found token in URL, saving to localStorage');
      // Save token to localStorage
      localStorage.setItem('token', urlToken);

      // If we're on the root path and have a token, this might be from Google OAuth
      // But we don't want to create a redirect loop, so we'll just process the token here
      if (window.location.pathname === '/' && urlParams.has('source') && urlParams.get('source') === 'google') {
        console.log('Processing Google OAuth token directly');
        // We'll fetch user data directly instead of redirecting
        fetchUserData(urlToken);
        // Remove token and source from URL to prevent it from being shared
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // If we have user data in the URL, use it directly
      if (urlUser) {
        try {
          const userData = JSON.parse(decodeURIComponent(urlUser));
          console.log('User data from URL:', userData);
          setUser({
            username: userData.username,
            email: userData.email,
            fullName: userData.full_name,
            avatarUrl: userData.avatar_url,
          });
          localStorage.setItem('user', JSON.stringify(userData));
          setIsLoading(false);
        } catch (error) {
          console.error('Error parsing user data from URL:', error);
          // If we can't parse the user data, fetch it from the API
          fetchUserData(urlToken);
        }
      } else {
        // If we don't have user data in the URL, fetch it from the API
        console.log('Fetching user data with token from URL');
        fetchUserData(urlToken);
      }

      // Remove token and user data from URL to prevent it from being shared
      window.history.replaceState({}, document.title, window.location.pathname);
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
        const data = await response.json();
        console.log('API response data:', data);

        // Check if the data has a nested user object (from /api/auth/me endpoint)
        const userData = data.user || data;
        console.log('User data extracted:', userData);

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
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  };

  const login = () => {
    // For demo purposes, simulate a successful login
    const mockUser = {
      username: 'demo_user',
      email: 'demo@example.com',
      fullName: 'Demo User',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4'
    };

    // Generate a mock token
    const mockToken = 'mock_token_' + Math.random().toString(36).substring(2);

    // Store the token and user data
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Update the auth context
    setUser(mockUser);

    console.log('Logged in with demo account');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Function to set the user directly
  const setUserDirectly = (newUser: User | null) => {
    setUser(newUser);
  };

  // Function to set the token directly
  const setTokenDirectly = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser: setUserDirectly,
        setToken: setTokenDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth is now defined at the top of the file
