import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { GitHubLoginButton } from './components/ui/github-login-button';
import { ThemeToggle } from './components/ui/theme-toggle';
import { VSCodeLayout } from './components/vscode/layout';
import AuthCallback from './pages/AuthCallback';

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  // If authenticated, redirect to projects page
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <VSCodeLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Welcome to VibeCode</h1>
          <p className="text-xl mb-8">
            The next generation collaborative development environment with VS Code-like interface and AI assistance
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-700 bg-black bg-opacity-10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  VS Code-like interface
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Real-time collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Integrated terminal
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI code assistance
                </li>
              </ul>
            </div>

            <div className="border border-gray-700 bg-black bg-opacity-10 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <p className="mb-4">Sign in with your GitHub account to start coding.</p>
              <GitHubLoginButton className="w-full py-2" />
            </div>
          </div>

          <p className="text-sm text-center text-gray-400">
            &copy; 2023 VibeCode. All rights reserved.
          </p>
        </div>
      </div>
    </VSCodeLayout>
  );
}

function ProjectsPage() {
  const { user, logout } = useAuth();
  const { mode } = useTheme();
  const [projects] = useState([
    { id: '1', name: 'VibeCode', description: 'A collaborative coding platform with AI assistance' },
    { id: '2', name: 'Data Analyzer', description: 'Tool for analyzing and visualizing large datasets' },
    { id: '3', name: 'Mobile App', description: 'Cross-platform mobile application for task management' },
  ]);

  return (
    <VSCodeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <div className="flex items-center gap-2">
            <span>{user?.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-700 bg-black bg-opacity-10 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </VSCodeLayout>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/github-callback" element={<AuthCallback />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
