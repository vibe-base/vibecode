import React from 'react';
import { ContainerStatus } from '../container/container-status';
import { useTheme } from '../../lib/theme';
import { cn } from '../../lib/utils';

interface ContainerPanelProps {
  projectId: string;
  className?: string;
}

export function ContainerPanel({ projectId, className }: ContainerPanelProps) {
  const { mode } = useTheme();
  
  // Get theme-specific styles
  const getThemeStyles = () => {
    if (mode === 'light') {
      return {
        container: 'bg-white border-t border-gray-200',
        header: 'bg-gray-100 border-b border-gray-200',
      };
    } else if (mode === 'terminal') {
      return {
        container: 'bg-black border-t border-green-900',
        header: 'bg-green-900 border-b border-green-700',
      };
    } else {
      // Dark mode (default)
      return {
        container: 'bg-[#1E1E1E] border-t border-[#3E3E3E]',
        header: 'bg-[#252526] border-b border-[#3E3E3E]',
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={cn('h-64 overflow-hidden flex flex-col', styles.container, className)}>
      <div className={cn('p-2 flex justify-between items-center', styles.header)}>
        <h3 className="text-sm font-semibold">Container</h3>
        <button className="text-xs px-2 py-1 rounded hover:bg-black hover:bg-opacity-10">
          Minimize
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <ContainerStatus projectId={projectId} />
      </div>
    </div>
  );
}
