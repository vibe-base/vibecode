import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { ProfileDropdown } from '../ui/profile-dropdown';

interface EditorProps {
  children?: React.ReactNode;
  className?: string;
}

export function Editor({ children, className }: EditorProps) {
  const [activeTab, setActiveTab] = useState('App.tsx');
  const tabs = ['App.tsx', 'index.css', 'README.md'];

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex justify-between border-b border-[#474747]">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab}
              className={cn(
                'px-4 py-2 text-sm flex items-center',
                activeTab === tab
                  ? 'bg-[#1E1E1E] border-t-2 border-t-blue-500 border-b border-b-[#1E1E1E]'
                  : 'bg-[#2D2D2D] hover:bg-[#2D2D2D]/80'
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'App.tsx' && (
                <svg className="w-4 h-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 9.4L7.5 4.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tab === 'index.css' && (
                <svg className="w-4 h-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2V22H20V2H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 16.5L9 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tab === 'README.md' && (
                <svg className="w-4 h-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Dropdown in the top-right corner */}
        <ProfileDropdown className="mr-2 self-center" />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {children || (
          activeTab === 'App.tsx' ? (
            <div className="font-mono text-sm">
              <pre className="text-blue-400">import</pre> React <pre className="text-blue-400">from</pre> <pre className="text-green-400">'react'</pre>;
              <pre className="text-blue-400">import</pre> <pre className="text-yellow-400">{'{ useState }'}</pre> <pre className="text-blue-400">from</pre> <pre className="text-green-400">'react'</pre>;
              <pre className="text-blue-400">import</pre> <pre className="text-yellow-400">{'{ VSCodeLayout }'}</pre> <pre className="text-blue-400">from</pre> <pre className="text-green-400">'./components/vscode/layout'</pre>;
              <pre className="text-blue-400">import</pre> <pre className="text-yellow-400">{'{ ThemeProvider }'}</pre> <pre className="text-blue-400">from</pre> <pre className="text-green-400">'./lib/theme'</pre>;
              <br />
              <pre className="text-blue-400">function</pre> <pre className="text-yellow-400">App</pre>() {'{'}
              <div className="ml-4">
                <pre className="text-blue-400">return</pre> (
                <div className="ml-4">
                  {'<'}<pre className="text-yellow-400">ThemeProvider</pre>{'>'}
                  <div className="ml-4">
                    {'<'}<pre className="text-yellow-400">VSCodeLayout</pre>{'>'}
                    <div className="ml-4">
                      {'<'}<pre className="text-yellow-400">div</pre> <pre className="text-blue-400">className</pre>=<pre className="text-green-400">"p-4"</pre>{'>'}
                      <div className="ml-4">
                        {'<'}<pre className="text-yellow-400">h1</pre> <pre className="text-blue-400">className</pre>=<pre className="text-green-400">"text-2xl font-bold mb-4"</pre>{'>'}
                          Welcome to VibeCode
                        {'</'}<pre className="text-yellow-400">h1</pre>{'>'}
                        <br />
                        {'<'}<pre className="text-yellow-400">p</pre>{'>'}
                          A VS Code-like interface for collaborative coding.
                        {'</'}<pre className="text-yellow-400">p</pre>{'>'}
                      </div>
                      {'</'}<pre className="text-yellow-400">div</pre>{'>'}
                    </div>
                    {'</'}<pre className="text-yellow-400">VSCodeLayout</pre>{'>'}
                  </div>
                  {'</'}<pre className="text-yellow-400">ThemeProvider</pre>{'>'}
                </div>
                );
              </div>
              {'}'}
              <br />
              <pre className="text-blue-400">export default</pre> App;
            </div>
          ) : activeTab === 'index.css' ? (
            <div className="font-mono text-sm">
              <pre className="text-purple-400">@tailwind</pre> base;
              <pre className="text-purple-400">@tailwind</pre> components;
              <pre className="text-purple-400">@tailwind</pre> utilities;
              <br />
              <pre className="text-purple-400">@layer</pre> base {'{'}
              <div className="ml-4">
                <pre className="text-green-400">/* Light theme */</pre>
                .theme-light, :root {'{'}
                <div className="ml-4">
                  --background: <pre className="text-orange-400">0 0% 100%</pre>;
                  --foreground: <pre className="text-orange-400">222.2 84% 4.9%</pre>;
                  <br />
                  --card: <pre className="text-orange-400">0 0% 100%</pre>;
                  --card-foreground: <pre className="text-orange-400">222.2 84% 4.9%</pre>;
                </div>
                {'}'}
              </div>
              {'}'}
            </div>
          ) : (
            <div className="font-mono text-sm">
              <pre className="text-blue-400"># VibeCode</pre>
              <br />
              VibeCode is a browser-based multi-user code editor inspired by tools like Visual Studio Code.
              Each project runs in its own Docker container with real-time collaboration, code execution,
              and AI code assistance built in.
              <br /><br />
              <pre className="text-blue-400">## Features</pre>
              <br />
              - VS Code-like interface
              - Real-time collaboration
              - Integrated terminal
              - AI code assistance
              - Theme customization
            </div>
          )
        )}
      </div>
    </div>
  );
}
