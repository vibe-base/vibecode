import React from 'react';
import { useTheme } from '../../lib/theme';

interface CodeFileProps {
  fileName: string;
  language: string;
  content: string;
}

export function CodeFile({ fileName, language, content }: CodeFileProps) {
  const { mode } = useTheme();
  
  // Theme-specific styles
  const getThemeStyles = () => {
    switch (mode) {
      case 'light':
        return {
          background: 'bg-white',
          text: 'text-gray-800',
          lineNumbers: 'text-gray-400',
          lineNumbersBg: 'bg-gray-100',
          border: 'border-gray-200'
        };
      case 'dark':
        return {
          background: 'bg-[#1E1E1E]',
          text: 'text-gray-200',
          lineNumbers: 'text-gray-500',
          lineNumbersBg: 'bg-[#252526]',
          border: 'border-gray-700'
        };
      case 'terminal':
        return {
          background: 'bg-black',
          text: 'text-green-400 font-mono',
          lineNumbers: 'text-green-600 font-mono',
          lineNumbersBg: 'bg-[#0E1E0E]',
          border: 'border-green-900'
        };
      default:
        return {
          background: 'bg-[#1E1E1E]',
          text: 'text-gray-200',
          lineNumbers: 'text-gray-500',
          lineNumbersBg: 'bg-[#252526]',
          border: 'border-gray-700'
        };
    }
  };
  
  const styles = getThemeStyles();
  
  // Split content into lines
  const lines = content.split('\n');
  
  // Calculate line number width based on number of lines
  const lineNumberWidth = `${Math.max(2, String(lines.length).length) * 0.6 + 1}rem`;
  
  return (
    <div className={`flex flex-col h-full ${styles.background} ${styles.text}`}>
      <div className="px-4 py-2 border-b text-sm font-medium flex items-center gap-2">
        <span>{fileName}</span>
        <span className="text-xs opacity-60">({language})</span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Line numbers */}
          <div 
            className={`${styles.lineNumbersBg} ${styles.lineNumbers} text-right p-2 select-none`}
            style={{ minWidth: lineNumberWidth }}
          >
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Code content */}
          <div className="p-2 overflow-x-auto flex-1">
            <pre className="leading-6">
              {lines.map((line, i) => (
                <div key={i}>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
