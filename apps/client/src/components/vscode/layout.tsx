import React, { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { ActivityBar } from './activity-bar';
import { Sidebar } from './sidebar';
import { Editor } from './editor';
import { StatusBar } from './status-bar';
import { cn } from '../../lib/utils';

interface VSCodeLayoutProps {
  children?: React.ReactNode;
}

export function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const { mode } = useTheme();
  const [activeView, setActiveView] = useState<'explorer' | 'search' | 'git' | 'debug' | 'extensions'>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // VS Code theme colors based on our existing theme modes
  const themeColors = {
    light: {
      activityBar: 'bg-[#2C2C2C] text-[#CCCCCC]',
      sidebar: 'bg-[#F3F3F3] text-[#333333]',
      editor: 'bg-white text-[#1E1E1E]',
      statusBar: 'bg-[#007ACC] text-white',
    },
    dark: {
      activityBar: 'bg-[#333333] text-[#CCCCCC]',
      sidebar: 'bg-[#252526] text-[#CCCCCC]',
      editor: 'bg-[#1E1E1E] text-[#D4D4D4]',
      statusBar: 'bg-[#007ACC] text-white',
    },
    terminal: {
      activityBar: 'bg-black text-green-500',
      sidebar: 'bg-[#0E1E0E] text-green-400',
      editor: 'bg-black text-green-500 font-mono',
      statusBar: 'bg-[#003B00] text-green-400',
    },
  };

  const colors = themeColors[mode];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar 
          activeView={activeView} 
          setActiveView={setActiveView}
          setSidebarOpen={setSidebarOpen}
          className={colors.activityBar}
        />
        
        {sidebarOpen && (
          <Sidebar 
            activeView={activeView}
            className={cn('w-64 border-r border-[#474747]', colors.sidebar)}
          />
        )}
        
        <Editor className={cn('flex-1', colors.editor)}>
          {children}
        </Editor>
      </div>
      
      <StatusBar className={colors.statusBar} />
    </div>
  );
}
