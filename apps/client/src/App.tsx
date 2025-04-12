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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col">
      <header className="border-b border-blue-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">VibeCode</h1>
          </div>
          <GitHubLoginButton />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">VibeCode</h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto">
            The next generation collaborative development environment with AI assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GitHubLoginButton className="px-8 py-3 text-lg rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl" />
            <button className="px-8 py-3 text-lg rounded-lg bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-blue-900 bg-opacity-30 p-6 rounded-xl border border-blue-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-blue-300">Collaborative Coding</h3>
            <p className="text-blue-200">Code together in real-time with your team members from anywhere in the world.</p>
          </div>
          
          <div className="bg-blue-900 bg-opacity-30 p-6 rounded-xl border border-blue-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-blue-300">AI Assistance</h3>
            <p className="text-blue-200">Get intelligent code suggestions and autocompletions powered by advanced AI models.</p>
          </div>
          
          <div className="bg-blue-900 bg-opacity-30 p-6 rounded-xl border border-blue-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold mb-2 text-blue-300">Integrated Tools</h3>
            <p className="text-blue-200">Everything you need in one place - version control, testing, deployment, and more.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-blue-800 p-6 text-center text-blue-400">
        <p>© 2025 VibeCode. All rights reserved.</p>
      </footer>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col">
      <header className="border-b border-blue-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">VibeCode</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-300">{user?.username}</span>
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Welcome, {user?.username || 'User'}!</h1>
          <p className="text-blue-300">Manage your coding projects</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-200">Your Projects</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md transition-colors">
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-blue-900 bg-opacity-30 p-6 rounded-xl border border-blue-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30">
              <h3 className="text-xl font-bold mb-2 text-blue-300">{project.name}</h3>
              <p className="text-blue-200 mb-4">{project.description}</p>
              <button className="w-full px-4 py-2 bg-blue-800 text-blue-200 rounded-md hover:bg-blue-700 transition-colors">
                Open Project
              </button>
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t border-blue-800 p-6 text-center text-blue-400">
        <p>© 2025 VibeCode. All rights reserved.</p>
      </footer>
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
