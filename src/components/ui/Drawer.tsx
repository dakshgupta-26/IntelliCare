import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl'
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10">
        <div
          className={`w-screen ${widthClasses} bg-surface-100 dark:bg-[#091424] border-l border-slate-700/80 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 animate-slide-in-right`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-surface-200/40 flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-xs font-mono text-slate-400 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg bg-surface-200/50 hover:bg-surface-300 transition-colors cursor-pointer shrink-0 ml-2"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-3.5 sm:px-6 border-t border-slate-800/80 bg-surface-200/40 flex items-center justify-end gap-2.5 sm:gap-3 flex-wrap">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
