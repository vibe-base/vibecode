export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  lastModified: string;
}

export const sampleFiles: CodeFile[] = [
  {
    id: 'file1',
    name: 'App.tsx',
    language: 'TypeScript',
    lastModified: '2023-11-25T14:32:00Z',
    content: `import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;`
  },
  {
    id: 'file2',
    name: 'theme.tsx',
    language: 'TypeScript',
    lastModified: '2023-11-24T10:15:00Z',
    content: `import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'terminal';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Load theme preference from localStorage on mount
    const savedMode = localStorage.getItem('theme_mode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'terminal'].includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Apply theme classes to the document element
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-terminal');
    
    // Add the current theme class
    root.classList.add(\`theme-\${mode}\`);
    
    // Save to localStorage
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'terminal';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}`
  },
  {
    id: 'file3',
    name: 'ProjectsPage.tsx',
    language: 'TypeScript',
    lastModified: '2023-11-26T09:45:00Z',
    content: `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../data/mock-projects';
import { projectService } from '../services/mock-project-service';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Modal } from '../components/ui/Modal';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Function to fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (e) {
      console.error('Error fetching projects:', e);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    navigate(\`/projects/\${projectId}\`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-6 hover:shadow-lg cursor-pointer"
              onClick={() => handleSelectProject(project.id)}
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`
  },
  {
    id: 'file4',
    name: 'package.json',
    language: 'JSON',
    lastModified: '2023-11-20T16:30:00Z',
    content: `{
  "name": "vibecode-client",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.4",
    "axios": "^1.5.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.279.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.16.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/node": "^20.6.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.15",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.30",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`
  },
  {
    id: 'file5',
    name: 'README.md',
    language: 'Markdown',
    lastModified: '2023-11-15T11:20:00Z',
    content: `# VibeCode

A collaborative coding platform with VS Code-like interface and AI assistance.

## Features

- VS Code-like interface
- Real-time collaboration
- Multiple themes (Light, Dark, Terminal)
- Project management
- AI code assistance

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/vibecode.git
   cd vibecode
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:3000\`

## Project Structure

- \`/src\` - Source code
  - \`/components\` - React components
  - \`/lib\` - Utility functions and hooks
  - \`/pages\` - Page components
  - \`/services\` - API services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.`
  }
];

// Function to get a file by ID
export const getFileById = (id: string): CodeFile | undefined => {
  return sampleFiles.find(file => file.id === id);
};

// Function to get a file by name
export const getFileByName = (name: string): CodeFile | undefined => {
  return sampleFiles.find(file => file.name === name);
};
