import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../lib/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine width based on size
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (mode) {
      case 'light':
        return {
          backdrop: 'bg-black bg-opacity-50',
          modal: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-800',
          closeButton: 'text-gray-500 hover:text-gray-700'
        };
      case 'dark':
        return {
          backdrop: 'bg-black bg-opacity-70',
          modal: 'bg-gray-800',
          border: 'border-gray-700',
          text: 'text-gray-100',
          closeButton: 'text-gray-400 hover:text-gray-200'
        };
      case 'terminal':
        return {
          backdrop: 'bg-black bg-opacity-80',
          modal: 'bg-black',
          border: 'border-green-700',
          text: 'text-green-400 font-mono',
          closeButton: 'text-green-500 hover:text-green-300'
        };
      default:
        return {
          backdrop: 'bg-black bg-opacity-50',
          modal: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-800',
          closeButton: 'text-gray-500 hover:text-gray-700'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${styles.backdrop}`}>
      <div
        ref={modalRef}
        className={`${styles.modal} rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${styles.border}`}>
          <h2 className={`text-xl font-semibold ${styles.text}`}>{title}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
