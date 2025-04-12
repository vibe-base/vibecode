import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeView: 'explorer' | 'search' | 'git' | 'debug' | 'extensions';
  className?: string;
}

export function Sidebar({ activeView, className }: SidebarProps) {
  return (
    <div className={cn('h-full overflow-y-auto', className)}>
      {activeView === 'explorer' && <ExplorerView />}
      {activeView === 'search' && <SearchView />}
      {activeView === 'git' && <GitView />}
      {activeView === 'debug' && <DebugView />}
      {activeView === 'extensions' && <ExtensionsView />}
    </div>
  );
}

function ExplorerView() {
  const [expanded, setExpanded] = useState({
    'src': true,
    'components': true,
    'pages': false,
    'lib': false,
  });

  const toggleExpand = (folder: string) => {
    setExpanded(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  return (
    <div className="p-2">
      <div className="text-sm font-semibold uppercase tracking-wider mb-2 px-2">Explorer</div>
      
      <div className="mb-2">
        <div className="flex items-center px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10" onClick={() => toggleExpand('src')}>
          <span className="mr-1">{expanded['src'] ? '▼' : '►'}</span>
          <span className="font-medium">src</span>
        </div>
        
        {expanded['src'] && (
          <div className="ml-4">
            <div className="flex items-center px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10" onClick={() => toggleExpand('components')}>
              <span className="mr-1">{expanded['components'] ? '▼' : '►'}</span>
              <span>components</span>
            </div>
            
            {expanded['components'] && (
              <div className="ml-4">
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">Button.tsx</span>
                </div>
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">Card.tsx</span>
                </div>
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">Input.tsx</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10" onClick={() => toggleExpand('pages')}>
              <span className="mr-1">{expanded['pages'] ? '▼' : '►'}</span>
              <span>pages</span>
            </div>
            
            {expanded['pages'] && (
              <div className="ml-4">
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">Home.tsx</span>
                </div>
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">About.tsx</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10" onClick={() => toggleExpand('lib')}>
              <span className="mr-1">{expanded['lib'] ? '▼' : '►'}</span>
              <span>lib</span>
            </div>
            
            {expanded['lib'] && (
              <div className="ml-4">
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">utils.ts</span>
                </div>
                <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
                  <span className="text-blue-500">api.ts</span>
                </div>
              </div>
            )}
            
            <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
              <span className="text-blue-500">App.tsx</span>
            </div>
            <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
              <span className="text-blue-500">main.tsx</span>
            </div>
            <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
              <span className="text-blue-500">index.css</span>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
          <span className="text-amber-500">package.json</span>
        </div>
        <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
          <span className="text-amber-500">tsconfig.json</span>
        </div>
        <div className="px-2 py-1 cursor-pointer hover:bg-black hover:bg-opacity-10">
          <span className="text-amber-500">README.md</span>
        </div>
      </div>
    </div>
  );
}

function SearchView() {
  return (
    <div className="p-2">
      <div className="text-sm font-semibold uppercase tracking-wider mb-2 px-2">Search</div>
      <div className="px-2">
        <input 
          type="text" 
          placeholder="Search in files" 
          className="w-full p-1 bg-opacity-20 bg-black rounded border border-gray-600 text-sm mb-2"
        />
        <div className="text-xs text-gray-400 mb-4">No results found yet. Type to search.</div>
      </div>
    </div>
  );
}

function GitView() {
  return (
    <div className="p-2">
      <div className="text-sm font-semibold uppercase tracking-wider mb-2 px-2">Source Control</div>
      <div className="px-2 py-4 text-center text-sm">
        <p>No changes detected.</p>
        <p className="text-xs text-gray-400 mt-1">Your working tree is clean.</p>
      </div>
    </div>
  );
}

function DebugView() {
  return (
    <div className="p-2">
      <div className="text-sm font-semibold uppercase tracking-wider mb-2 px-2">Run and Debug</div>
      <div className="px-2 py-4 text-center text-sm">
        <p>No debug configurations found.</p>
        <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs">Create Configuration</button>
      </div>
    </div>
  );
}

function ExtensionsView() {
  return (
    <div className="p-2">
      <div className="text-sm font-semibold uppercase tracking-wider mb-2 px-2">Extensions</div>
      <div className="px-2">
        <input 
          type="text" 
          placeholder="Search extensions" 
          className="w-full p-1 bg-opacity-20 bg-black rounded border border-gray-600 text-sm mb-2"
        />
        
        <div className="mb-2 p-2 border-b border-gray-700">
          <div className="font-medium">Installed</div>
          <div className="flex items-center py-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
              <span className="text-white font-bold">P</span>
            </div>
            <div>
              <div className="font-medium">Prettier</div>
              <div className="text-xs text-gray-400">Code formatter</div>
            </div>
          </div>
          <div className="flex items-center py-2">
            <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center mr-2">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <div className="font-medium">ESLint</div>
              <div className="text-xs text-gray-400">Linting tool</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="font-medium">Recommended</div>
          <div className="flex items-center py-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center mr-2">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <div className="font-medium">Tailwind CSS IntelliSense</div>
              <div className="text-xs text-gray-400">Intelligent Tailwind CSS tooling</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
