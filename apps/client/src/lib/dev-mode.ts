/**
 * Utility for managing development mode features
 */

// Check if we're in development mode
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';
};

// Local storage key for dev mode settings
const DEV_MODE_KEY = 'vibe_dev_mode_enabled';

// Get current dev mode state
export const isDevModeEnabled = (): boolean => {
  if (!isDevelopment()) return false;
  
  const stored = localStorage.getItem(DEV_MODE_KEY);
  return stored === 'true';
};

// Toggle dev mode
export const toggleDevMode = (): boolean => {
  if (!isDevelopment()) return false;
  
  const newState = !isDevModeEnabled();
  localStorage.setItem(DEV_MODE_KEY, newState.toString());
  return newState;
};

// Enable dev mode
export const enableDevMode = (): void => {
  if (isDevelopment()) {
    localStorage.setItem(DEV_MODE_KEY, 'true');
  }
};

// Disable dev mode
export const disableDevMode = (): void => {
  localStorage.setItem(DEV_MODE_KEY, 'false');
};

// Add a keyboard shortcut to toggle dev mode (Alt+Shift+D)
export const setupDevModeShortcut = (): void => {
  if (!isDevelopment()) return;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.shiftKey && e.key === 'D') {
      const newState = toggleDevMode();
      console.log(`Dev mode ${newState ? 'enabled' : 'disabled'}`);
      
      // Show visual feedback
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.top = '10px';
      notification.style.right = '10px';
      notification.style.backgroundColor = newState ? '#4CAF50' : '#F44336';
      notification.style.color = 'white';
      notification.style.padding = '10px 20px';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '9999';
      notification.style.fontFamily = 'Arial, sans-serif';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.textContent = `Development Mode: ${newState ? 'ENABLED' : 'DISABLED'}`;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
      }, 2000);
      
      // Reload the page to apply changes
      window.location.reload();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
};
