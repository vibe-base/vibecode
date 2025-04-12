import React, { createContext, useContext, useState, useEffect } from 'react';

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
    root.classList.add(`theme-${mode}`);
    
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
}
