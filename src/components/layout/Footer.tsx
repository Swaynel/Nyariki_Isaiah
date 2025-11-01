import { personalInfo } from '@/src/config/site';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-gray-800 text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBkPSJNMCAwIEwxMDAgMCBMMTAwIDEwMCBMMCAxMDAgWiIvPjwvc3ZnPg==')] bg-cover" />
      <div className="container-custom px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-lg mb-6">
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6">
          <a 
            href={`https://github.com/${personalInfo.githubUsername}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl hover:text-primary transition-colors transform hover:-translate-y-1 duration-300"
            aria-label="GitHub"
          >
            <i className="fab fa-github" />
          </a>
          <a 
            href={personalInfo.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl hover:text-primary transition-colors transform hover:-translate-y-1 duration-300"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin" />
          </a>
          {personalInfo.blogUrl && (
            <a 
              href={personalInfo.blogUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-2xl hover:text-primary transition-colors transform hover:-translate-y-1 duration-300"
              aria-label="Blog"
            >
              <i className="fas fa-blog" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}