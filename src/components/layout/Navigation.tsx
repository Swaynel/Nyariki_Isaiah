'use client';

import { useState, useEffect } from 'react';
import { personalInfo } from '@/config/site';
import ThemeToggle from './ThemeToggle';
import SidePanel from './SidePanel';
import Link from 'next/link';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="#" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold font-heading group-hover:translate-x-1 transition-transform">
                {personalInfo.name} 💼
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {['about', 'skills', 'projects', 'testimonials', 'contact'].map((item) => (
                <Link
                  key={item}
                  href={`#${item}`}
                  className="text-sm font-medium relative group hover:text-primary transition-colors"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              
              <div className="relative group">
                <button className="text-sm font-medium flex items-center space-x-1 hover:text-primary transition-colors">
                  <span>More</span>
                  <span>▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <a href={`https://github.com/${personalInfo.githubUsername}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                      GitHub
                    </a>
                    <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                      LinkedIn
                    </a>
                    {personalInfo.blogUrl && (
                      <a href={personalInfo.blogUrl} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                        Blog
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <Link href="#contact" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Hire Me
              </Link>
              
              <ThemeToggle />
            </div>

            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SidePanel isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}