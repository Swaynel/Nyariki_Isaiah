'use client';

import { personalInfo } from '@/config/site';
import type { HeroBotSnapshot } from '@/components/sayan/types';
import { useHeroBotSequence } from '@/components/sections/hero/useHeroBotSequence';

const HERO_INTRO = "I'm Sayan.";
const HERO_SUPPORT =
  "Right now I'm highlighting reliable APIs, scalable backend services, and disciplined system design shaped for production pressure.";
const INTRO_PREFIX = "I'm ";
const INTRO_NAME = 'Sayan';

interface HeroProps {
  onBotChange?: (snapshot: HeroBotSnapshot) => void;
}

export default function Hero({ onBotChange }: HeroProps) {
  const heroMessage = `I speak for the systems behind ${personalInfo.name}'s work. I help you read the architecture faster, understand the engineering choices, and move through the portfolio with context instead of guesswork.`;
  const {
    typedIntro,
    typedMessage,
    typedSupport,
    isTypingIntro,
    isTypingMessage,
    isTypingSupport,
  } = useHeroBotSequence({
    heroIntro: HERO_INTRO,
    heroSupport: HERO_SUPPORT,
    heroMessage,
    onBotChange,
  });

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToProjects = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });

  const introPrefix = typedIntro.slice(0, Math.min(typedIntro.length, INTRO_PREFIX.length));
  const introName =
    typedIntro.length > INTRO_PREFIX.length
      ? typedIntro.slice(INTRO_PREFIX.length, INTRO_PREFIX.length + INTRO_NAME.length)
      : '';
  const introSuffix =
    typedIntro.length > INTRO_PREFIX.length + INTRO_NAME.length
      ? typedIntro.slice(INTRO_PREFIX.length + INTRO_NAME.length)
      : '';

  const tags = ['Node.js', 'TypeScript', 'Distributed Systems'];

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#0e0e0e]"
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

      {/* Ambient glow — upper right */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-amber-500/8 blur-[160px] pointer-events-none" />

      {/* Content pushed right to leave bot space */}
      <div className="container-custom relative z-10 flex min-h-screen items-center justify-end px-6 py-24 lg:pl-[36rem] xl:pl-[40rem]">
        <div className="w-full max-w-2xl lg:ml-auto">

          {/* Status pill */}
          <div
            className="mb-10 inline-flex items-center gap-3 border border-white/[0.07] px-4 py-2"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <span className="flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <span className="text-white/60 text-xs uppercase tracking-[0.25em]">
              Sayan is online
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/30 text-xs tracking-wide">
              AI system persona for {personalInfo.name}
            </span>
          </div>

          {/* Speech card */}
          <div className="relative border border-white/[0.07] bg-white/[0.02] p-8 sm:p-10">
            {/* Amber left accent */}
            <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0" />

            {/* Speech tail pointing left toward the bot */}
            <div className="pointer-events-none absolute -left-3 top-10 h-5 w-5 rotate-45 border-l border-t border-white/[0.07] bg-[#0e0e0e]" />

            {/* Eyebrow */}
            <div
              className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-500"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Message from Sayan
            </div>

            {/* Headline */}
            <h1
              aria-live="polite"
              className="min-h-[3.5rem] text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontStyle: 'italic' }}
            >
              {introPrefix}
              <span className="text-amber-400">{introName}</span>
              {introSuffix}
              {isTypingIntro && (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[0.9em] w-[2px] animate-pulse align-[-0.1em] bg-amber-400"
                />
              )}
            </h1>

            {/* Message body */}
            <p
              aria-live="polite"
              className="mt-6 min-h-[7rem] text-base leading-relaxed text-white/55 sm:text-lg sm:min-h-[5.5rem]"
              style={{ fontFamily: 'system-ui, sans-serif', fontStyle: 'normal' }}
            >
              {typedMessage}
              {isTypingMessage && (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[1em] w-[2px] animate-pulse align-[-0.12em] bg-amber-400"
                />
              )}
            </p>

            {/* Support line */}
            <p
              aria-live="polite"
              className="mt-4 min-h-[4rem] max-w-xl text-sm leading-relaxed text-white/30 sm:text-base sm:min-h-[3.5rem]"
              style={{ fontStyle: 'italic' }}
            >
              {typedSupport}
              {isTypingSupport && (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[1em] w-[2px] animate-pulse align-[-0.12em] bg-amber-400"
                />
              )}
            </p>

            {/* Tech tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-white/10 text-white/30"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={scrollToContact}
                className="group/btn relative inline-flex items-center gap-2 border border-amber-500/50 text-amber-500 px-7 py-3 text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-amber-500 hover:text-[#0e0e0e]"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative">Talk to {personalInfo.name.split(' ')[0]}</span>
                <span className="relative">→</span>
              </button>

              <button
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 border border-white/10 text-white/40 px-7 py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:border-white/30 hover:text-white/70"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Show Me the Work
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}