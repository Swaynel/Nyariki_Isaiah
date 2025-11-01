'use client';

import { useEffect } from 'react';
import { personalInfo } from '@/src/config/site';
import { useTheme } from '@/src/components/providers/ThemeProvider';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { theme } = useTheme();

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

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`fixed top-0 right-0 w-80 h-full ${
        theme === 'light' ? 'bg-white' : 'bg-gray-900'
      } shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 relative h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close menu"
          >
            ✖
          </button>
          
          <h2 className="text-2xl font-bold font-heading mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-primary">
            Menu
          </h2>
          
          <nav className="space-y-2">
            {['about', 'skills', 'projects', 'testimonials', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={onClose}
                className="block px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors relative overflow-hidden group"
              >
                <span className="relative z-10">{item.charAt(0).toUpperCase() + item.slice(1)}</span>
                <div className="absolute left-0 top-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              </a>
            ))}
            
            <div className="pt-4 border-t border-border mt-4">
              <a href={`https://github.com/${personalInfo.githubUsername}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                GitHub
              </a>
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                LinkedIn
              </a>
              {personalInfo.blogUrl && (
                <a href={personalInfo.blogUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                  Blog
                </a>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}