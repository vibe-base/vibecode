import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { GitHubLoginButton } from './components/ui/github-login-button';
import { GoogleLoginButton } from './components/ui/google-login-button';
import { ThemeToggle } from './components/ui/theme-toggle';
import { VSCodeLayout } from './components/vscode/layout';
import { Button } from './components/ui/button';
import { Toaster } from "./components/ui/toaster"
import { DevModeIndicator } from './components/dev/DevModeIndicator';
import { setupDevModeShortcut, enableDevMode } from './lib/dev-mode';
import AuthCallback from './pages/AuthCallback';
import GoogleCallback from './pages/GoogleCallback';
import Login from './pages/Login';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';

function HomePage() {
  const { isAuthenticated, login, logout } = useAuth();
  const { mode } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-primary"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                transform: `rotate(${Math.random() * 360}deg)`,
                fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`
              }}
            >
              {['<>', '{}', '()', '[]', '//', '/*', '*/', '=>', '===', '&&', '||'][Math.floor(Math.random() * 11)]}
            </div>
          ))}
        </div>
      </div>

      {/* Header with subtle gradient border bottom */}
      <header className="w-full py-4 px-6 backdrop-blur-sm bg-background/80 border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              VibeCode
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {/* Hero section */}
        <div className="max-w-5xl w-full text-center mb-16 mt-8 relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 leading-tight">
            Code with <span className="relative inline-block">AI<span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></span></span> Assistance
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            The next generation collaborative development environment that enhances your coding experience with powerful AI tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/projects"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                View Your Projects
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Get Started
                </Link>
                <button
                  onClick={login}
                  className="px-8 py-4 border-2 border-purple-500/30 text-primary rounded-lg hover:bg-purple-500/10 transition-all duration-300 inline-flex items-center justify-center gap-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Try Demo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="max-w-6xl w-full py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Code Assistance</h3>
              <p className="text-muted-foreground">Get intelligent code suggestions, completions, and explanations as you type.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Editing</h3>
              <p className="text-muted-foreground">Work together in real-time with your team members on the same codebase.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-muted-foreground">Get intelligent suggestions and insights to improve your code quality and performance.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} VibeCode. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Add keyframe animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - isLoading:', isLoading);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    // Set up dev mode keyboard shortcut
    setupDevModeShortcut();

    // Enable dev mode by default in development
    if (process.env.NODE_ENV === 'development') {
      enableDevMode();
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/github-callback" element={<AuthCallback />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
          <DevModeIndicator />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
