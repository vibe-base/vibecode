import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';

interface ProfileDropdownProps {
  className?: string;
}

export function ProfileDropdown({ className }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'terminal') => {
    setMode(newMode);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2D2D2D]/50 transition-colors"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm hidden md:inline">{user.fullName || user.username}</span>
        <svg 
          className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-180" : "")} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#252526] border border-[#474747] z-50">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-2 border-b border-[#474747]">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Theme Options */}
            <div className="px-4 py-2 border-b border-[#474747]">
              <p className="text-xs text-muted-foreground mb-2">Theme</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    mode === 'light' ? "ring-2 ring-blue-500" : ""
                  )}
                  title="Light Theme"
                >
                  <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                </button>
                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    mode === 'dark' ? "ring-2 ring-blue-500" : ""
                  )}
                  title="Dark Theme"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1E1E1E] border border-gray-700"></div>
                </button>
                <button 
                  onClick={() => handleThemeChange('terminal')}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    mode === 'terminal' ? "ring-2 ring-blue-500" : ""
                  )}
                  title="Terminal Theme"
                >
                  <div className="w-6 h-6 rounded-full bg-black border border-green-500 flex items-center justify-center">
                    <span className="text-green-500 text-xs">$</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <a 
              href="#settings" 
              className="block px-4 py-2 text-sm hover:bg-[#2D2D2D] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </a>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-[#2D2D2D] transition-colors text-red-400"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
