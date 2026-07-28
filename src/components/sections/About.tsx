'use client';

import { personalInfo } from '@/config/site';
import { cn } from '@/lib/utils';
import { useAboutReading } from '@/components/sections/about/useAboutReading';

export default function About() {
  const { sectionRef, words, activeWordIndex } = useAboutReading(personalInfo.bio);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding relative min-h-[calc(100svh+10rem)] scroll-mt-20 overflow-hidden bg-[#0e0e0e] lg:min-h-screen"
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

      <div className="absolute top-0 right-1/4 h-[320px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 flex min-h-[calc(100svh+10rem)] items-center px-6 lg:min-h-screen lg:pr-[36rem] xl:pr-[40rem]">
        <div className="w-full max-w-4xl">
          <div className="mb-20 flex items-end gap-6">
            <div>
              <p
                className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-500"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Who I am
              </p>
              <h2
                className="leading-none text-white"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                About Me
              </h2>
            </div>
            <div className="mb-4 hidden h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent md:block" />
          </div>

          <div className="relative border border-white/[0.07] bg-white/[0.02] p-8 md:p-10">
            <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0" />
            <div className="pointer-events-none absolute -left-3 top-10 h-5 w-5 rotate-45 border-l border-t border-white/[0.07] bg-[#0e0e0e]" />

            <p
              className="mb-6 text-[10px] uppercase tracking-[0.3em] text-amber-500"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Editorial note
            </p>

            <p className="text-lg leading-relaxed text-white/80 md:text-xl" style={{ fontStyle: 'italic' }}>
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={cn(
                    'rounded px-0.5 py-0.5 transition-all duration-200',
                    index === activeWordIndex &&
                      'bg-amber-500/10 text-amber-100 shadow-[0_0_0_1px_rgba(245,158,11,0.22)]'
                  )}
                >
                  {word}
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>

            <p
              className="mt-6 max-w-2xl text-sm uppercase tracking-[0.25em] text-white/30"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {personalInfo.name} · Backend & systems engineering
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
