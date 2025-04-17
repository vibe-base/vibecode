import React, { useEffect, useState } from 'react';
import { isDevModeEnabled, toggleDevMode } from '../../lib/dev-mode';

export function DevModeIndicator() {
  const [devMode, setDevMode] = useState(false);
  
  useEffect(() => {
    // Check if dev mode is enabled
    setDevMode(isDevModeEnabled());
    
    // Add event listener for storage changes (in case dev mode is toggled in another tab)
    const handleStorageChange = () => {
      setDevMode(isDevModeEnabled());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: devMode ? '#4CAF50' : '#F44336',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>DEV MODE: {devMode ? 'ON' : 'OFF'}</div>
      <button
        onClick={() => {
          toggleDevMode();
          window.location.reload();
        }}
        style={{
          backgroundColor: devMode ? '#388E3C' : '#D32F2F',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {devMode ? 'Disable' : 'Enable'} Dev Mode
      </button>
      <div style={{ fontSize: '10px', opacity: 0.8 }}>
        Press Alt+Shift+D to toggle
      </div>
    </div>
  );
}
