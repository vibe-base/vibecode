import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './lib/auth';
import { GitHubLoginButton } from './components/ui/github-login-button';
import { UserProfile } from './components/ui/user-profile';
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">VibeCode</h1>
          <GitHubLoginButton />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">VibeCode</h1>
          <p className="text-center text-muted-foreground mb-4">
            A modern development environment for building applications
          </p>
          <div className="flex justify-center">
            <GitHubLoginButton className="w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple Projects Page component
function ProjectsPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([
    { id: '1', name: 'VibeCode', description: 'A collaborative coding platform with AI assistance' },
    { id: '2', name: 'Data Analyzer', description: 'Tool for analyzing and visualizing large datasets' },
    { id: '3', name: 'Mobile App', description: 'Cross-platform mobile application for task management' },
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">VibeCode</h1>
          <div className="flex items-center gap-4">
            <span>{user?.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.username || 'User'}!</h1>
          <p className="text-gray-600">Manage your coding projects</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                Open Project
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/github-callback" element={<AuthCallback />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
