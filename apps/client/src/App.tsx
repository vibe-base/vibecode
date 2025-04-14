import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { GitHubLoginButton } from './components/ui/github-login-button';
import { GoogleLoginButton } from './components/ui/google-login-button';
import { ThemeToggle } from './components/ui/theme-toggle';
import { VSCodeLayout } from './components/vscode/layout';
import AuthCallback from './pages/AuthCallback';
import GoogleCallback from './pages/GoogleCallback';
import Login from './pages/Login';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/github-callback" element={<AuthCallback />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <VSCodeLayout>
                    {/* Your main app content */}
                  </VSCodeLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
