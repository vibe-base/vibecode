import React, { useState, useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { ActivityBar } from './activity-bar';
import { Sidebar } from './sidebar';
import { Editor } from './editor';
import { StatusBar } from './status-bar';
import { ContainerPanel } from './container-panel';
import { cn } from '../../lib/utils';
import { useLocation, useParams } from 'react-router-dom';

interface VSCodeLayoutProps {
  children?: React.ReactNode;
}

export function VSCodeLayout({ children }: VSCodeLayoutProps) {
  const { mode } = useTheme();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeView, setActiveView] = useState<'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'docker'>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showContainerPanel, setShowContainerPanel] = useState(true);
  const [key, setKey] = useState(0); // Add a key to force re-render

  // Force re-render when location changes
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [location.pathname]);

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

        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor className={cn('flex-1', colors.editor)}>
            {/* Render children directly without the key-based div wrapper */}
            {children}
          </Editor>

          {/* Container Panel - only show if we have a projectId */}
          {projectId && showContainerPanel && (
            <ContainerPanel projectId={projectId} />
          )}
        </div>
      </div>

      <StatusBar className={colors.statusBar} />
    </div>
  );
}
