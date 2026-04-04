'use client';

import { useState } from 'react';
import { projects } from '@/config/site';
import { cn } from '@/lib/utils';
import { ProjectFilter as ProjectFilterType, Project } from '@/types';
import type { StageBotBehavior } from '@/components/sayan/types';
import ProjectCard from './ProjectCard';
import ProjectFilterComponent from './ProjectFilter';
import { useProjectsShowcaseSequence } from './useProjectsShowcaseSequence';

interface ProjectsProps {
  onBotChange?: (behavior: StageBotBehavior) => void;
}

export default function Projects({ onBotChange }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');

  const allTags = Array.from(new Set(projects.flatMap((p: Project) => p.tags))) as string[];
  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p: Project) => p.tags.includes(activeFilter));

  const { sectionRef, phase, visibleCount, activeProjectIndex } =
    useProjectsShowcaseSequence(filteredProjects, onBotChange);

  const statusLabel =
    phase === 'presenting' && activeProjectIndex >= 0
      ? `Now presenting — ${filteredProjects[activeProjectIndex]?.title}`
      : phase === 'complete'
      ? 'Showcase complete'
      : 'Preparing showcase…';

  const badgeLabel =
    phase === 'presenting' ? 'Live' : phase === 'complete' ? 'Done' : 'Queued';

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-[calc(100svh+10rem)] overflow-hidden bg-[#0e0e0e] lg:min-h-screen"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Ruled-line texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(255,255,255,0.5) 39px,
            rgba(255,255,255,0.5) 40px
          )`,
        }}
      />

      {/* Ambient glow — top-left this time for variety */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[400px] rounded-full bg-amber-500/8 blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10 flex min-h-[calc(100svh+10rem)] items-start px-6 py-20 lg:min-h-screen lg:px-8 lg:pr-[34rem] xl:pr-[38rem]">
        <div className="w-full max-w-5xl">

          {/* ── Header ── */}
          <div className="mb-20 flex items-end gap-6">
            <div>
              <p
                className="text-amber-500 text-xs uppercase mb-3"
                style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.35em' }}
              >
                Selected work
              </p>
              <h2
                className="text-white leading-none"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                Projects
              </h2>
            </div>
            <div className="mb-4 hidden md:block flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
          </div>

          {/* ── Status bar ── */}
          <div className="mb-8 flex items-center justify-between gap-4 border border-white/[0.07] px-5 py-3">
            <p
              className="text-white/40 text-xs truncate"
              style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'italic' }}
            >
              {statusLabel}
            </p>
            <span
              className={cn(
                'flex-shrink-0 text-[10px] tracking-[0.25em] uppercase px-3 py-1 border',
                phase === 'presenting'
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : phase === 'complete'
                  ? 'border-white/20 text-white/50'
                  : 'border-white/10 text-white/30'
              )}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {badgeLabel}
            </span>
          </div>

          {/* ── Filter strip ── */}
          <div className="mb-10 flex flex-wrap gap-2">
            {(['all', ...allTags] as string[]).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag as ProjectFilterType)}
                className={cn(
                  'text-[10px] uppercase tracking-[0.25em] px-4 py-2 border transition-all duration-300',
                  activeFilter === tag
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                )}
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* ── Project grid ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredProjects.map((project: Project, index) => (
              <div
                key={project.id}
                className={cn(
                  'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  index < visibleCount
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0',
                  // Active project highlight — amber glow instead of sky blue
                  phase === 'presenting' &&
                    index === activeProjectIndex &&
                    'drop-shadow-[0_0_32px_rgba(245,158,11,0.22)]'
                )}
              >
                {/* Active indicator strip */}
                {phase === 'presenting' && index === activeProjectIndex && (
                  <div className="mb-0 h-px bg-gradient-to-r from-amber-500 via-amber-400/60 to-transparent" />
                )}

                {/* Card wrapper */}
                <div
                  className={cn(
                    'group relative border border-white/[0.07] transition-all duration-500 hover:border-amber-500/30',
                    phase === 'presenting' && index === activeProjectIndex
                      ? 'border-amber-500/25 bg-amber-500/[0.03]'
                      : 'bg-white/[0.02]'
                  )}
                >
                  {/* Hover left accent */}
                  <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Index label */}
                  <div
                    className="absolute top-4 right-4 text-white/[0.08] text-xs select-none group-hover:text-white/20 transition-colors duration-300"
                    style={{ fontFamily: 'system-ui, monospace' }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}