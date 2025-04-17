import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';

export function UserProfileDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, setMode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (mode) {
      case 'light':
        return {
          button: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
          dropdown: 'bg-white border border-gray-200 shadow-lg',
          item: 'text-gray-700 hover:bg-gray-100',
          divider: 'border-gray-200',
          logoutButton: 'text-red-600 hover:bg-red-50'
        };
      case 'dark':
        return {
          button: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
          dropdown: 'bg-gray-800 border border-gray-700 shadow-lg',
          item: 'text-gray-200 hover:bg-gray-700',
          divider: 'border-gray-700',
          logoutButton: 'text-red-400 hover:bg-red-900/30'
        };
      case 'terminal':
        return {
          button: 'bg-black hover:bg-green-900 text-green-400 border border-green-800 font-mono',
          dropdown: 'bg-black border border-green-800 shadow-lg font-mono',
          item: 'text-green-400 hover:bg-green-900/50',
          divider: 'border-green-900',
          logoutButton: 'text-red-500 hover:bg-red-900/20 font-mono'
        };
      default:
        return {
          button: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
          dropdown: 'bg-white border border-gray-200 shadow-lg',
          item: 'text-gray-700 hover:bg-gray-100',
          divider: 'border-gray-200',
          logoutButton: 'text-red-600 hover:bg-red-50'
        };
    }
  };

  const styles = getThemeStyles();

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  // Handle login
  const handleLogin = () => {
    navigate('/login');
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className={`px-4 py-2 rounded-md ${styles.button}`}
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative user-dropdown">
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md ${styles.button}`}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span>{user?.username || 'User'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${styles.dropdown}`}>
          <div className="py-1">
            <div className="px-4 py-2 text-sm font-medium">
              {user?.fullName || user?.username}
            </div>
            <div className="px-4 py-1 text-xs opacity-75">
              {user?.email}
            </div>
            <div className={`my-1 border-t ${styles.divider}`}></div>
            <a
              href="/profile"
              className={`block px-4 py-2 text-sm ${styles.item}`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </a>
            <a
              href="/settings"
              className={`block px-4 py-2 text-sm ${styles.item}`}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </a>

            {/* Theme selector */}
            <div className={`my-1 border-t ${styles.divider}`}></div>
            <div className="px-4 py-2 text-sm font-medium">Theme</div>
            <div className="px-3 py-1 flex justify-between space-x-2">
              {/* Light theme button */}
              <button
                onClick={() => setMode('light')}
                className={`flex-1 p-2 rounded-md flex flex-col items-center ${mode === 'light' ? (mode === 'terminal' ? 'ring-2 ring-green-500' : 'ring-2 ring-blue-500') : mode === 'terminal' ? 'hover:bg-green-900/30' : mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Light theme"
              >
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className={`text-xs ${mode === 'terminal' ? 'font-mono text-green-400' : ''}`}>Light</span>
              </button>

              {/* Dark theme button */}
              <button
                onClick={() => setMode('dark')}
                className={`flex-1 p-2 rounded-md flex flex-col items-center ${mode === 'dark' ? (mode === 'terminal' ? 'ring-2 ring-green-500' : 'ring-2 ring-blue-500') : mode === 'terminal' ? 'hover:bg-green-900/30' : mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Dark theme"
              >
                <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <span className={`text-xs ${mode === 'terminal' ? 'font-mono text-green-400' : ''}`}>Dark</span>
              </button>

              {/* Terminal theme button */}
              <button
                onClick={() => setMode('terminal')}
                className={`flex-1 p-2 rounded-md flex flex-col items-center ${mode === 'terminal' ? 'ring-2 ring-green-500' : mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Terminal theme"
              >
                <div className="w-6 h-6 rounded-full bg-black border border-green-800 flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`text-xs ${mode === 'terminal' ? 'font-mono text-green-400' : ''}`}>Terminal</span>
              </button>
            </div>

            <div className={`my-1 border-t ${styles.divider}`}></div>
            <button
              onClick={handleLogout}
              className={`block w-full text-left px-4 py-2 text-sm ${styles.logoutButton}`}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
