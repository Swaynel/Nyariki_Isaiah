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

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative min-h-[calc(100svh+8rem)] overflow-hidden bg-card lg:min-h-screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_34%,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(56,189,248,0.06),transparent_28%),linear-gradient(90deg,rgba(248,250,252,0.02)_0%,rgba(248,250,252,0.12)_32%,rgba(226,232,240,0.42)_64%,rgba(226,232,240,0.62)_100%)] dark:bg-[radial-gradient(circle_at_24%_34%,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.22)_32%,rgba(2,6,23,0.7)_64%,rgba(2,6,23,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(226,232,240,0.12))] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.38))]" />

      <div className="container-custom relative z-10 flex min-h-[calc(100svh+8rem)] items-center justify-end px-4 py-20 sm:px-6 lg:min-h-screen lg:px-8 lg:pl-[34rem] xl:pl-[38rem]">
        <div className="w-full max-w-4xl lg:ml-auto">
          <div className="mb-12 lg:text-right">
            <h2 className="relative inline-block text-3xl font-bold font-heading sm:text-4xl">
              Skills
              <span className="absolute bottom-0 left-0 h-1 w-12 bg-primary mt-2" />
            </h2>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-background/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-sky-300/10 dark:bg-slate-950/35">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground dark:text-slate-300">
                Sayan is deploying the stack two at a time, one from each hand, then clustering the full skill set into a stable orbit.
              </p>
              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-sky-200/90">
                {phase === 'throwing'
                  ? 'Launching'
                  : phase === 'orbiting'
                    ? 'Arranging'
                    : phase === 'clapping'
                      ? 'Celebrating'
                      : 'Ready'}
              </span>
            </div>

            <div className="relative h-[30rem] w-full overflow-hidden rounded-[1.75rem] border border-border/60 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_46%)] dark:border-white/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] dark:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/40 dark:border-sky-300/12" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[1.1rem] w-[1.1rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.65)]" />

              {skills.map((skill, index) => {
                const itemLayout = layout[index];
                const isVisible = index < visibleCount;
                const targetX = isOrbiting ? itemLayout.circleX : itemLayout.scatterX;
                const targetY = isOrbiting ? itemLayout.circleY : itemLayout.scatterY;

                return (
                  <div
                    key={skill}
                    className={cn(
                      'absolute will-change-transform',
                      isVisible ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                      left: `${isVisible ? targetX : itemLayout.launchX}%`,
                      top: `${isVisible ? targetY : itemLayout.launchY}%`,
                      transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.35}) rotate(${
                        isOrbiting ? 0 : itemLayout.rotation
                      }deg)`,
                      transitionProperty: 'left, top, transform, opacity',
                      transitionDuration: isOrbiting ? '900ms' : '520ms',
                      transitionTimingFunction: isOrbiting
                        ? 'cubic-bezier(0.22, 1, 0.36, 1)'
                        : 'cubic-bezier(0.2, 0.95, 0.2, 1)',
                    }}
                  >
                    <div className="rounded-full border border-border bg-background/92 px-4 py-2 text-sm font-medium text-foreground shadow-[0_14px_32px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/88">
                      {skill}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
