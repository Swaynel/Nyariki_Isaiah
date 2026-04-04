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
      className="relative min-h-[calc(100svh+10rem)] scroll-mt-20 overflow-hidden bg-background lg:min-h-screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.06),transparent_28%),linear-gradient(270deg,rgba(248,250,252,0.02)_0%,rgba(248,250,252,0.12)_32%,rgba(226,232,240,0.42)_64%,rgba(226,232,240,0.62)_100%)] dark:bg-[radial-gradient(circle_at_76%_34%,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(270deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.22)_32%,rgba(2,6,23,0.7)_64%,rgba(2,6,23,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(226,232,240,0.12))] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.38))]" />

      <div className="container-custom relative z-10 flex min-h-[calc(100svh+10rem)] items-center px-4 py-20 sm:px-6 lg:min-h-screen lg:pr-[36rem] lg:px-8 xl:pr-[40rem]">
        <div className="w-full max-w-3xl">
          <h2 className="mb-8 relative inline-block text-3xl font-bold font-heading sm:text-4xl">
            About Me
            <span className="absolute bottom-0 left-0 h-1 w-12 bg-primary mt-2" />
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={cn(
                  'rounded px-0.5 py-0.5 transition-all duration-200',
                  index === activeWordIndex &&
                    'bg-sky-100 font-semibold text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.22)] dark:bg-sky-400/12 dark:text-sky-200 dark:shadow-[0_0_0_1px_rgba(125,211,252,0.2)]'
                )}
              >
                {word}
                {index < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
