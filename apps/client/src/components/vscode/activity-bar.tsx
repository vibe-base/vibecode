import React from 'react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';
import { Link } from 'react-router-dom';

interface ActivityBarProps {
  activeView: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'docker';
  setActiveView: (view: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'docker') => void;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
}

export function ActivityBar({
  activeView,
  setActiveView,
  setSidebarOpen,
  className
}: ActivityBarProps) {
  const handleViewClick = (view: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'docker') => {
    if (view === activeView) {
      setSidebarOpen(prev => !prev);
    } else {
      setActiveView(view);
      setSidebarOpen(true);
    }
  };

  return (
    <div className={cn('w-12 flex flex-col items-center py-2', className)}>
      <div className="flex-1 flex flex-col items-center space-y-4">
        <ActivityBarIcon
          icon="explorer"
          active={activeView === 'explorer'}
          onClick={() => handleViewClick('explorer')}
          title="Explorer"
        />
        <ActivityBarIcon
          icon="search"
          active={activeView === 'search'}
          onClick={() => handleViewClick('search')}
          title="Search"
        />
        <ActivityBarIcon
          icon="git"
          active={activeView === 'git'}
          onClick={() => handleViewClick('git')}
          title="Source Control"
        />
        <ActivityBarIcon
          icon="debug"
          active={activeView === 'debug'}
          onClick={() => handleViewClick('debug')}
          title="Run and Debug"
        />
        <ActivityBarIcon
          icon="extensions"
          active={activeView === 'extensions'}
          onClick={() => handleViewClick('extensions')}
          title="Extensions"
        />
        <ActivityBarIcon
          icon="docker"
          active={activeView === 'docker'}
          onClick={() => handleViewClick('docker')}
          title="Containers"
        />
      </div>
      <div className="mt-auto flex flex-col items-center space-y-2" style={{ position: 'relative', zIndex: 1000 }}>
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <ProjectsButton />
        </div>
        <ThemeToggle className="hover:bg-opacity-20 hover:bg-white" />
      </div>
    </div>
  );
}

interface ActivityBarIconProps {
  icon: 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'docker';
  active: boolean;
  onClick: () => void;
  title: string;
}

function ActivityBarIcon({ icon, active, onClick, title }: ActivityBarIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-12 h-12 flex items-center justify-center relative',
        active ? 'text-white' : 'text-gray-400 hover:text-white'
      )}
      title={title}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
      )}

      {icon === 'explorer' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3z"></path>
          <path d="M3 9h18"></path>
          <path d="M15 3v18"></path>
        </svg>
      )}

      {icon === 'search' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )}

      {icon === 'git' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3"></circle>
          <circle cx="6" cy="6" r="3"></circle>
          <path d="M6 21V9a9 9 0 0 0 9 9"></path>
        </svg>
      )}

      {icon === 'debug' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      )}

      {icon === 'extensions' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6.5"></path>
          <path d="M18.5 12H22"></path>
          <path d="M12 22v-6.5"></path>
          <path d="M2 12h3.5"></path>
          <rect x="7" y="7" width="10" height="10" rx="1"></rect>
        </svg>
      )}

      {icon === 'docker' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12.5c0 1.4-1.1 2.5-2.5 2.5H5.7c-1.4 0-2.5-1.1-2.5-2.5 0-.5 0-1.9.9-2.9C5 8.7 6.1 8 7.5 8h10c1.4 0 2.5 1.1 2.5 2.5S19.4 13 18 13h-1"></path>
          <path d="M6 10h.01"></path>
          <path d="M10 10h.01"></path>
          <path d="M14 10h.01"></path>
          <path d="M18 10h.01"></path>
          <path d="M5.7 19.4c.2.5.8.8 1.3.6.5-.2.8-.8.6-1.3-.2-.5-.8-.8-1.3-.6-.5.2-.8.8-.6 1.3Z"></path>
          <path d="M7.5 15h10c1.4 0 2.5-1.1 2.5-2.5S19.4 10 18 10"></path>
        </svg>
      )}
    </button>
  );
}

function ProjectsButton() {
  return (
    <Link
      to="/projects"
      className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
      title="View Projects"
      style={{
        borderRadius: '4px',
        margin: '4px 0',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3z"></path>
        <path d="M14 3h7v7h-7z"></path>
        <path d="M14 14h7v7h-7z"></path>
        <path d="M3 14h7v7H3z"></path>
      </svg>
    </Link>
  );
}
