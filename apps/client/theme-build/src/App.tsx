import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './lib/auth';
import { ThemeProvider, useTheme } from './lib/theme';
import { GitHubLoginButton } from './components/ui/github-login-button';
import { ThemeToggle } from './components/ui/theme-toggle';
import AuthCallback from './pages/AuthCallback';

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { mode } = useTheme();

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

  // Apply different background based on theme
  const bgClasses = {
    light: "bg-gradient-to-b from-blue-100 to-white text-blue-900",
    dark: "bg-gradient-to-b from-blue-900 to-black text-white",
    terminal: "bg-black text-green-500 font-mono"
  };

  return (
    <div className={`min-h-screen ${bgClasses[mode]} flex flex-col`}>
      <header className={`border-b ${mode === 'terminal' ? 'border-green-700' : mode === 'light' ? 'border-blue-200' : 'border-blue-700'} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${mode === 'terminal' ? 'text-green-400' : mode === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1 className={`text-2xl font-bold ${mode === 'terminal' ? 'text-green-400' : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'}`}>VibeCode</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle className={mode === 'terminal' ? 'text-green-400 hover:bg-green-900 hover:bg-opacity-30' : mode === 'light' ? 'text-blue-600 hover:bg-blue-100' : 'text-blue-400 hover:bg-blue-800 hover:bg-opacity-30'} />
            <GitHubLoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">VibeCode</h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto">
            The next generation collaborative development environment with AI assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#features" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Learn More
            </a>
            <a href="#signup" className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-blue-900 bg-opacity-50 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 VibeCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
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

  // Apply different background based on theme
  const bgClasses = {
    light: "bg-gradient-to-b from-blue-100 to-white text-blue-900",
    dark: "bg-gradient-to-b from-blue-900 to-black text-white",
    terminal: "bg-black text-green-500 font-mono"
  };

  return (
    <div className={`min-h-screen ${bgClasses[mode]} flex flex-col`}>
      <header className={`border-b ${mode === 'terminal' ? 'border-green-700' : mode === 'light' ? 'border-blue-200' : 'border-blue-700'} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${mode === 'terminal' ? 'text-green-400' : mode === 'light' ? 'text-blue-600' : 'text-blue-400'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1 className={`text-2xl font-bold ${mode === 'terminal' ? 'text-green-400' : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'}`}>VibeCode</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className={mode === 'terminal' ? 'text-green-400 hover:bg-green-900 hover:bg-opacity-30' : mode === 'light' ? 'text-blue-600 hover:bg-blue-100' : 'text-blue-400 hover:bg-blue-800 hover:bg-opacity-30'} />
            <span className={mode === 'terminal' ? 'text-green-300' : mode === 'light' ? 'text-blue-600' : 'text-blue-300'}>{user?.username}</span>
            <button
              onClick={logout}
              className={`px-4 py-2 ${mode === 'terminal' ? 'bg-red-900 text-green-400' : 'bg-red-500 text-white'} rounded-md hover:bg-red-600 transition-colors`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Open
                </button>
              </div>
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
