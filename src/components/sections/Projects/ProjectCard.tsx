import { Project } from '@/types';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Preview area */}
      <div className="relative h-52 overflow-hidden bg-white/[0.02] border-b border-white/[0.07]">
        {project.demoUrl ? (
          <iframe
            src={project.demoUrl}
            title={`${project.title} live preview`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full border-0 bg-[#0e0e0e] opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        ) : project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="text-white/10 text-xs uppercase tracking-[0.3em]"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              No preview
            </span>
          </div>
        )}

        {/* Scrim so preview fades into card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0e0e0e]/80 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="text-white text-xl leading-snug mb-3 group-hover:text-amber-100 transition-colors duration-300"
          style={{ fontStyle: 'italic', fontWeight: 400 }}
        >
          {project.title}
        </h3>

        <p
          className="text-white/45 text-sm leading-relaxed mb-5 group-hover:text-white/60 transition-colors duration-300"
          style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'normal' }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-white/10 text-white/30 group-hover:border-amber-500/30 group-hover:text-amber-500/70 transition-all duration-300"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        {project.link && project.link !== '#' && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-xs uppercase tracking-[0.25em] transition-colors duration-300"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Visit Site
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}