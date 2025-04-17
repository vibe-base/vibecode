import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ProfileDropdown } from '../ui/profile-dropdown';
import { CodeFile } from './code-file';
import { sampleFiles, getFileByName } from '../../data/sample-code';
import { useTheme } from '../../lib/theme';

interface EditorProps {
  children?: React.ReactNode;
  className?: string;
}

export function Editor({ children, className }: EditorProps) {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState('App.tsx');
  const [activeFile, setActiveFile] = useState(getFileByName('App.tsx'));
  const tabs = sampleFiles.map(file => file.name);

  // Update active file when tab changes
  useEffect(() => {
    const file = getFileByName(activeTab);
    if (file) {
      setActiveFile(file);
    }
  }, [activeTab]);

  // Get theme-specific styles
  const getTabStyles = (isActive: boolean) => {
    const baseStyles = 'px-4 py-2 text-sm flex items-center';

    if (mode === 'light') {
      return cn(
        baseStyles,
        isActive
          ? 'bg-white border-t-2 border-t-blue-500 border-b border-b-white'
          : 'bg-gray-200 hover:bg-gray-300'
      );
    } else if (mode === 'terminal') {
      return cn(
        baseStyles,
        isActive
          ? 'bg-black border-t-2 border-t-green-500 border-b border-b-black font-mono text-green-400'
          : 'bg-[#0E1E0E] hover:bg-[#162E16] font-mono text-green-500'
      );
    } else {
      // Dark mode (default)
      return cn(
        baseStyles,
        isActive
          ? 'bg-[#1E1E1E] border-t-2 border-t-blue-500 border-b border-b-[#1E1E1E]'
          : 'bg-[#2D2D2D] hover:bg-[#2D2D2D]/80'
      );
    }
  };

  // Get border color based on theme
  const getBorderColor = () => {
    if (mode === 'light') return 'border-gray-300';
    if (mode === 'terminal') return 'border-green-900';
    return 'border-[#474747]';
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className={`flex justify-between border-b ${getBorderColor()}`}>
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              className={getTabStyles(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <ProfileDropdown className="mr-2 self-center" />
      </div>

      <div className="flex-1 overflow-hidden">
        {children ? (
          children
        ) : activeFile ? (
          <CodeFile
            fileName={activeFile.name}
            language={activeFile.language}
            content={activeFile.content}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p>No file selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
