'use client';

import { skills } from '@/config/site';
import { cn } from '@/lib/utils';
import type { StageBotBehavior } from '@/components/sayan/types';
import { useSkillsOrbitSequence } from '@/components/sections/skills/useSkillsOrbitSequence';

interface SkillsProps {
  onBotChange?: (behavior: StageBotBehavior) => void;
}

export default function Skills({ onBotChange }: SkillsProps) {
  const { sectionRef, layout, phase, visibleCount, isOrbiting } = useSkillsOrbitSequence(
    skills,
    onBotChange
  );

  const phaseLabel =
    phase === 'throwing'
      ? 'Launching skill markers'
      : phase === 'orbiting'
        ? 'Arranging the stack'
        : phase === 'clapping'
          ? 'Wrapping the sequence'
          : 'Ready for the next pass';

  const badgeLabel =
    phase === 'throwing'
      ? 'Launching'
      : phase === 'orbiting'
        ? 'Arranging'
        : phase === 'clapping'
          ? 'Wrapping'
          : 'Ready';

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section-padding relative min-h-[calc(100svh+8rem)] overflow-hidden bg-[#0e0e0e] lg:min-h-screen"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
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

      <div className="absolute top-1/3 left-0 h-[400px] w-[500px] rounded-full bg-amber-500/8 blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10 flex min-h-[calc(100svh+8rem)] items-center justify-end px-6 lg:min-h-screen lg:pl-[34rem] xl:pl-[38rem]">
        <div className="w-full max-w-5xl lg:ml-auto">
          <div className="mb-20 flex items-end gap-6 lg:flex-row-reverse lg:justify-between">
            <div className="lg:text-right">
              <p
                className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Core stack
              </p>
              <h2
                className="leading-none text-white"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                Skills
              </h2>
            </div>
            <div className="mb-4 hidden h-px flex-1 bg-gradient-to-l from-amber-500/50 to-transparent md:block" />
          </div>

          <div className="mb-8 flex items-center justify-between gap-4 border border-white/[0.07] px-5 py-3">
            <p
              className="truncate text-xs text-white/40"
              style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'italic' }}
            >
              {phaseLabel}
            </p>
            <span
              className={cn(
                'flex-shrink-0 border px-3 py-1 text-[10px] uppercase tracking-[0.25em]',
                phase === 'throwing'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : phase === 'orbiting'
                    ? 'border-white/20 text-white/50'
                    : phase === 'clapping'
                      ? 'border-white/20 text-white/45'
                      : 'border-white/10 text-white/30'
              )}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {badgeLabel}
            </span>
          </div>

          <div className="relative h-[30rem] w-full overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_46%)] p-6 md:h-[32rem] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/25" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[1.1rem] w-[1.1rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.65)]" />

            {skills.map((skill, index) => {
              const itemLayout = layout[index];
              const isVisible = index < visibleCount;
              const targetX = isOrbiting ? itemLayout.circleX : itemLayout.scatterX;
              const targetY = isOrbiting ? itemLayout.circleY : itemLayout.scatterY;

              return (
                <div
                  key={skill}
                  className={cn('absolute will-change-transform', isVisible ? 'opacity-100' : 'opacity-0')}
                  style={{
                    left: `${isVisible ? targetX : itemLayout.launchX}%`,
                    top: `${isVisible ? targetY : itemLayout.launchY}%`,
                    transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.35}) rotate(${isOrbiting ? 0 : itemLayout.rotation}deg)`,
                    transitionProperty: 'left, top, transform, opacity',
                    transitionDuration: isOrbiting ? '900ms' : '520ms',
                    transitionTimingFunction: isOrbiting
                      ? 'cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'cubic-bezier(0.2, 0.95, 0.2, 1)',
                  }}
                >
                  <div className="rounded-full border border-white/[0.1] bg-[#0e0e0e]/80 px-4 py-2 text-sm font-medium text-white/75 shadow-[0_14px_32px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-300">
                    {skill}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
